// src/services/meliApi.js
const BASE = import.meta.env.VITE_ML_API_BASE || 'https://api.mercadolibre.com'
const DEFAULT_SITE = import.meta.env.VITE_ML_SITE || 'MLC'
const SITE_LIST = (import.meta.env.VITE_ML_SITE_LIST || `${DEFAULT_SITE},MLA,MLM`)
  .split(',').map(s => s.trim()).filter(Boolean)

const DISABLE_ML = import.meta.env.VITE_DISABLE_ML === 'true'
const DEBUG = import.meta.env.VITE_API_DEBUG === 'true'

const log = (...a) => DEBUG && console.log('[offers]', ...a)
const ok  = (res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() }

// -------- helpers fetch ----------
const withCb = (url) => url + (url.includes('?') ? '&' : '?') + `_=${Date.now()}`
const get = (url, opt = {}) => fetch(withCb(url), { cache: 'no-store', ...opt }).then(ok)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]] } return arr }

// -------- normalizadores ----------
const mapML = r => ({
  source: 'ML',
  id: r.id,
  title: r.title,
  price: r.price,
  currency: r.currency_id,
  thumbnail: (r.thumbnail || '').replace(/^http:/,'https:'),
  permalink: r.permalink
})
const mapDummy = p => ({
  source:'Dummy',
  id:p.id, title:p.title, price:p.price, currency:'USD',
  thumbnail:p.thumbnail, permalink:`https://dummyjson.com/products/${p.id}`
})
const mapFake = p => ({
  source:'FakeStore',
  id:p.id, title:p.title, price:p.price, currency:'USD',
  thumbnail:p.image, permalink:`https://fakestoreapi.com/products/${p.id}`
})

// -------- sanitizar/valores ----------
function sanitize(q){
  return String(q||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\(.*?\)/g,' ')
    .replace(/[^a-zA-Z0-9\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim()
}
const DICT = {
  audifonos:'headphones', audifono:'headphone',
  lampara:'lamp', lamparas:'lamps',
  juguete:'toy', juguetes:'toys',
  figura:'figure', figuras:'figures',
  polera:'tshirt', poleras:'tshirts',
  libro:'book', libros:'books',
  futbol:'soccer', balon:'ball', pelota:'ball',
  teclado:'keyboard', mouse:'mouse',
  hogar:'home', iluminacion:'lighting', luz:'light', luces:'lights'
}
const toEnglish = q => sanitize(q).toLowerCase().split(' ').map(t => DICT[t] || t).join(' ')

// -------- APIs ----------
async function searchML(site, q, limit, signal){
  const url = `${BASE}/sites/${site}/search?q=${encodeURIComponent(q)}&limit=${limit}`
  log('ML query', site, q)
  const data = await get(url, { signal })
  const out = (data.results || []).map(mapML)
  log('ML results', site, out.length)
  return out
}

// Con randomize: hace dos pasos para obtener total y elegir un "skip" aleatorio
async function searchDummy(q, limit, signal, { randomize = false } = {}){
  let url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${limit}`
  let data = await get(url, { signal })
  let arr  = Array.isArray(data.products) ? data.products : []

  if (randomize && Number.isFinite(data.total) && data.total > limit) {
    const maxSkip = Math.max(0, data.total - limit)
    const skip = randInt(0, Math.min(maxSkip, 50)) // techo razonable para no ir muy lejos
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    data = await get(url, { signal })
    arr  = Array.isArray(data.products) ? data.products : []
  }

  return arr.slice(0, limit).map(mapDummy)
}

async function searchDummyGeneric(limit, signal){
  const url = `https://dummyjson.com/products?limit=100`
  const data = await get(url, { signal })
  const arr  = Array.isArray(data.products) ? data.products : []
  return shuffle(arr).slice(0, limit).map(mapDummy)
}

async function searchFakeStore(q, limit, signal, { randomize = false } = {}){
  const url = `https://fakestoreapi.com/products`
  const data = await get(url, { signal })
  const arr  = Array.isArray(data) ? data : []
  const ql   = sanitize(q).toLowerCase()
  let filtered = arr.filter(p => (p.title || '').toLowerCase().includes(ql))
  if (!filtered.length) filtered = arr
  if (randomize) shuffle(filtered)
  return filtered.slice(0, limit).map(mapFake)
}

// queryOrList: string | string[]
export async function searchExternalOffers(queryOrList, { limit = 3, timeoutMs = 6000, randomize = false } = {}){
  const base = (Array.isArray(queryOrList) ? queryOrList : [queryOrList])
    .map(q => String(q||'').trim()).filter(Boolean)
  if (base.length === 0) return []

  const queries = [
    ...base.map(sanitize),
    ...base.map(toEnglish),
  ].filter((v,i,a) => v && a.indexOf(v)===i)

  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort('timeout'), timeoutMs)

  try {
    // 1) Mercado Libre (si no está deshabilitado)
    if (!DISABLE_ML) {
      for (const q of queries) {
        for (const site of SITE_LIST) {
          try {
            const r = await searchML(site, q, limit, ac.signal)
            if (r.length) return r
          } catch (e) { log('ML error', site, q, e?.message) }
        }
      }
    }

    // 2) DummyJSON (con random skip)
    for (const q of queries) {
      const r = await searchDummy(q, limit, ac.signal, { randomize })
      if (r.length) return r
    }
    const rg = await searchDummyGeneric(limit, ac.signal)
    if (rg.length) return rg

    // 3) FakeStore (shuffle)
    for (const q of queries) {
      const r = await searchFakeStore(q, limit, ac.signal, { randomize })
      if (r.length) return r
    }

    return []
  } finally {
    clearTimeout(timer)
  }
}