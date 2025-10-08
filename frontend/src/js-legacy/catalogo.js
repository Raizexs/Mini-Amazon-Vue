// Catálogo en Vue 3 con filtros en acordeón, rail centrado y Quick View dentro del app.
const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
  setup(){
    const NS = 'mini.';
    const CART_KEY = NS + 'cart';
    const FAVS_KEY = NS + 'favs';

    const fmtCLP = n => (Number(n||0)).toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});
    const toast = (msg) => {
      const el = document.getElementById('appToast');
      if (!el) return alert(msg);
      el.querySelector('.toast-body').textContent = msg;
      bootstrap.Toast.getOrCreateInstance(el).show();
    };

    // ===== datos =====
    const products = ref([]);
    const categories = ref([]);
    const brands = ref([]);

    // ===== filtros (orden que pediste) =====
    const params = new URLSearchParams(location.search);
    const search = ref((params.get('q')||'').trim());
    const cat = ref('');
    const brand = ref('');
    const rating = ref(null);
    const onlyStock = ref(false);
    const PRICE_PRESETS = [
      { id:'all', label:'Todos', min:null, max:null },
      { id:'p1', label:'Hasta $50.000', min:0, max:50000 },
      { id:'p2', label:'$50.000 – $100.000', min:50000, max:100000 },
      { id:'p3', label:'$100.000 – $200.000', min:100000, max:200000 },
      { id:'p4', label:'Más de $200.000', min:200000, max:null },
    ];
    const pricePreset = ref('all');
    const sort = ref('relevance');

    // ===== paginación =====
    const pageSize = ref(12);
    const page = ref(1);

    // ===== favoritos =====
    const favSet = ref(new Set());
    const isFav = id => favSet.value.has(String(id));
    const toggleFav = (id) => {
      const set = new Set(favSet.value), k = String(id);
      if (set.has(k)) { set.delete(k); toast('Quitado de favoritos.'); }
      else { set.add(k); toast('Añadido a favoritos.'); }
      favSet.value = set;
      localStorage.setItem(FAVS_KEY, JSON.stringify(Array.from(set)));
    };

    // ===== Quick View (modal vive dentro de #catalogApp) =====
    const qv = ref(null);
    const openQuickView = (p) => {
      qv.value = p;
      bootstrap.Modal.getOrCreateInstance(document.getElementById('quickModal')).show();
    };

    // ===== normalizadores =====
    const normalizeProduct = (p) => ({
      id: p.id,
      name: p.name ?? p.titulo ?? 'Producto',
      brand: p.brand ?? p.marca ?? '',
      price: Number(p.price ?? p.precio ?? 0),
      stock: Number(p.stock ?? 0),
      rating: Number(p.rating ?? 0),
      images: p.images ?? p.imagenes ?? [],
      catId: String(p.category_id ?? p.categoryId ?? p.category ?? p.categoria ?? ''),
      catName: String(p.categoryName ?? p.categoriaNombre ?? p.category ?? p.categoria ?? '')
    });
    const normalizeCategories = (raw) => {
      const out = [];
      if (Array.isArray(raw)) {
        raw.forEach((it,i)=>{
          if (typeof it==='string') out.push({id:String(i+1),name:it});
          else out.push({id:String(it.id ?? it.slug ?? it.name ?? it.nombre ?? (i+1)),
                         name:String(it.name ?? it.nombre ?? it.title ?? it.slug ?? 'Categoría')});
        });
      } else if (raw && typeof raw==='object') {
        Object.entries(raw).forEach(([id,name])=> out.push({id:String(id),name:String(name)}));
      }
      const seen=new Set(), ded=[]; out.forEach(c=>{ if(!seen.has(c.id)){ seen.add(c.id); ded.push(c); } });
      return ded;
    };

    // ===== carga =====
    onMounted(async ()=>{
      try{
        const resP = await fetch('data/productos.json'); const rawP = await resP.json();
        products.value = (Array.isArray(rawP)?rawP:[]).map(normalizeProduct);

        const resC = await fetch('data/categorias.json'); const rawC = await resC.json();
        categories.value = normalizeCategories(rawC);

        brands.value = [...new Set(products.value.map(p=>p.brand).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));

        try{ favSet.value = new Set((JSON.parse(localStorage.getItem(FAVS_KEY))||[]).map(String)); }catch{}

        const catQ = params.get('cat') || params.get('categoria');
        if (catQ) {
          const byId = categories.value.find(c => String(c.id).toLowerCase()===String(catQ).toLowerCase());
          const byName = categories.value.find(c => c.name.toLowerCase()===String(catQ).toLowerCase());
          cat.value = (byId || byName)?.id || '';
        }
      }catch(e){
        console.error(e); toast('Error cargando el catálogo');
      }
    });

    // ===== filtrado y orden =====
    const filtered = computed(()=>{
      const q = search.value.trim().toLowerCase();
      const rp = PRICE_PRESETS.find(p=>p.id===pricePreset.value) || PRICE_PRESETS[0];

      const scored = products.value.map(p=>{
        let score=0;
        if(q){
          const hay=(p.name+' '+p.brand+' '+p.catName).toLowerCase();
          if(hay.includes(q)) score+=5;
          if(p.name.toLowerCase().startsWith(q)) score+=3;
          if(p.brand.toLowerCase().includes(q)) score+=1;
        }
        return {p,score};
      });

      let list = scored
        .filter(({p}) => !cat.value || String(p.catId)===String(cat.value))
        .filter(({p}) => !brand.value || p.brand===brand.value)
        .filter(({p}) => (rp.min===null || p.price>=rp.min) && (rp.max===null || p.price<=rp.max))
        .filter(({p}) => rating.value==null || (p.rating||0)>=rating.value)
        .filter(({p}) => !onlyStock.value || p.stock>0);

      switch (sort.value){
        case 'price_asc': list.sort((a,b)=>a.p.price-b.p.price); break;
        case 'price_desc': list.sort((a,b)=>b.p.price-a.p.price); break;
        case 'rating_desc': list.sort((a,b)=>(b.p.rating||0)-(a.p.rating||0)); break;
        case 'name_asc': list.sort((a,b)=>a.p.name.localeCompare(b.p.name,'es')); break;
        default: list.sort((a,b)=>(b.score-a.score)||a.p.name.localeCompare(b.p.name,'es'));
      }
      return list.map(x=>x.p);
    });

    // ===== paginación =====
    const totalPages = computed(()=> Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));
    watch([filtered, pageSize], ()=>{ page.value=1; });
    const pageStart = computed(()=> (page.value-1)*pageSize.value);
    const pageEnd   = computed(()=> pageStart.value + pageSize.value);
    const paged     = computed(()=> filtered.value.slice(pageStart.value, pageEnd.value));
    const pagesToShow = computed(()=>{
      const N=totalPages.value, cur=page.value, span=5;
      const start=Math.max(1, cur-Math.floor(span/2));
      const end=Math.min(N, start+span-1);
      const arr=[]; for(let i=Math.max(1,end-span+1); i<=end; i++) arr.push(i); return arr;
    });

    // ===== acciones =====
    const onImgErr = (e)=>{ const img=e?.target; if(img){ img.onerror=null; img.src='img/placeholder.png'; } };
    const addToCart = (p, qty=1) => {
      const id=String(p.id); let cart;
      try{ cart = JSON.parse(localStorage.getItem(CART_KEY)) || {items:[]}; }catch{ cart={items:[]}; }
      const idx=(cart.items||[]).findIndex(it=>String(it.productId)===id);
      const max=Math.max(1,p.stock||1);
      if(idx>=0){
        const cur={...cart.items[idx]};
        const next=Math.min((Number(cur.qty)||1)+qty,max);
        cart.items.splice(idx,1,{...cur,qty:next});
      }else{
        cart.items.push({productId:id,qty:Math.min(qty,max)});
      }
      localStorage.setItem(CART_KEY, JSON.stringify({...cart,updatedAt:new Date().toISOString()}));
      toast('Producto agregado al carrito.');
    };
    const applyFilters = ()=>{ page.value=1; };
    const resetFilters = ()=>{
      search.value=(new URLSearchParams(location.search).get('q')||'').trim();
      cat.value=''; brand.value=''; pricePreset.value='all'; rating.value=null; onlyStock.value=false;
      sort.value='relevance'; page.value=1;
    };

    return {
      // datos
      products, categories, brands, qv,
      // filtros/orden
      PRICE_PRESETS, search, cat, brand, pricePreset, rating, onlyStock, sort,
      // paginación
      page, pageSize, pageStart, pageEnd, totalPages, pagesToShow,
      // listas
      filtered, paged,
      // favoritos y quick view
      isFav, toggleFav, openQuickView,
      // acciones
      addToCart, onImgErr, applyFilters, resetFilters,
      // utils
      fmtCLP
    };
  }
}).mount('#catalogApp');