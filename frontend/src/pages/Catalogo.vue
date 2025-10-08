<template>
  <div class="row g-4" v-cloak>
    <!-- FILTROS -->
    <aside class="col-12 col-lg-3">
      <div class="accordion filters-acc" id="filtersAcc">
        <!-- Buscar -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="filtSearchH">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#filtSearch" aria-expanded="true">
              <i class="bi bi-search me-2"></i> Buscar
            </button>
          </h2>
          <div id="filtSearch" class="accordion-collapse collapse show" data-bs-parent="#filtersAcc">
            <div class="accordion-body">
              <input class="form-control" v-model.trim="search" placeholder="Nombre o marca…">
            </div>
          </div>
        </div>

        <!-- Categoría -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="filtCatH">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#filtCat">
              <i class="bi bi-grid-3x3-gap me-2"></i> Categoría
            </button>
          </h2>
          <div id="filtCat" class="accordion-collapse collapse" data-bs-parent="#filtersAcc">
            <div class="accordion-body">
              <div class="form-check mb-1">
                <input class="form-check-input" type="radio" name="catRad" id="cat-all" value="" v-model="cat">
                <label class="form-check-label" for="cat-all">Todas</label>
              </div>
              <div class="form-check mb-1" v-for="c in categories" :key="c.id">
                <input class="form-check-input" type="radio" name="catRad" :id="'cat-'+c.id" :value="c.id" v-model="cat">
                <label class="form-check-label" :for="'cat-'+c.id">{{ c.name }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Precio -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="filtPriceH">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#filtPrice">
              <i class="bi bi-cash-coin me-2"></i> Precio
            </button>
          </h2>
          <div id="filtPrice" class="accordion-collapse collapse" data-bs-parent="#filtersAcc">
            <div class="accordion-body">
              <div class="form-check mb-1" v-for="p in PRICE_PRESETS" :key="p.id">
                <input class="form-check-input" type="radio" name="priceRad" :id="'price-'+p.id" :value="p.id" v-model="pricePreset">
                <label class="form-check-label" :for="'price-'+p.id">{{ p.label }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Marca -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="filtBrandH">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#filtBrand">
              <i class="bi bi-tag me-2"></i> Marca
            </button>
          </h2>
          <div id="filtBrand" class="accordion-collapse collapse" data-bs-parent="#filtersAcc">
            <div class="accordion-body">
              <div class="form-check mb-1">
                <input class="form-check-input" type="radio" name="brandRad" id="brand-all" value="" v-model="brand">
                <label class="form-check-label" for="brand-all">Todas</label>
              </div>
              <div class="form-check mb-1" v-for="b in brands" :key="b">
                <input class="form-check-input" type="radio" name="brandRad" :id="'brand-'+b" :value="b" v-model="brand">
                <label class="form-check-label" :for="'brand-'+b">{{ b }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Más filtros -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="filtMoreH">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#filtMore">
              <i class="bi bi-sliders me-2"></i> Más filtros
            </button>
          </h2>
          <div id="filtMore" class="accordion-collapse collapse" data-bs-parent="#filtersAcc">
            <div class="accordion-body">
              <label class="form-label">Rating mínimo</label>
              <select class="form-select mb-3" v-model.number="rating">
                <option :value="null">Todos</option>
                <option :value="4.5">★ 4.5+</option>
                <option :value="4.0">★ 4.0+</option>
                <option :value="3.5">★ 3.5+</option>
              </select>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="stockOnly" v-model="onlyStock">
                <label class="form-check-label" for="stockOnly">
                  <i class="bi bi-box-seam me-1"></i> Solo en stock
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="d-grid gap-2 mt-2">
          <button class="btn btn-primary" @click="applyFilters">
            <i class="bi bi-funnel me-1"></i> Aplicar
          </button>
          <button class="btn btn-outline-secondary" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Limpiar
          </button>
        </div>
      </div>
    </aside>

    <!-- RESULTADOS -->
    <section class="col-12 col-lg-9">
      <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
        <div class="small text-muted">
          Mostrando {{ pageStart+1 }}–{{ Math.min(pageEnd, filtered.length) }} de {{ filtered.length }}
          <span v-if="search">para “{{ search }}”</span>
        </div>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" v-model="sort" style="width:auto">
            <option value="relevance">Relevancia</option>
            <option value="price_asc">Precio ↑</option>
            <option value="price_desc">Precio ↓</option>
            <option value="rating_desc">Rating ↓</option>
            <option value="name_asc">Nombre A–Z</option>
          </select>
          <select class="form-select form-select-sm" v-model.number="pageSize" style="width:auto">
            <option :value="8">8</option>
            <option :value="12">12</option>
            <option :value="24">24</option>
          </select>
        </div>
      </div>

      <div v-if="paged.length===0" class="alert alert-warning">
        No encontramos productos con los filtros actuales.
      </div>

      <div class="row g-3" id="grid">
        <div class="col-6 col-md-4 col-xl-3" v-for="p in paged" :key="p.id">
          <div class="card h-100 product-card position-relative">
            <!-- Rail de acciones -->
            <div class="card-actions">
              <button class="card-action btn" :class="{'text-danger': isFav(p.id)}" @click="toggleFav(p.id)" title="Favorito">
                <i :class="isFav(p.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              </button>
              <button class="card-action btn" @click="openQuickView(p)" title="Vista rápida">
                <i class="bi bi-eye"></i>
              </button>
            </div>

            <RouterLink :to="`/producto/${encodeURIComponent(p.id)}`" class="text-decoration-none">
              <img :src="p.images?.[0] || '/img/placeholder.png'" @error="onImgErr"
                   class="card-img-top" :alt="p.name" style="object-fit:cover;height:180px">
            </RouterLink>

            <div class="card-body d-flex flex-column">
              <div class="small text-muted">{{ p.brand || p.catName || '—' }}</div>
              <h2 class="h6 mb-1">
                <RouterLink :to="`/producto/${encodeURIComponent(p.id)}`" class="link-body-emphasis text-decoration-none">
                  {{ p.name }}
                </RouterLink>
              </h2>
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="fw-semibold">{{ fmtCLP(p.price) }}</div>
                <span class="badge text-bg-warning" v-if="(p.rating||0) > 0">★ {{ (p.rating||0).toFixed(1) }}</span>
              </div>
              <div class="mb-2">
                <span v-if="p.stock>0" class="badge text-bg-success"><i class="bi bi-check2-circle me-1"></i> En stock</span>
                <span v-else class="badge text-bg-secondary"><i class="bi bi-slash-circle me-1"></i> Sin stock</span>
              </div>
              <div class="mt-auto d-grid">
                <button class="btn btn-primary btn-sm" :disabled="p.stock===0" @click="addToCart(p,1)">
                  <i class="bi bi-cart-plus me-1"></i> Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <nav class="mt-3" v-if="totalPages>1">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{disabled: page<=1}">
            <button class="page-link" @click="page=1" aria-label="Primera">&laquo;</button>
          </li>
          <li class="page-item" :class="{disabled: page<=1}">
            <button class="page-link" @click="page--" aria-label="Anterior">&lsaquo;</button>
          </li>
          <li class="page-item" v-for="n in pagesToShow" :key="n" :class="{active: n===page}">
            <button class="page-link" @click="page=n">{{ n }}</button>
          </li>
          <li class="page-item" :class="{disabled: page>=totalPages}">
            <button class="page-link" @click="page++" aria-label="Siguiente">&rsaquo;</button>
          </li>
          <li class="page-item" :class="{disabled: page>=totalPages}">
            <button class="page-link" @click="page=totalPages" aria-label="Última">&raquo;</button>
          </li>
        </ul>
      </nav>
    </section>
  </div>

<ExternalOffers
  v-if="search && search.length >= 3"
  :query="search"
  :limit="6"
/>

  <!-- QUICK VIEW MODAL -->
  <div class="modal fade" id="quickModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="row g-0">
            <div class="col-md-5 p-3 text-center border-end">
              <img :src="qv?.images?.[0] || '/img/placeholder.png'"
                   class="img-fluid" style="max-height:320px;object-fit:contain"
                   @error="onImgErr">
            </div>
            <div class="col-md-7 p-3">
              <div class="small text-muted">{{ qv?.brand || qv?.catName || '—' }}</div>
              <h3 class="h5 mb-1">{{ qv?.name }}</h3>
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="fs-5 fw-semibold">{{ fmtCLP(qv?.price || 0) }}</div>
                <span class="badge text-bg-warning" v-if="(qv?.rating||0) > 0">★ {{ (qv?.rating||0).toFixed(1) }}</span>
              </div>
              <ul class="small text-muted mb-2">
              <li v-for="s in qvSpecs" :key="s.k">
              <strong>{{ s.k }}:</strong> {{ s.v }}
              </li>
              </ul>
              <div class="mb-3">
                <span v-if="(qv?.stock||0)>0" class="badge text-bg-success">En stock</span>
                <span v-else class="badge text-bg-secondary">Sin stock</span>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary" @click="toggleFav(qv.id)">
                  <i :class="isFav(qv?.id) ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i> Favorito
                </button>
                <button class="btn btn-primary" :disabled="(qv?.stock||0)===0" @click="addToCart(qv,1)">
                  <i class="bi bi-cart-plus me-1"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button class="btn btn-primary w-20" @click="gotoProduct(qv)">Ver producto</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExternalOffers from '@/components/ExternalOffers.vue'

const route = useRoute()
const router = useRouter()

/* ====== Estado ====== */
const all = ref([])            // productos normalizados
const categories = ref([])     // [{id, name}]
const brands = ref([])

const search = ref('')
const cat = ref('')            // id de categoría
const pricePreset = ref('all')
const brand = ref('')
const rating = ref(null)       // number | null
const onlyStock = ref(false)

const sort = ref('relevance')
const page = ref(1)
const pageSize = ref(12)

const qv = ref(null)           // Quick view product

/* ====== Presets de precio ====== */
const PRICE_PRESETS = [
  { id: 'all',      label: 'Todos',           min: null,   max: null    },
  { id: 'lt50',     label: 'Hasta $50.000',   min: null,   max:  50000  },
  { id: '50_100',   label: '$50.000–$100.000',min: 50000,  max: 100000  },
  { id: '100_200',  label: '$100.000–$200.000',min:100000, max: 200000  },
  { id: 'gt200',    label: 'Más de $200.000', min: 200000, max: null    },
]

/* ====== Utils ====== */
function fmtCLP (n) {
  try { return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n) }
  catch { return `$${n}` }
}
const onImgErr = e => { e.target.src = '/img/placeholder.png' }

async function fetchJSON (url, fallback = []) {
  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(r.statusText)
    return await r.json()
  } catch { return fallback }
}

 function normalizeProduct (p) {
   return {
     id: p.id,
     name: p.titulo || p.name,
     brand: p.marca || p.brand,
     catId: p.categoria_id || p.catId || p.categoria || null,
     catName: p.categoria || p.catName || null,
     price: p.precio ?? p.price ?? 0,
     images: p.imagenes || p.images || [],
     stock: p.stock ?? 0,
     rating: Number(p.rating ?? p.valoracion ?? 0),
     specs: p.specs || p.especificaciones || p.caracteristicas || null,
   }
 }


function normalizeCategoryList(input) {
  if (!Array.isArray(input)) return []
  return input.map((item) => {
    if (typeof item === 'string') return { id: item.trim(), name: item.trim() }
    if (item && typeof item === 'object') {
      const id   = (item.id ?? item.slug ?? item.value ?? item.name ?? item.titulo ?? item.title ?? '').toString().trim()
      const name = (item.name ?? item.label ?? id).toString().trim()
      if (!id) return null
      return { id, name }
    }
    return null
  }).filter(Boolean)
}

function mergeCategories(primary, fallback) {
  // primary tiene prioridad (archivo), fallback agrega faltantes (deducidos)
  const map = new Map()
  for (const c of primary)  map.set(String(c.id), c)
  for (const c of fallback) if (!map.has(String(c.id))) map.set(String(c.id), c)
  return [...map.values()].sort((a,b)=> a.name.localeCompare(b.name, 'es'))
}

/* ====== Favs (localStorage) ====== */
const favs = ref(new Set())
function loadFavs () {
  try { favs.value = new Set(JSON.parse(localStorage.getItem('mini.favs') || '[]')) }
  catch { favs.value = new Set() }
}
function saveFavs () { localStorage.setItem('mini.favs', JSON.stringify([...favs.value])) }
function isFav (id)  { return favs.value.has(id) }
function toggleFav (id) {
  favs.value.has(id) ? favs.value.delete(id) : favs.value.add(id)
  saveFavs()
}

/* ====== Carrito ====== */
function addToCart (p, q = 1) {
  const key = 'mini.cart'
  let cart = []
  try { cart = JSON.parse(localStorage.getItem(key) || '[]') } catch {}
  const i = cart.findIndex(it => String(it.id) === String(p.id))
  if (i >= 0) cart[i].qty = (cart[i].qty || 1) + q
  else cart.push({ id: p.id, qty: q, precio: p.price, titulo: p.name })
  localStorage.setItem(key, JSON.stringify(cart))

  const el = document.getElementById('appToast')
  if (el && window.bootstrap?.Toast) {
    el.querySelector('.toast-body')?.replaceChildren(document.createTextNode('Agregado al carrito ✅'))
    new window.bootstrap.Toast(el).show()
  }
}

/* ====== Quick View ====== */
function openQuickView (p) {
  qv.value = p
  document.querySelectorAll('.modal-backdrop')?.forEach(n => n.remove())
  const el = document.getElementById('quickModal')
  if (el && window.bootstrap?.Modal) new window.bootstrap.Modal(el).show()
}

const qvSpecs = computed(() => {
  const obj = qv.value?.specs || {}
  const base = Object.entries(obj).slice(0, 3).map(([k,v]) => ({ k, v }))

  if (base.length >= 3) return base

  const extras = []
  if (qv.value?.brand)  extras.push({ k: 'Marca',     v: qv.value.brand })
  if (qv.value?.catName || qv.value?.catId)
                       extras.push({ k: 'Categoría', v: qv.value.catName || qv.value.catId })
  extras.push({ k: 'Stock', v: qv.value?.stock > 0 ? `${qv.value.stock} disp.` : 'Sin stock' })

  return [...base, ...extras].slice(0, 3)
})

/* ====== Filtros/Orden/Paginación ====== */
const priceRange = computed(() => PRICE_PRESETS.find(x => x.id === pricePreset.value) || PRICE_PRESETS[0])

const filtered = computed(() => {
  const q = (search.value || '').toLowerCase()
  const c = cat.value
  const b = (brand.value || '').toLowerCase()
  const rmin = rating.value
  const pr = priceRange.value

  let arr = all.value.filter(p => {
    const nameMatch  = !q || (p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q))
    const catMatch   = !c || (String(p.catId) === String(c) || String(p.catName) === String(c)) // ← AQUÍ
    const brandMatch = !b || (p.brand?.toLowerCase() === b)
    const stockMatch = !onlyStock.value || (p.stock > 0)
    const ratingMatch= !rmin || ((p.rating || 0) >= rmin)
    const priceMatch = (!pr.min || p.price >= pr.min) && (!pr.max || p.price <= pr.max)
    return nameMatch && catMatch && brandMatch && stockMatch && ratingMatch && priceMatch
  })

  switch (sort.value) {
    case 'price_asc':   arr.sort((a,b)=>a.price-b.price); break
    case 'price_desc':  arr.sort((a,b)=>b.price-a.price); break
    case 'rating_desc': arr.sort((a,b)=>(b.rating||0)-(a.rating||0)); break
    case 'name_asc':    arr.sort((a,b)=>String(a.name).localeCompare(String(b.name))); break
    default:            arr.sort((a,b)=>(b.rating||0)-(a.rating||0) || a.price-b.price)
  }
  return arr
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pageStart  = computed(() => (page.value - 1) * pageSize.value)
const pageEnd    = computed(() => pageStart.value + pageSize.value)
const paged      = computed(() => filtered.value.slice(pageStart.value, pageEnd.value))

const pagesToShow = computed(() => {
  const max = totalPages.value
  const cur = page.value
  const arr = []
  const from = Math.max(1, cur - 2)
  const to   = Math.min(max, cur + 2)
  for (let i=from;i<=to;i++) arr.push(i)
  return arr
})

watch([search, cat, pricePreset, brand, rating, onlyStock, sort, pageSize], () => { page.value = 1 })

/* ====== Aplicar/Limpiar (también actualiza la URL) ====== */
function applyFilters () {
  const q = {}
  if (search.value) q.q = search.value
  if (cat.value) q.cat = cat.value
  if (brand.value) q.brand = brand.value
  if (pricePreset.value && pricePreset.value !== 'all') q.price = pricePreset.value
  if (rating.value) q.rating = rating.value
  if (onlyStock.value) q.stock = 1
  router.push({ path: '/catalogo', query: q })
}
function resetFilters () {
  search.value = ''
  cat.value = ''
  pricePreset.value = 'all'
  brand.value = ''
  rating.value = null
  onlyStock.value = false
  applyFilters()
}

function gotoProduct(p) {
  // cierra modal si está abierto
  const el = document.getElementById('quickModal')
  if (el && window.bootstrap?.Modal) {
    const m = window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el)
    m.hide()
  }
  // limpieza defensiva (por si quedó backdrop)
  document.querySelectorAll('.modal-backdrop')?.forEach(n => n.remove())
  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('paddingRight')

  router.push(`/producto/${encodeURIComponent(p.id)}`)
}

/* ====== Carga inicial ====== */
onMounted(async () => {
  loadFavs()
  const [prods, cats] = await Promise.all([
    fetchJSON('/data/productos.json', []),
    fetchJSON('/data/categorias.json', []),
  ])

  const list = Array.isArray(prods) ? prods : (prods?.productos || [])
  all.value = list.map(normalizeProduct)

  // categorías (si no hay archivo, las deducimos)
  const catRaw     = Array.isArray(cats) ? cats : (cats?.categorias || [])
  const fromFile   = normalizeCategoryList(catRaw)
  const fromData   = deduceCategories(all.value)   // {id,name} ya normalizados
  categories.value = mergeCategories(fromFile, fromData)
  brands.value = [...new Set(all.value.map(p => p.brand).filter(Boolean))].sort()

  // semillas desde la URL (?q=... &cat=... &brand=... etc.)
  const q = route.query
  if (typeof q.q === 'string') search.value = q.q
  if (typeof q.cat === 'string') cat.value = q.cat
  if (typeof q.brand === 'string') brand.value = q.brand
  if (typeof q.price === 'string') pricePreset.value = q.price
  if (typeof q.rating === 'string' || typeof q.rating === 'number') rating.value = Number(q.rating)
  if (q.stock != null) onlyStock.value = true
})

function deduceCategories (arr) {
  // de nombre o id presente en cada item
  const map = new Map()
  for (const p of arr) {
    const id = String(p.catId ?? p.catName ?? p.categoria ?? 'otros')
    const name = String(p.catName ?? p.categoria ?? id)
    map.set(id, { id, name })
  }
  return [...map.values()]
}
</script>

<style>
[v-cloak]{ display:none; }
</style>