<template>
  <main class="container py-4" v-cloak>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h4 m-0">Mis pedidos</h1>
      <div class="d-flex align-items-center gap-2">
        <select class="form-select form-select-sm" v-model="filterStatus" style="width:auto">
          <option value="">Todos</option>
          <option value="created">Creado</option>
          <option value="paid">Pagado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>

        <button
          v-if="isDetailMode"
          class="btn btn-sm btn-outline-secondary"
          @click="goBackToList"
          title="Volver a la lista"
        >
          ← Volver
        </button>

        <button class="btn btn-sm btn-outline-secondary" @click="clearHistory" title="Vaciar historial">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <div v-if="ordersSorted.length===0" class="alert alert-info">
      Aún no tienes pedidos. <RouterLink class="alert-link" to="/catalogo">Ir al catálogo</RouterLink>.
    </div>

    <div class="vstack gap-3">
      <div class="card" v-for="(o, idx) in listForRender" :key="o.id">
        <div class="card-body">
          <!-- Encabezado -->
          <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
              <div class="fw-semibold"># {{ o.id }}</div>
              <div class="small text-muted">{{ fmtDate(o.createdAt) }}</div>
            </div>

            <div class="d-flex align-items-center gap-3">
              <span class="badge rounded-pill" :class="statusClass(o.status)">{{ statusText(o.status) }}</span>
              <div class="fs-5 fw-semibold">{{ fmtCLP(o.totals.total) }}</div>

              <button class="btn btn-sm btn-outline-primary" @click="recomprar(o)">
                <i class="bi bi-bag-plus me-1"></i> Recomprar
              </button>

              <button
                v-if="!isDetailMode"
                class="btn btn-sm btn-outline-secondary"
                @click="openDetail(o, idx)"
              >
                {{ openIdx===idx ? 'Ocultar' : 'Ver detalle' }}
              </button>

              <RouterLink v-else class="btn btn-sm btn-outline-secondary" :to="{ path:'/orders' }">
                Volver
              </RouterLink>
            </div>
          </div>

          <!-- Detalle (VERTICAL) -->
          <div v-if="openIdx===idx" class="mt-3 vstack gap-4">
            <!-- Productos -->
            <section>
              <h2 class="h6 mb-2">Productos</h2>
              <div class="vstack gap-2">
                <div class="d-flex align-items-center gap-3" v-for="it in o.items" :key="it.id + '-' + it.name">
                  <img :src="it.img || '/img/placeholder.png'" @error="onImgErr" class="rounded"
                       width="48" height="48" style="object-fit:cover">
                  <div class="flex-grow-1">
                    <div class="small fw-semibold">
                      <RouterLink :to="`/producto/${encodeURIComponent(it.id)}`" class="link-body-emphasis text-decoration-none">
                        {{ it.name }}
                      </RouterLink>
                    </div>
                    <div class="small text-muted">x{{ it.qty }}</div>
                  </div>
                  <div class="small fw-semibold">{{ fmtCLP(it.price * it.qty) }}</div>
                </div>
              </div>
            </section>

            <!-- Resumen -->
            <section>
              <h2 class="h6 mb-2">Resumen</h2>
              <div class="d-flex justify-content-between"><span>Subtotal</span><strong>{{ fmtCLP(o.totals.subtotal) }}</strong></div>
              <div class="d-flex justify-content-between">
                <span>Descuento</span>
                <strong :class="{ 'text-success': o.totals.discount>0 }">
                  {{ o.totals.discount ? '−'+fmtCLP(o.totals.discount) : fmtCLP(0) }}
                </strong>
              </div>
              <div class="d-flex justify-content-between">
                <span>Envío</span>
                <strong>{{ o.totals.shipping ? fmtCLP(o.totals.shipping) : 'Gratis' }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span>IVA</span><strong>{{ fmtCLP(o.totals.iva) }}</strong>
              </div>
              <hr class="my-2">
              <div class="d-flex justify-content-between fs-6">
                <span>Total</span><strong>{{ fmtCLP(o.totals.total) }}</strong>
              </div>
            </section>

            <!-- Envío -->
            <section>
              <h2 class="h6 mb-2">Envío</h2>
              <template v-if="o.shipping.retiro">
                <div class="small">Retiro en tienda</div>
              </template>
              <template v-else>
                <div class="small fw-semibold">
                  {{ o.shipping.method?.nombre || o.shipping.method?.name || '—' }}
                  <span class="text-muted"> ({{ o.shipping.method?.dias || '—' }})</span>
                </div>
                <div class="text-muted small order-address" v-if="o.shipping.address">
                  {{ o.shipping.address.address }}, {{ o.shipping.address.city }}, {{ o.shipping.address.region }}
                  <template v-if="o.shipping.address.depto">, {{ o.shipping.address.depto }}</template>
                  <template v-if="o.shipping.address.notes"> — {{ o.shipping.address.notes }}</template>
                </div>
              </template>

              <div class="mt-2" v-if="o.coupon">
                <span class="badge bg-success">Cupón: {{ o.coupon.code || o.coupon }}</span>
              </div>

              <div class="mt-2 small text-muted">
                Pago: {{ payText(o.pay) }}
              </div>
            </section>
          </div>
          <!-- /Detalle -->
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/* ===== Helpers ===== */
const fmtCLP = n => {
  try { return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n) }
  catch { return `$${n}` }
}
const fmtDate = s => new Date(s).toLocaleString('es-CL', { dateStyle:'medium', timeStyle:'short' })
const onImgErr = e => { e.target.src = '/img/placeholder.png' }
const toast = msg => {
  const el = document.getElementById('appToast')
  if (el) {
    el.querySelector('.toast-body')?.replaceChildren(document.createTextNode(msg))
    if (window.bootstrap?.Toast) new window.bootstrap.Toast(el).show()
  }
}

/* ===== Estado ===== */
const orders = ref([])
const filterStatus = ref('')
const openIdx = ref(-1)
const route = useRoute()
const router = useRouter()

const selectedId = computed(() => (route.params.id || route.query.id || null))
const isDetailMode = computed(() => !!selectedId.value)

/* ===== Normalización ===== */
async function fetchJSON(url, fb = []) {
  try { const r = await fetch(url); if (!r.ok) throw 0; return await r.json() }
  catch { return fb }
}
function readLS(key, fb=[]) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fb)) } catch { return fb } }

function normalizeTotals(src) {
  const t = src?.totals || src?.amounts || {}
  return {
    subtotal: Number(t.subtotal || 0),
    discount: Number(t.discount || 0),
    shipping: Number(t.shipping || 0),
    iva:      Number(t.iva || 0),
    total:    Number(t.total || 0),
  }
}
function normalizeShipping(src) {
  const s = src?.shipping || {}
  const method = s.method || (s.id ? { id:s.id, nombre:s.nombre||s.name, dias:s.dias, costo:s.costo||0 } : null)
  const retiro = !!(s.retiro || (s.id==='retiro') || s.address==null)
  return { method, address: s.address || null, retiro }
}
function normalizePay(src) {
  const pay = src?.payment || src?.pay || {}
  return { method: pay.method || 'card', last4: pay.last4 || null, label: pay.label || null }
}
function normalizeItems(items, productMap) {
  return (items || []).map(it => {
    const id = it.id || it.productId
    const prod = productMap.get(String(id))
    return {
      id,
      name: it.titulo || it.name || prod?.titulo || prod?.name || 'Producto',
      qty: Number(it.qty || it.cantidad || 1),
      price: Number(it.precio || it.price || prod?.precio || 0),
      img: it.img || prod?.imagenes?.[0] || prod?.images?.[0] || null,
    }
  })
}

/* ===== Carga ===== */
async function loadOrders() {
  const raw = readLS('mini.orders', [])
  const prodsRaw = await fetchJSON('/data/productos.json', [])
  const list = Array.isArray(prodsRaw) ? prodsRaw : (prodsRaw?.productos || [])
  const productMap = new Map(list.map(p => [String(p.id), p]))

  orders.value = raw.map(o => ({
    id: o.id || `O${Date.now()}`,
    createdAt: o.createdAt || new Date().toISOString(),
    status: o.status || 'created',
    totals: normalizeTotals(o),
    shipping: normalizeShipping(o),
    coupon: o.coupon || null,
    pay: normalizePay(o),
    items: normalizeItems(o.items, productMap),
  })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/* ===== UI ===== */
const ordersSorted = computed(() => orders.value)
const ordersFiltered = computed(() =>
  filterStatus.value ? ordersSorted.value.filter(o => o.status === filterStatus.value) : ordersSorted.value
)
const selected = computed(() => orders.value.find(o => String(o.id) === String(selectedId.value)) || null)
const listForRender = computed(() => isDetailMode.value && selected.value ? [selected.value] : ordersFiltered.value)

function statusText(s) {
  return ({ created:'Creado', paid:'Pagado', shipped:'Enviado', delivered:'Entregado', cancelled:'Cancelado' })[s] || 'Creado'
}
function statusClass(s) {
  return ({
    created:'text-bg-warning',   // NARANJO
    paid:'text-bg-primary',
    shipped:'text-bg-info',
    delivered:'text-bg-success',
    cancelled:'text-bg-danger'
  })[s] || 'text-bg-secondary'
}

function openDetail(o, idx) {
  if (openIdx.value === idx) {
    openIdx.value = -1
    router.push({ path: '/orders' })
  } else {
    openIdx.value = idx
    router.push({ path: '/orders', query: { id: o.id } })
  }
}
function goBackToList(){
  openIdx.value = -1
  router.push({ path: '/orders' })
}

watch([listForRender, isDetailMode], () => {
  if (isDetailMode.value) {
    openIdx.value = 0
  } else {
    const id = selectedId.value
    if (!id) { openIdx.value = -1; return }
    const i = ordersFiltered.value.findIndex(o => String(o.id) === String(id))
    openIdx.value = i >= 0 ? i : -1
  }
})

/* ===== Acciones ===== */
function recomprar(o) {
  const key = 'mini.cart'
  let cart = []
  try { cart = JSON.parse(localStorage.getItem(key) || '[]') } catch {}
  for (const it of o.items) {
    const idx = cart.findIndex(x => String(x.id) === String(it.id))
    if (idx >= 0) cart[idx].qty += it.qty
    else cart.push({ id: it.id, qty: it.qty, precio: it.price, titulo: it.name })
  }
  localStorage.setItem(key, JSON.stringify(cart))
  toast('Productos agregados al carrito 🛒')
}
function clearHistory() {
  if (!confirm('¿Seguro que quieres borrar todo el historial de pedidos?')) return
  localStorage.setItem('mini.orders', '[]')
  orders.value = []
  toast('Historial vaciado')
}

/* Texto de pago */
function payText(p){
  if (!p) return '—'
  if (p.method?.startsWith?.('express:')) return `Pago rápido (${p.method.split(':')[1]})`
  if (p.method === 'card') return `Tarjeta ${p.last4 ? '••••'+p.last4 : ''}`.trim()
  if (p.method === 'transfer') return 'Transferencia'
  return p.label || p.method || '—'
}

/* ===== Init ===== */
onMounted(async () => {
  await loadOrders()
  const ok = route.query.ok
  if (ok) toast(`¡Pedido ${ok} confirmado!`)
})
</script>

<style>
[v-cloak]{ display:none; }
/* Evita desbordes en dirección / notas */
.order-address{ white-space:pre-wrap; word-break:break-word; }
</style>