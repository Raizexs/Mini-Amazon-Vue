<template>
  <main class="container py-4" v-cloak>
    <div
      class="d-flex align-items-center justify-content-between mb-3"
      data-aos="fade-down"
    >
      <h1 class="h4 m-0">
        Favoritos <span class="text-muted fw-normal">({{ favCount }})</span>
      </h1>
      <button
        class="btn btn-sm btn-outline-secondary"
        :disabled="favCount === 0"
        @click="clearFavs"
      >
        <i class="bi bi-trash"></i> Vaciar
      </button>
    </div>

    <div v-if="favCount === 0" class="alert alert-info" data-aos="fade-up">
      Aún no tienes favoritos.
      <RouterLink class="alert-link" to="/catalogo">Ir al catálogo</RouterLink>.
    </div>

    <div v-else class="row g-3">
      <div
        class="col-6 col-md-4 col-lg-3"
        v-for="(p, idx) in favProducts"
        :key="p.id"
        :data-aos="'zoom-in'"
        :data-aos-delay="idx * 80"
      >
        <div class="card h-100 product-card">
          <RouterLink
            :to="`/producto/${encodeURIComponent(p.id)}`"
            class="text-decoration-none"
          >
            <img
              :src="imgOf(p)"
              @error="onImgErr"
              class="card-img-top"
              :alt="p.titulo || p.name"
              style="object-fit: cover; height: 180px"
            />
          </RouterLink>

          <div class="card-body d-flex flex-column">
            <div class="small text-muted">
              {{ p.marca || p.brand || p.categoria || p.catName || "—" }}
            </div>
            <h2 class="h6 mb-2">
              <RouterLink
                :to="`/producto/${encodeURIComponent(p.id)}`"
                class="link-body-emphasis text-decoration-none"
              >
                {{ p.titulo || p.name }}
              </RouterLink>
            </h2>

            <div class="fw-semibold mb-2">
              {{ fmtCLP(p.precio ?? p.price ?? 0) }}
            </div>

            <div class="mb-3">
              <span v-if="(p.stock || 0) > 0" class="badge text-bg-success"
                >En stock</span
              >
              <span v-else class="badge text-bg-secondary">Sin stock</span>
            </div>

            <div class="mt-auto d-grid gap-2">
              <RouterLink
                class="btn btn-sm btn-outline-primary"
                :to="`/producto/${encodeURIComponent(p.id)}`"
              >
                Ver producto
              </RouterLink>
              <button
                class="btn btn-sm btn-primary"
                :disabled="(p.stock || 0) === 0"
                @click="addToCart(p)"
              >
                <i class="bi bi-bag-plus me-1"></i> Agregar al carrito
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="removeFav(p.id)"
              >
                <i class="bi bi-heartbreak me-1"></i> Quitar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

/* ===== Helpers ===== */
const fmtCLP = (n) => {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  } catch {
    return `$${n}`;
  }
};
const imgOf = (p) =>
  p?.imagenes?.[0] || p?.images?.[0] || "/img/placeholder.png";
const onImgErr = (e) => {
  e.target.src = "/img/placeholder.png";
};
const toast = (msg) => {
  const el = document.getElementById("appToast");
  if (el) {
    el.querySelector(".toast-body")?.replaceChildren(
      document.createTextNode(msg)
    );
    if (window.bootstrap?.Toast) new window.bootstrap.Toast(el).show();
  }
};

/* ===== Estado ===== */
const favIds = ref(new Set());
const favProducts = ref([]);

const favCount = computed(() => favProducts.value.length);

/* ===== LocalStorage ===== */
const FAV_KEY = "mini.favs";
const CART_KEY = "mini.cart";

function loadFavs() {
  try {
    favIds.value = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  } catch {
    favIds.value = new Set();
  }
}
function saveFavs() {
  localStorage.setItem(FAV_KEY, JSON.stringify([...favIds.value]));
}

/* ===== Data ===== */
async function fetchJSON(url, fb = []) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw 0;
    return await r.json();
  } catch {
    return fb;
  }
}
function normalizeProduct(p) {
  return {
    id: p.id,
    titulo: p.titulo || p.name,
    name: p.name || p.titulo,
    marca: p.marca || p.brand,
    brand: p.brand || p.marca,
    categoria: p.categoria || p.catName,
    catName: p.catName || p.categoria,
    precio: p.precio ?? p.price ?? 0,
    price: p.price ?? p.precio ?? 0,
    imagenes: p.imagenes || p.images || [],
    images: p.images || p.imagenes || [],
    stock: p.stock ?? 0,
  };
}
async function loadProducts() {
  const raw = await fetchJSON("/data/productos.json", []);
  const list = Array.isArray(raw) ? raw : raw?.productos || [];
  const all = list.map(normalizeProduct);
  favProducts.value = all.filter((p) => favIds.value.has(p.id));
}

/* ===== Acciones ===== */
function removeFav(id) {
  favIds.value.delete(id);
  saveFavs();
  favProducts.value = favProducts.value.filter((p) => p.id !== id);
  toast("Producto quitado de favoritos 💔");
}
function clearFavs() {
  if (!confirm("¿Vaciar todos los favoritos?")) return;
  favIds.value = new Set();
  saveFavs();
  favProducts.value = [];
  toast("Favoritos vaciados");
}
function addToCart(p, q = 1) {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {}
  const i = cart.findIndex((it) => String(it.id) === String(p.id));
  if (i >= 0) cart[i].qty += q;
  else
    cart.push({
      id: p.id,
      qty: q,
      precio: p.precio ?? p.price ?? 0,
      titulo: p.titulo || p.name,
    });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  toast("Agregado al carrito ✅");
}

/* ===== Init ===== */
onMounted(async () => {
  loadFavs();
  await loadProducts();
});
</script>

<style scoped>
[v-cloak] {
  display: none;
}

/* Cursor control for professional UX */
h1,
h2,
.text-muted,
.small,
.fw-normal,
.fw-semibold,
.badge {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

/* Buttons and links */
.btn,
a {
  cursor: pointer;
}
</style>
