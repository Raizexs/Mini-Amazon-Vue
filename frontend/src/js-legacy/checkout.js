// Checkout con Vue 3 – sin imports externos

const { createApp, ref, reactive, computed, onMounted, watch } = Vue;

createApp({
  setup() {
    /* ---------- helpers ---------- */
    const NS = 'mini.';
    const CART_KEY = NS + 'cart';
    const ORDERS_KEY = NS + 'orders';
    const IVA_RATE = 0.19;
    const fmtCLP = n => (Number(n||0)).toLocaleString('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });

    const toast = (msg, variant='info') => {
      const el = document.getElementById('appToast');
      if (!el) return alert(msg);
      el.querySelector('.toast-body').textContent = msg;
      const t = bootstrap.Toast.getOrCreateInstance(el);
      t.show();
    };

    const readCart = () => {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) ?? { items: [] }; }
      catch { return { items: [] }; }
    };
    const writeCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify({ ...c, updatedAt: new Date().toISOString() }));
    const appendOrder = (order) => {
      let list = [];
      try { list = JSON.parse(localStorage.getItem(ORDERS_KEY)) ?? []; } catch {}
      list.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    };

    const normalizeProduct = (p) => ({
      id: p.id,
      name: p.name ?? p.titulo ?? 'Producto',
      brand: p.brand ?? p.marca ?? '',
      category: p.category ?? p.categoria ?? '',
      price: Number(p.price ?? p.precio ?? 0),
      stock: Number(p.stock ?? 0),
      images: p.images ?? p.imagenes ?? [],
      descripcion: p.descripcion ?? p.short_desc ?? ''
    });

    const normalizeEnvio = (e) => ({
      id: String(e.id ?? e.code ?? e.slug ?? ''),
      nombre: e.nombre ?? e.name ?? 'Envío',
      costo: Number(e.costo ?? e.cost ?? e.precio ?? 0),
      dias: e.dias ?? e.sla ?? ''
    });

    const normalizeCoupon = (c) => {
      const code = String(c.code ?? c.codigo ?? '').trim().toUpperCase();
      const raw  = String(c.type ?? c.tipo ?? '').toLowerCase();
      const tipo = /porcentaje|percent/.test(raw) ? 'percent' : /envio|free/.test(raw) ? 'ship' : 'fixed';
      const valor= Number(c.value ?? c.valor ?? 0);
      return { code, type: tipo, value: valor };
    };

    /* ---------- state ---------- */
    const products = ref([]);
    const cart = ref(readCart()); // { items: [{productId, qty}] }
    const envios = ref([]);
    const regiones = ref([]);
    const ciudadesByRegion = ref({}); // { region: [ciudades] }
    const cupones = ref([]);

    const form = reactive({
      envioId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      region: '',
      city: '',
      address: '',
      depto: '',
      notes: ''
    });

    const paymethod = ref('card');
    const payExpress = ref(null);
    const card = reactive({ number:'', exp:'', cvc:'' });

    const couponInput = ref('');
    const appliedCoupon = ref(null);

    const captchaA = ref(0);
    const captchaB = ref(0);
    const captchaInput = ref('');
    const terms = ref(false);

    const errors = reactive({
      firstName:false,lastName:false,email:false,phone:false,
      region:false,city:false,address:false,depto:false,notes:false
    });

    /* ---------- computed ---------- */
    const lines = computed(() => {
      return (cart.value.items || [])
        .map(it => {
          const p = products.value.find(x => String(x.id) === String(it.productId));
          if (!p) return null;
          const qty = Math.max(1, Math.min(Number(it.qty)||1, Math.max(1, p.stock||1)));
          return { p, qty };
        })
        .filter(Boolean);
    });

    const subtotal = computed(() => lines.value.reduce((s, ln) => s + ln.p.price * ln.qty, 0));

    const discountValue = computed(() => {
      if (!appliedCoupon.value) return 0;
      const c = appliedCoupon.value;
      if (c.type === 'percent') return Math.round(subtotal.value * Math.max(0, Math.min(100, c.value))/100);
      if (c.type === 'fixed') return Math.min(subtotal.value, Math.max(0, c.value));
      return 0;
    });

    const currentEnvio = computed(() => envios.value.find(e => e.id === form.envioId) || null);
    const isRetiro = computed(() => currentEnvio.value?.id === 'retiro');

    const shippingFree = computed(() => {
      if (isRetiro.value) return true;
      return appliedCoupon.value?.type === 'ship';
    });
    const shippingCost = computed(() => {
      if (!currentEnvio.value || shippingFree.value) return 0;
      return Number(currentEnvio.value.costo || 0);
    });

    // IVA sobre (subtotal - descuento), sin incluir envío (como tu versión)
    const baseAfterDiscount = computed(() => Math.max(0, subtotal.value - discountValue.value));
    const iva   = computed(() => Math.round(baseAfterDiscount.value * IVA_RATE));
    const total = computed(() => baseAfterDiscount.value + shippingCost.value + iva.value);

    const ciudadesFiltradas = computed(() => {
      const r = form.region;
      const map = ciudadesByRegion.value || {};
      return r && Array.isArray(map[r]) ? map[r] : [];
    });

    const captchaOk = computed(() => Number(captchaInput.value) === (captchaA.value + captchaB.value));

    const canSubmit = computed(() => {
      // básicos
      if (lines.value.length === 0) return false;
      if (!form.envioId) return false;
      if (!form.firstName || form.firstName.length>40) return false;
      if (!form.lastName  || form.lastName.length>40) return false;
      if (!form.email     || form.email.length>80 || !/^\S+@\S+\.\S+$/.test(form.email)) return false;
      if (!/^\+?\d{8,15}$/.test(form.phone)) return false;
      if (!isRetiro.value) {
        if (!form.region || !form.city) return false;
        if (!form.address || form.address.length>100) return false;
        if (form.depto && form.depto.length>20) return false;
      }
      if (form.notes && form.notes.length>200) return false;

      // pago
      if (!payExpress.value && paymethod.value==='card') {
        const numOk = /^\d{13,19}$/.test((card.number||'').replace(/\s+/g,''));
        const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test((card.exp||'').trim());
        const cvcOk = /^\d{3,4}$/.test((card.cvc||'').trim());
        if (!numOk || !expOk || !cvcOk) return false;
      }

      // captcha + términos
      if (!captchaOk.value) return false;
      if (!terms.value) return false;
      return true;
    });

    /* ---------- methods ---------- */
    const onImgErr = (e) => { const img = e?.target; if (img){ img.onerror=null; img.src='img/placeholder.png'; } };

    const sanitizePhone = (e) => {
      let v = (form.phone || '').replace(/[^\d+]/g,'');
      const plus = v.startsWith('+') ? '+' : '';
      v = plus + v.replace(/\D/g,'').slice(0,15);
      form.phone = v;
    };

    const genCaptcha = () => {
      captchaA.value = Math.floor(2 + Math.random()*8);
      captchaB.value = Math.floor(2 + Math.random()*8);
      captchaInput.value = '';
    };

    const selectExpress = (which) => {
      payExpress.value = which;
      paymethod.value = 'transfer'; // oculto tarjeta
      toast('Pago rápido seleccionado: ' + which);
    };

    const applyCoupon = () => {
      const code = (couponInput.value||'').trim().toUpperCase();
      if (!code) { appliedCoupon.value = null; setCouponMsg('Ingresa un cupón.', 'text-danger'); return; }
      const found = cupones.value.find(c => c.code === code);
      if (!found) { appliedCoupon.value = null; setCouponMsg('Cupón inválido.', 'text-danger'); toast('Cupón inválido','danger'); return; }
      appliedCoupon.value = found;
      setCouponMsg('Cupón aplicado: ' + found.code, 'text-success');
      toast('Cupón aplicado','success');
    };

    const setCouponMsg = (text, cls) => {
      const el = document.getElementById('couponMsg');
      if (!el) return;
      el.className = 'form-text ' + (cls||'');
      el.textContent = text;
    };

    const validateFields = () => {
      errors.firstName = !form.firstName || form.firstName.length>40;
      errors.lastName  = !form.lastName  || form.lastName.length>40;
      errors.email     = !form.email || form.email.length>80 || !/^\S+@\S+\.\S+$/.test(form.email);
      errors.phone     = !/^\+?\d{8,15}$/.test(form.phone);
      errors.region    = !isRetiro.value && !form.region;
      errors.city      = !isRetiro.value && !form.city;
      errors.address   = !isRetiro.value && (!form.address || form.address.length>100);
      errors.depto     = !!form.depto && form.depto.length>20;
      errors.notes     = !!form.notes && form.notes.length>200;
    };

    const submitOrder = () => {
      validateFields();
      if (!canSubmit.value) {
        toast('Revisa los campos marcados.', 'danger');
        return;
      }

      const items = lines.value.map(ln => ({
        productId: ln.p.id, name: ln.p.name, price: ln.p.price, qty: ln.qty, img: ln.p.images?.[0] || null
      }));

      const order = {
        id: 'ORD-' + Date.now(),
        createdAt: new Date().toISOString(),
        items,
        amounts: {
          subtotal: subtotal.value,
          discount: discountValue.value,
          shipping: shippingCost.value,
          iva: iva.value,
          total: total.value
        },
        coupon: appliedCoupon.value ? { code: appliedCoupon.value.code, type: appliedCoupon.value.type, value: appliedCoupon.value.value } : null,
        shipping: {
          method: currentEnvio.value ? {
            id: currentEnvio.value.id, nombre: currentEnvio.value.nombre, costo: currentEnvio.value.costo, dias: currentEnvio.value.dias
          } : null,
          address: isRetiro.value ? null : {
            firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone,
            region: form.region, city: form.city, address: form.address, depto: form.depto, notes: form.notes
          },
          retiro: isRetiro.value
        },
        pay: payExpress.value ? ('express:' + payExpress.value) : paymethod.value,
        status: 'created'
      };

      appendOrder(order);
      cart.value = { items: [] };
      writeCart(cart.value);

      const txt = document.getElementById('orderOkText');
      if (txt) txt.textContent = `Tu orden ${order.id} se creó correctamente por ${fmtCLP(order.amounts.total)}.`;
      const modal = new bootstrap.Modal(document.getElementById('orderOkModal'));
      modal.show();
    };

    /* ---------- effects ---------- */
    watch(() => form.region, () => { form.city = ''; });

    watch(isRetiro, (v) => {
      if (v) { form.region=''; form.city=''; form.address=''; form.depto=''; }
    });

    onMounted(async () => {
      try {
        // productos
        const resP = await fetch('data/productos.json'); products.value = (await resP.json()).map(normalizeProduct);

        // limpiar líneas huérfanas
        const valid = new Set(products.value.map(p => String(p.id)));
        cart.value.items = (cart.value.items||[]).filter(it => valid.has(String(it.productId)));
        writeCart(cart.value);

        // envíos
        const resE = await fetch('data/envios.json'); const eRaw = await resE.json();
        envios.value = (Array.isArray(eRaw)?eRaw:[]).map(normalizeEnvio);
        // sin preselección
        form.envioId = '';

        // cupones
        const resC = await fetch('data/cupones.json'); const cRaw = await resC.json();
        cupones.value = (Array.isArray(cRaw)?cRaw:[]).map(normalizeCoupon);

        // localidades: acepta array [{region, ciudades|cities}] o objeto {region: [ciudades]}
        const resL = await fetch('data/localidades.json'); const lRaw = await resL.json();
        if (Array.isArray(lRaw)) {
          const map = {};
          lRaw.forEach(it => {
            const r = it.region || it.name || it.title;
            const arr = it.ciudades || it.cities || [];
            if (r) map[r] = arr;
          });
          regiones.value = Object.keys(map);
          ciudadesByRegion.value = map;
        } else if (lRaw && typeof lRaw === 'object') {
          regiones.value = Object.keys(lRaw);
          ciudadesByRegion.value = lRaw;
        }

        genCaptcha();
      } catch (e) {
        console.error(e);
        toast('Error cargando checkout', 'danger');
      }
    });

    /* ---------- expose to template ---------- */
    return {
      // state
      envios, regiones, ciudadesByRegion, form, paymethod, payExpress, card,
      couponInput, appliedCoupon, captchaA, captchaB, captchaInput, terms, errors,
      // lists
      lines,
      // totals
      subtotal, discountValue, shippingCost, shippingFree, iva, total,
      // derived
      currentEnvio, isRetiro, ciudadesFiltradas, captchaOk,
      // methods
      fmtCLP, onImgErr, sanitizePhone, genCaptcha, selectExpress, applyCoupon, submitOrder,
      // flags
      canSubmit
    };
  }
}).mount('#checkoutApp');