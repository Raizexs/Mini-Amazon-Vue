// src/services/meliApi.js
const BASE = import.meta.env.VITE_ML_API_BASE || "https://api.mercadolibre.com";
const DEFAULT_SITE = import.meta.env.VITE_ML_SITE || "MLC";
const SITE_LIST = (
  import.meta.env.VITE_ML_SITE_LIST || `${DEFAULT_SITE},MLA,MLM`
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const DISABLE_ML = import.meta.env.VITE_DISABLE_ML === "true";
const DEBUG = import.meta.env.VITE_API_DEBUG === "true";
// Config: si attachear enlaces ML a resultados externos
const ATTACH_ML_LINKS =
  (import.meta.env.VITE_ATTACH_ML_LINKS || "true") === "true";
// Límite máximo de items a intentar buscar en ML (por llamada a attachMlLinks)
const ATTACH_ML_LIMIT = Number(import.meta.env.VITE_ATTACH_ML_LIMIT || 5) || 5;
// Usar datos simulados de ML para evitar errores 401
const USE_MOCK_ML = import.meta.env.VITE_USE_MOCK_ML === "true";

// Log de configuración para debugging
const log = (...a) => DEBUG && console.log("[offers]", ...a);
console.log("[offers] Config loaded:", {
  DISABLE_ML,
  DEBUG,
  ATTACH_ML_LINKS,
  ATTACH_ML_LIMIT,
  USE_MOCK_ML,
  SITE_LIST,
  BASE,
});
const ok = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// -------- helpers fetch ----------
const withCb = (url) =>
  url + (url.includes("?") ? "&" : "?") + `_=${Date.now()}`;
const get = (url, opt = {}) =>
  fetch(withCb(url), { cache: "no-store", ...opt }).then(ok);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// -------- normalizadores ----------
const mapML = (r) => ({
  source: "Mercado Libre",
  id: r.id,
  title: r.title,
  price: r.price,
  currency: r.currency_id,
  thumbnail: (r.thumbnail || "").replace(/^http:/, "https:"),
  permalink: r.permalink,
});
// Tasa USD -> CLP configurable via Vite env variable
const USD_TO_CLP = Number(import.meta.env.VITE_USD_TO_CLP_RATE || 1000) || 1000;
const toCLP = (val, cur) => {
  if (!val) return 0;
  try {
    // si la moneda ya es CLP o la tasa es 1, devolver tal cual
    if (!cur || String(cur).toUpperCase() === "CLP") return Number(val);
    if (String(cur).toUpperCase() === "USD")
      return Math.round(Number(val) * USD_TO_CLP);
    // por defecto intentar devolver el valor numérico
    return Number(val);
  } catch {
    return Number(val);
  }
};

const mapDummy = (p) => ({
  source: "Dummy",
  id: p.id,
  title: p.title,
  // Dummy devuelve precios en USD: convertir a CLP usando tasa configurable
  price: toCLP(p.price, "USD"),
  currency: "CLP",
  thumbnail: p.thumbnail,
  // Redirige a búsqueda de Mercado Libre con el título del producto
  permalink: `https://listado.mercadolibre.cl/${encodeURIComponent(
    sanitize(p.title)
  )}`,
});
const mapFake = (p) => ({
  source: "FakeStore",
  id: p.id,
  title: p.title,
  // FakeStore usa USD: convertir a CLP
  price: toCLP(p.price, "USD"),
  currency: "CLP",
  thumbnail: p.image,
  // Redirige a búsqueda de Mercado Libre con el título del producto
  permalink: `https://listado.mercadolibre.cl/${encodeURIComponent(
    sanitize(p.title)
  )}`,
});

// -------- sanitizar/valores ----------
function sanitize(q) {
  return String(q || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const DICT = {
  audifonos: "headphones",
  audifono: "headphone",
  lampara: "lamp",
  lamparas: "lamps",
  juguete: "toy",
  juguetes: "toys",
  figura: "figure",
  figuras: "figures",
  polera: "tshirt",
  poleras: "tshirts",
  libro: "book",
  libros: "books",
  futbol: "soccer",
  balon: "ball",
  pelota: "ball",
  teclado: "keyboard",
  mouse: "mouse",
  hogar: "home",
  iluminacion: "lighting",
  luz: "light",
  luces: "lights",
};
const toEnglish = (q) =>
  sanitize(q)
    .toLowerCase()
    .split(" ")
    .map((t) => DICT[t] || t)
    .join(" ");

// -------- APIs ----------
async function searchML(site, q, limit, signal) {
  const url = `${BASE}/sites/${site}/search?q=${encodeURIComponent(
    q
  )}&limit=${limit}`;
  log("ML query", site, q);
  const data = await get(url, { signal });
  const out = (data.results || []).map(mapML);
  log("ML results", site, out.length);
  return out;
}

// cache simple en memoria para evitar búsquedas repetidas: title -> mlResult|null
const _mlCache = new Map();

// Datos simulados de productos ML para evitar errores 401
const mockMLProducts = [
  {
    id: "smartphone-samsung",
    title: "Smartphone Samsung Galaxy",
    searchTerm: "smartphone samsung galaxy",
  },
  {
    id: "laptop-hp",
    title: "Laptop HP Pavilion",
    searchTerm: "laptop hp pavilion",
  },
  {
    id: "audifonos-sony",
    title: "Audífonos Sony WH-1000XM4",
    searchTerm: "audifonos sony wireless",
  },
  {
    id: "monitor-lg",
    title: "Monitor LG UltraWide",
    searchTerm: "monitor lg ultrawide",
  },
  {
    id: "teclado-logitech",
    title: "Teclado Mecánico Logitech",
    searchTerm: "teclado mecanico logitech",
  },
  {
    id: "mouse-razer",
    title: "Mouse Inalámbrico Razer",
    searchTerm: "mouse inalambrico razer",
  },
  {
    id: "camara-canon",
    title: "Cámara Canon EOS",
    searchTerm: "camara canon eos",
  },
  {
    id: "tablet-ipad",
    title: "Tablet iPad Pro",
    searchTerm: "tablet ipad pro",
  },
  {
    id: "lampara-mesa",
    title: "Lámpara de Mesa LED",
    searchTerm: "lampara mesa led",
  },
  {
    id: "audifono-bluetooth",
    title: "Audífonos Bluetooth",
    searchTerm: "audifonos bluetooth",
  },
];

function findMockMLProduct(title) {
  const searchTerms = sanitize(title)
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 2);
  const scored = mockMLProducts.map((p) => {
    const productTerms = sanitize(p.title).toLowerCase().split(" ");
    const matches = searchTerms.filter((term) =>
      productTerms.some((pTerm) => pTerm.includes(term) || term.includes(pTerm))
    );
    return { product: p, score: matches.length };
  });

  const best = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)[0];
  if (best) {
    // Usar el título original limpio para la búsqueda
    const searchQuery = encodeURIComponent(sanitize(title));
    return {
      source: "Mercado Libre",
      id: best.product.id,
      title: best.product.title,
      price: Math.floor(Math.random() * 500000) + 50000,
      currency: "CLP",
      thumbnail: "/img/placeholder.png",
      permalink: `https://listado.mercadolibre.cl/${searchQuery}`,
    };
  }

  // Si no hay match específico, crear búsqueda genérica del título original
  const fallbackSearch = encodeURIComponent(sanitize(title));
  return {
    source: "Mercado Libre",
    id: `search-${Date.now()}`,
    title: `${title} - Ver en Mercado Libre`,
    price: Math.floor(Math.random() * 300000) + 30000,
    currency: "CLP",
    thumbnail: "/img/placeholder.png",
    permalink: `https://listado.mercadolibre.cl/${fallbackSearch}`,
  };
}
// intenta encontrar un producto en ML por título (retorna el primer match o null)
async function findMLForTitle(title, signal) {
  log("findMLForTitle called", {
    title,
    DISABLE_ML,
    ATTACH_ML_LINKS,
    USE_MOCK_ML,
  });
  if (!title || !ATTACH_ML_LINKS) {
    log("findMLForTitle early return", { title: !!title, ATTACH_ML_LINKS });
    return null;
  }

  const key = sanitize(title).toLowerCase();
  if (_mlCache.has(key)) {
    log("findMLForTitle cache hit", key);
    return _mlCache.get(key);
  }

  // Si usamos datos simulados (para evitar errores 401)
  if (USE_MOCK_ML) {
    log("findMLForTitle using mock data for", title);
    const mock = findMockMLProduct(title);
    if (mock) {
      _mlCache.set(key, mock);
      log("findMLForTitle found mock match", {
        title,
        mlId: mock.id,
        mlTitle: mock.title,
        permalink: mock.permalink,
      });
      return mock;
    } else {
      _mlCache.set(key, null);
      log("findMLForTitle no mock match found", title);
      return null;
    }
  }

  // Si no está deshabilitado ML, intentar búsqueda real
  if (DISABLE_ML) {
    log("findMLForTitle ML disabled");
    return null;
  }

  const q = sanitize(title);
  log("findMLForTitle searching real ML API", {
    original: title,
    sanitized: q,
    sites: SITE_LIST,
  });
  for (const site of SITE_LIST) {
    try {
      const r = await searchML(site, q, 1, signal);
      log("findMLForTitle ML response", {
        site,
        query: q,
        results: r?.length || 0,
      });
      if (r && r.length) {
        _mlCache.set(key, r[0]);
        log("findMLForTitle found real match", {
          title,
          mlId: r[0].id,
          mlTitle: r[0].title,
        });
        return r[0];
      }
    } catch (e) {
      log("findML error", site, q, e?.message);
      console.error("ML API Error:", e);
    }
  }
  _mlCache.set(key, null);
  log("findMLForTitle no match found", title);
  return null;
}

// Para cada item externo, intentar adjuntar permalink de ML si existe un match por título
async function attachMlLinks(items, signal) {
  log("attachMlLinks called", { itemsCount: items?.length, ATTACH_ML_LINKS });
  if (!Array.isArray(items) || items.length === 0) return items;
  if (!ATTACH_ML_LINKS) {
    log("attachMlLinks disabled via ATTACH_ML_LINKS");
    return items;
  }
  const out = [];
  // limitar cantidad de búsquedas para evitar mucho tráfico
  const limited = items.slice(0, ATTACH_ML_LIMIT);
  const rest = items.slice(ATTACH_ML_LIMIT);
  log("attachMlLinks processing", {
    limited: limited.length,
    rest: rest.length,
    limit: ATTACH_ML_LIMIT,
  });

  for (const it of limited) {
    let copy = Object.assign({}, it);
    log("attachMlLinks processing item", {
      title: it.title,
      source: it.source,
    });
    try {
      const ml = await findMLForTitle(it.title, signal);
      if (ml) {
        // preservar el precio local, pero redirigir al ML real
        copy.permalink = ml.permalink;
        copy.id = ml.id;
        copy.source = "Mercado Libre";
        copy.thumbnail = copy.thumbnail || ml.thumbnail;
        copy.mlMatched = true;
        log("attached ML link SUCCESS", {
          originalTitle: it.title,
          mlId: ml.id,
          mlTitle: ml.title,
        });
      } else {
        log("attachMlLinks no ML match found for", it.title);
      }
    } catch (e) {
      log("attachMlLinks error", it.title, e?.message);
      console.error("attachMlLinks error:", e);
    }
    out.push(copy);
  }

  // añadir el resto sin intentar buscar para evitar sobrecarga
  for (const it of rest) out.push(it);
  log("attachMlLinks completed", {
    totalOut: out.length,
    withMLMatched: out.filter((i) => i.mlMatched).length,
  });
  return out;
} // Con randomize: hace dos pasos para obtener total y elegir un "skip" aleatorio
async function searchDummy(q, limit, signal, { randomize = false } = {}) {
  let url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
    q
  )}&limit=${limit}`;
  let data = await get(url, { signal });
  let arr = Array.isArray(data.products) ? data.products : [];

  if (randomize && Number.isFinite(data.total) && data.total > limit) {
    const maxSkip = Math.max(0, data.total - limit);
    const skip = randInt(0, Math.min(maxSkip, 50)); // techo razonable para no ir muy lejos
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
      q
    )}&limit=${limit}&skip=${skip}`;
    data = await get(url, { signal });
    arr = Array.isArray(data.products) ? data.products : [];
  }

  return arr.slice(0, limit).map(mapDummy);
}

async function searchDummyGeneric(limit, signal) {
  const url = `https://dummyjson.com/products?limit=100`;
  const data = await get(url, { signal });
  const arr = Array.isArray(data.products) ? data.products : [];
  return shuffle(arr).slice(0, limit).map(mapDummy);
}

async function searchFakeStore(q, limit, signal, { randomize = false } = {}) {
  const url = `https://fakestoreapi.com/products`;
  const data = await get(url, { signal });
  const arr = Array.isArray(data) ? data : [];
  const ql = sanitize(q).toLowerCase();
  let filtered = arr.filter((p) => (p.title || "").toLowerCase().includes(ql));
  if (!filtered.length) filtered = arr;
  if (randomize) shuffle(filtered);
  return filtered.slice(0, limit).map(mapFake);
}

// queryOrList: string | string[]
export async function searchExternalOffers(
  queryOrList,
  { limit = 3, timeoutMs = 6000, randomize = false } = {}
) {
  const base = (Array.isArray(queryOrList) ? queryOrList : [queryOrList])
    .map((q) => String(q || "").trim())
    .filter(Boolean);
  if (base.length === 0) return [];

  const queries = [...base.map(sanitize), ...base.map(toEnglish)].filter(
    (v, i, a) => v && a.indexOf(v) === i
  );

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort("timeout"), timeoutMs);

  try {
    // 1) Mercado Libre (si no está deshabilitado)
    if (!DISABLE_ML) {
      for (const q of queries) {
        for (const site of SITE_LIST) {
          try {
            const r = await searchML(site, q, limit, ac.signal);
            if (r.length) return r;
          } catch (e) {
            log("ML error", site, q, e?.message);
          }
        }
      }
    }

    // 2) DummyJSON (con random skip)
    for (const q of queries) {
      const r = await searchDummy(q, limit, ac.signal, { randomize });
      if (r.length) return await attachMlLinks(r, ac.signal);
    }
    const rg = await searchDummyGeneric(limit, ac.signal);
    if (rg.length) return await attachMlLinks(rg, ac.signal);

    // 3) FakeStore (shuffle)
    for (const q of queries) {
      const r = await searchFakeStore(q, limit, ac.signal, { randomize });
      if (r.length) return await attachMlLinks(r, ac.signal);
    }

    return [];
  } finally {
    clearTimeout(timer);
  }
}
