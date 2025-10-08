import { getJSON } from "./api.js";

/* === utilidades compartidas === */
export function toast(message, type = "info") {
  const el = document.getElementById("appToast");
  if (!el) { alert(message); return; }           // fallback si no existe el toast
  el.querySelector(".toast-body").textContent = message;
  el.classList.remove("text-bg-success","text-bg-danger","text-bg-info");
  if (type === "success") el.classList.add("text-bg-success");
  else if (type === "danger") el.classList.add("text-bg-danger");
  else el.classList.add("text-bg-info");
  bootstrap.Toast.getOrCreateInstance(el).show();
}

export const fmtCLP = (n) => "$" + Number(n).toLocaleString("es-CL") + " CLP";

/* === Home: cargar destacados === */
function normalize(p){
  return {
    id: p.id,
    name: p.name ?? p.titulo ?? "Producto",
    brand: p.brand ?? p.marca ?? "",
    price: Number(p.price ?? p.precio ?? 0),
    rating: Number(p.rating ?? 0),
    images: p.images ?? p.imagenes ?? [],
    destacado: Boolean(p.destacado ?? (p.tags?.includes?.("destacado")))
  };
}

function cardFeatured(p){
  const img = p.images?.[0] || "img/placeholder.png";
  return `
  <div class="col-12 col-sm-6 col-lg-4">  <!-- antes col-lg-3 -->
    <div class="card h-100 position-relative">
      <img src="${img}" class="card-img-top" alt="${p.name}"
           onerror="this.onerror=null;this.src='img/placeholder.png';">
      <div class="card-body d-flex flex-column">
        <div class="small text-muted mb-1">${p.brand || ""}</div>
        <h6 class="card-title mb-1 text-truncate" title="${p.name}">${p.name}</h6>
        <div class="small text-warning mb-2">${p.rating ? `★ ${p.rating.toFixed(1)}` : ""}</div>
        <div class="mt-auto">
          <div class="fw-bold">${fmtCLP(p.price)}</div>
          <a href="producto.html?id=${p.id}" class="btn btn-outline-secondary btn-sm mt-2 w-100">Ver detalle</a>
        </div>
      </div>
    </div>
  </div>`;
}

async function loadFeatured() {
  try {
    const products = await getJSON("data/productos.json");
    const list = Array.isArray(products) ? products : [];

    // 1) destacados explícitos
    let featured = list.filter(p => p.destacado === true);

    // 2) si hay menos de 3, completa con mejor rating / vendidos
    if (featured.length < 3) {
      const extras = list
        .filter(p => !featured.some(f => String(f.id) === String(p.id)))
        .sort((a, b) =>
          (b.rating || 0) - (a.rating || 0) || (b.vendidos || 0) - (a.vendidos || 0)
        );
      featured = featured.concat(extras.slice(0, 3 - featured.length));
    }

    // 3) deja exactamente 3
    featured = featured.slice(0, 3);

    const grid = document.getElementById("featured");
    if (!grid) return;

    if (!featured.length) {
      grid.innerHTML = `<div class="text-center text-muted w-100">No hay productos destacados por ahora.</div>`;
      return;
    }

    grid.innerHTML = featured
      .map(p => {
        const img   = (p.imagenes?.[0] || p.images?.[0] || "img/placeholder.png");
        const title = p.titulo || p.name || "Producto";
        const brand = p.marca || p.brand || "";
        const price = Number(p.precio ?? p.price ?? 0);

        return `
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100">
              <img src="${img}"
                   onerror="this.onerror=null;this.src='img/placeholder.png';"
                   class="card-img-top" alt="${title}">
              <div class="card-body d-flex flex-column">
                ${brand ? `<div class="small text-muted mb-1">${brand}</div>` : ``}
                <h6 class="card-title mb-2 text-truncate">${title}</h6>
                <div class="mt-auto">
                  <div class="fw-bold">$${price.toLocaleString("es-CL")} CLP</div>
                  <a href="producto.html?id=${p.id}"
                     class="btn btn-sm btn-outline-secondary mt-2 w-100">Ver detalle</a>
                </div>
              </div>
            </div>
          </div>`;
      })
      .join("");
  } catch (e) {
    const grid = document.getElementById("featured");
    if (grid) {
      grid.innerHTML = `<div class="text-center text-muted w-100">No se pudieron cargar los destacados.</div>`;
    }
    try { if (typeof toast === "function") toast("No se pudieron cargar destacados.", "danger"); } catch {}
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", loadFeatured);

(() => {
  const el = document.querySelector('#homeApp');
  if (!el || !window.Vue) return;

  const { createApp, ref, computed, onMounted } = Vue;

  // Utilidades locales (aisladas para no chocar con tus helpers)
  const fmtCLP = (n) => Number(n||0).toLocaleString('es-CL', {
    style: 'currency', currency: 'CLP', maximumFractionDigits: 0
  });

  // Pequeña capa sobre tu store (si ya tienes store en tienda.js, se usa)
  const $store = window.store ?? {
    get: (k, d=null) => {
      try { return JSON.parse(localStorage.getItem('mini.'+k)) ?? d; }
      catch { return d; }
    },
    set: (k, v) => localStorage.setItem('mini.'+k, JSON.stringify(v))
  };

  createApp({
    setup(){
      const cargando    = ref(true);
      const productos   = ref([]);
      const favoritos   = ref($store.get('favs', []));
      const cart        = ref($store.get('cart', []));

      const destacados  = computed(() => productos.value.filter(p => p.destacado)); // 

      const isFav = (id) => favoritos.value.includes(id);
      const toggleFav = (id) => {
        const i = favoritos.value.indexOf(id);
        if (i >= 0) favoritos.value.splice(i,1); else favoritos.value.push(id);
        $store.set('favs', favoritos.value);
      };

      const addToCart = (p) => {
        const idx = cart.value.findIndex(it => it.id === p.id);
        if (idx >= 0) {
          // respeta stock
          const next = {...cart.value[idx]};
          next.qty = Math.min((next.qty||1)+1, Math.max(0, p.stock||0)); // usa "stock" del JSON
          cart.value.splice(idx,1,next);
        } else {
          cart.value.push({ id: p.id, titulo: p.titulo, precio: p.precio, img: p.imagenes?.[0], qty: p.stock>0 ? 1 : 0 });
        }
        $store.set('cart', cart.value);
        (window.toast?.success ?? console.log)(`Agregado: ${p.titulo}`);
      };

      onMounted(async () => {
        try{
          const res = await fetch('data/productos.json');
          productos.value = await res.json(); // campos: id, titulo, precio, stock, imagenes, destacado … 
        }finally{
          cargando.value = false;
        }
      });

      return { cargando, destacados, isFav, toggleFav, addToCart, fmtCLP };
    }
  }).mount('#homeApp');
})();