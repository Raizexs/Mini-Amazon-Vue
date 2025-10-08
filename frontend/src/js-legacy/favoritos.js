// Favoritos con Vue 3 (sin imports externos)
const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup(){
    const NS = 'mini.';
    const CART_KEY = NS + 'cart';
    const FAVS_KEYS = [NS + 'favs', NS + 'favoritos', NS + 'favorites']; // compat
    const PRIMARY_FAVS_KEY = NS + 'favs';

    const fmtCLP = n => (Number(n||0)).toLocaleString('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });
    const toast = (msg, variant='info') => {
      const el = document.getElementById('appToast');
      if (!el) return alert(msg);
      el.querySelector('.toast-body').textContent = msg;
      bootstrap.Toast.getOrCreateInstance(el).show();
    };

    const normalizeProduct = (p) => ({
      id: p.id,
      name: p.name ?? p.titulo ?? 'Producto',
      brand: p.brand ?? p.marca ?? '',
      category: p.category ?? p.categoria ?? '',
      price: Number(p.price ?? p.precio ?? 0),
      stock: Number(p.stock ?? 0),
      images: p.images ?? p.imagenes ?? [],
    });

    // ---- storage helpers
    const readCart = () => {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) ?? { items: [] }; }
      catch { return { items: [] }; }
    };
    const writeCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify({ ...c, updatedAt: new Date().toISOString() }));

    const readFavIds = () => {
      // soporta: [id,...] o [{productId:id}, ...]
      for (const k of FAVS_KEYS) {
        try {
          const raw = JSON.parse(localStorage.getItem(k));
          if (!raw) continue;
          const arr = Array.isArray(raw) ? raw : raw.items || [];
          const ids = arr.map(v => String(v?.productId ?? v?.id ?? v)).filter(Boolean);
          if (ids.length) return Array.from(new Set(ids));
        } catch {}
      }
      return [];
    };
    const writeFavIds = (ids) => {
      const unique = Array.from(new Set(ids.map(String)));
      localStorage.setItem(PRIMARY_FAVS_KEY, JSON.stringify(unique));
    };

    // ---- state
    const products = ref([]);
    const favIds = ref(new Set());   // Set<string>

    const favProducts = computed(() => {
      const idset = favIds.value;
      return products.value.filter(p => idset.has(String(p.id)));
    });
    const favCount = computed(() => favProducts.value.length);

    // ---- actions
    const onImgErr = (e) => { const img = e?.target; if (img){ img.onerror=null; img.src='img/placeholder.png'; } };

    const removeFav = (id) => {
      const next = new Set(favIds.value);
      next.delete(String(id));
      favIds.value = next;
      writeFavIds(Array.from(next));
      toast('Eliminado de favoritos.');
    };

    const clearFavs = () => {
      if (!confirm('¿Vaciar todos los favoritos?')) return;
      favIds.value = new Set();
      writeFavIds([]);
      toast('Favoritos vacíos.');
    };

    const addToCart = (p) => {
      const cart = readCart();
      const id = String(p.id);
      const idx = (cart.items||[]).findIndex(it => String(it.productId) === id);
      if (idx >= 0) {
        const cur = { ...cart.items[idx] };
        const nextQty = Math.min((Number(cur.qty)||1) + 1, Math.max(1, p.stock||1));
        cart.items.splice(idx,1,{ ...cur, qty: nextQty });
      } else {
        cart.items = cart.items || [];
        cart.items.push({ productId: id, qty: Math.min(1, Math.max(1, p.stock||1)) });
      }
      writeCart(cart);
      toast('Agregado al carrito.');
    };

    onMounted(async () => {
      try {
        const res = await fetch('data/productos.json');
        const raw = await res.json();
        products.value = (Array.isArray(raw)?raw:[]).map(normalizeProduct);

        // cargar favoritos y depurar ids inexistentes en catálogo
        const ids = readFavIds();
        const valid = new Set(products.value.map(p => String(p.id)));
        favIds.value = new Set(ids.filter(id => valid.has(String(id))));
        // persistimos depuración en la clave primaria
        writeFavIds(Array.from(favIds.value));
      } catch (e) {
        console.error(e);
        toast('Error cargando favoritos', 'danger');
      }
    });

    return {
      // state
      favProducts, favCount,
      // methods
      fmtCLP, onImgErr, removeFav, clearFavs, addToCart
    };
  }
}).mount('#favsApp');