// Orders (historial) con Vue 3 (sin imports externos)
const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup(){
    const NS = 'mini.';
    const ORDERS_KEY = NS + 'orders';
    const CART_KEY   = NS + 'cart';

    const fmtCLP = n => (Number(n||0)).toLocaleString('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });
    const fmtDate = iso => {
      const d = new Date(iso);
      return isNaN(d) ? '—' : d.toLocaleString('es-CL', { dateStyle:'medium', timeStyle:'short' });
    };
    const toast = (msg) => {
      const el = document.getElementById('appToast');
      if (!el) return alert(msg);
      el.querySelector('.toast-body').textContent = msg;
      bootstrap.Toast.getOrCreateInstance(el).show();
    };

    const orders = ref([]);
    const products = ref([]); // para validar stock al recomprar
    const filterStatus = ref('');

    const statusText = (s) => ({
      created: 'Creado',
      paid: 'Pagado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    }[String(s||'created').toLowerCase()] || 'Creado');

    const statusClass = (s) => {
      const k = String(s||'created').toLowerCase();
      if (k==='paid') return 'text-bg-primary';
      if (k==='shipped') return 'text-bg-info';
      if (k==='delivered') return 'text-bg-success';
      if (k==='cancelled') return 'text-bg-secondary';
      return 'text-bg-warning';
    };

    const payText = (p) => {
      const s = String(p||'').toLowerCase();
      if (s.startsWith('express:')) return 'Pago rápido (' + s.split(':')[1] + ')';
      if (s==='card') return 'Tarjeta';
      if (s==='transfer') return 'Transferencia';
      return '—';
    };

    const normalizeOrder = (o) => {
      // compat: amounts / totals, shipping method nombres, etc.
      const amounts = o.amounts || o.totals || {};
      return {
        id: o.id || ('ORD-' + (o.createdAt || Date.now())),
        createdAt: o.createdAt || o.date || new Date().toISOString(),
        status: (o.status || 'created').toLowerCase(),
        items: (o.items || []).map(it => ({
          productId: it.productId ?? it.id ?? it.sku ?? '',
          name: it.name ?? it.titulo ?? 'Producto',
          price: Number(it.price ?? it.precio ?? 0),
          qty: Number(it.qty ?? it.cantidad ?? 1),
          img: it.img ?? it.image ?? null
        })),
        amounts: {
          subtotal: Number(amounts.subtotal ?? 0),
          discount: Number(amounts.discount ?? 0),
          shipping: Number(amounts.shipping ?? amounts.ship ?? 0),
          iva:      Number(amounts.iva ?? amounts.tax ?? 0),
          total:    Number(amounts.total ?? 0)
        },
        coupon: o.coupon ? {
          code: o.coupon.code ?? o.coupon.codigo ?? null,
          type: o.coupon.type ?? o.coupon.tipo ?? null,
          value: Number(o.coupon.value ?? o.coupon.valor ?? 0)
        } : null,
        shipping: {
          retiro: !!(o.shipping?.retiro),
          method: o.shipping?.method ? {
            id: o.shipping.method.id ?? '',
            nombre: o.shipping.method.nombre ?? o.shipping.method.name ?? 'Envío',
            costo: Number(o.shipping.method.costo ?? o.shipping.method.cost ?? 0),
            dias:  o.shipping.method.dias ?? o.shipping.method.sla ?? ''
          } : null,
          address: o.shipping?.address || null
        },
        pay: o.pay || o.paymethod || 'card'
      };
    };

    const readOrders = () => {
      try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) ?? []; }
      catch { return []; }
    };
    const writeCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify({ ...c, updatedAt: new Date().toISOString() }));
    const readCart  = () => {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) ?? { items: [] }; }
      catch { return { items: [] }; }
    };

    const ordersSorted = computed(() => {
      return [...orders.value].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
    const ordersFiltered = computed(() => {
      const s = String(filterStatus.value||'').toLowerCase();
      if (!s) return ordersSorted.value;
      return ordersSorted.value.filter(o => String(o.status||'').toLowerCase() === s);
    });

    const onImgErr = (e) => {
      const img = e?.target;
      if (img) { img.onerror = null; img.src = 'img/placeholder.png'; }
    };

    const clearHistory = () => {
      if (!confirm('¿Vaciar historial de pedidos?')) return;
      localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
      orders.value = [];
      toast('Historial vacío.');
    };

    const recomprar = async (o) => {
      // Reagrega ítems al carrito respetando stock
      const cart = readCart();
      // si no tenemos productos, cargamos
      if (!products.value.length) {
        try {
          const res = await fetch('data/productos.json');
          products.value = await res.json();
        } catch (e) { console.error(e); }
      }
      const stockMap = new Map(products.value.map(p => [String(p.id), Number(p.stock||0)]));

      (o.items || []).forEach(it => {
        const id = String(it.productId);
        const stock = stockMap.has(id) ? stockMap.get(id) : Infinity; // si no está en catálogo, lo dejamos pasar
        const want = Math.max(1, Number(it.qty)||1);

        const idx = (cart.items||[]).findIndex(x => String(x.productId) === id);
        if (idx >= 0) {
          const cur = { ...cart.items[idx] };
          const nextQty = Math.min((Number(cur.qty)||1) + want, stock === Infinity ? (Number(cur.qty)||1) + want : stock);
          cart.items.splice(idx,1,{ ...cur, qty: nextQty });
        } else {
          cart.items.push({ productId: id, qty: Math.min(want, stock === Infinity ? want : stock) });
        }
      });

      writeCart(cart);
      toast('Productos añadidos al carrito.');
      // opcional: redirigir a cart
      // location.href = 'cart.html';
    };

    onMounted(async () => {
      // Carga orders
      orders.value = readOrders().map(normalizeOrder);

      // Si venimos de checkout con ?ok=...
      const ok = new URLSearchParams(location.search).get('ok');
      if (ok) toast('Pedido ' + ok + ' creado correctamente.');
    });

    return {
      // state
      orders, products, filterStatus,
      // lists
      ordersSorted, ordersFiltered,
      // utils
      fmtCLP, fmtDate, statusText, statusClass, payText, onImgErr,
      // actions
      clearHistory, recomprar
    };
  }
}).mount('#ordersApp');