<template>
  <nav aria-label="breadcrumb" class="container">
    <ol class="breadcrumb small">
      <li class="breadcrumb-item">
        <RouterLink to="/catalogo">Catálogo</RouterLink>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        {{ producto?.titulo || "Producto" }}
      </li>
    </ol>
  </nav>

  <main class="container py-4">
    <!-- Carga / Error -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else-if="!producto" class="alert alert-warning">
      Producto no encontrado.
    </div>

    <!-- Vista de producto -->
    <div v-else class="row g-4">
      <!-- Galería -->
      <div
        class="col-12 col-md-6"
        data-aos="fade-right"
        data-aos-duration="700"
      >
        <div class="card">
          <div class="ratio ratio-1x1">
            <img
              :src="imagenes[imgIndex]"
              class="img-fluid object-fit-contain p-3"
              :alt="producto.titulo"
              @error="onImgError"
            />
          </div>
          <div class="d-flex gap-2 p-3 flex-wrap">
            <button
              v-for="(src, i) in imagenes"
              :key="i"
              class="btn btn-outline-secondary p-0"
              :class="{ 'border-2': i === imgIndex }"
              style="width: 70px; height: 70px"
              @click="imgIndex = i"
            >
              <img
                :src="src"
                class="img-fluid object-fit-cover w-100 h-100 rounded"
                @error="onImgError"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="col-12 col-md-6" data-aos="fade-left" data-aos-duration="700">
        <h1 class="h3 mb-1">{{ producto.titulo }}</h1>
        <div class="text-muted small mb-2">
          {{ producto.marca }} • {{ producto.categoria }}
        </div>

        <div class="d-flex align-items-center gap-2 mb-2">
          <div class="h4 m-0">{{ fmtCLP(producto.precio) }}</div>
          <span v-if="producto.stock === 0" class="badge text-bg-secondary"
            >Sin stock</span
          >
          <span v-else class="badge text-bg-success">En stock</span>
        </div>

        <p class="mb-3">{{ producto.descripcion }}</p>

        <div class="d-flex align-items-center gap-2 my-3">
          <button
            class="btn btn-outline-secondary"
            @click="decQty"
            :disabled="qty <= 1"
          >
            −
          </button>
          <input
            class="form-control text-center"
            style="width: 80px"
            type="number"
            min="1"
            :max="producto.stock || 1"
            v-model.number="qty"
          />
          <button
            class="btn btn-outline-secondary"
            @click="incQty"
            :disabled="qty >= producto.stock"
          >
            +
          </button>
        </div>

        <div class="d-flex gap-2">
          <button
            class="btn btn-primary"
            :disabled="producto.stock === 0"
            @click="addToCart"
          >
            <i class="bi bi-bag-plus me-1"></i> Agregar al carrito
          </button>
          <button
            class="btn btn-outline-danger"
            @click="toggleFav(producto.id)"
          >
            <i
              class="bi"
              :class="isFav(producto.id) ? 'bi-heart-fill' : 'bi-heart'"
            ></i>
            {{
              isFav(producto.id) ? "Quitar de favoritos" : "Añadir a favoritos"
            }}
          </button>
        </div>

        <hr class="my-4" />

        <h2 class="h6 mb-2">Especificaciones</h2>
        <dl class="row">
          <template v-for="(val, key) in producto.specs" :key="key">
            <dt class="col-4 text-muted">{{ key }}</dt>
            <dd class="col-8">{{ val }}</dd>
          </template>
        </dl>

        <div class="mt-3">
          <strong>Valoración:</strong>
          <span class="ms-2">
            <i
              v-for="i in 5"
              :key="i"
              class="bi"
              :class="i <= Math.round(ratingProm) ? 'bi-star-fill' : 'bi-star'"
            ></i>
            <span class="small text-muted ms-1">({{ reviews.length }})</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Reviews -->
    <section
      v-if="producto"
      class="mt-5"
      data-aos="fade-up"
      data-aos-duration="600"
    >
      <h3 class="h5 mb-3">Opiniones</h3>

      <div v-if="reviews.length === 0" class="text-muted">
        Aún no hay reseñas.
      </div>
      <div v-else class="vstack gap-3">
        <div v-for="r in reviews" :key="r.id" class="border rounded p-3">
          <div class="d-flex align-items-center justify-content-between">
            <strong>{{ r.autor }}</strong>
            <div>
              <i
                v-for="i in 5"
                :key="i"
                class="bi"
                :class="i <= r.rating ? 'bi-star-fill' : 'bi-star'"
              ></i>
            </div>
          </div>
          <div class="small text-muted">{{ fmtDate(r.fecha) }}</div>
          <p class="mb-0 mt-2">{{ r.comentario }}</p>
        </div>
      </div>

      <form class="mt-4" @submit.prevent="submitReview">
        <div class="row g-2 align-items-center">
          <div class="col-sm-4">
            <input
              class="form-control"
              v-model.trim="formReview.autor"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div class="col-sm-2">
            <select
              class="form-select"
              v-model.number="formReview.rating"
              required
            >
              <option :value="5">5 ★</option>
              <option :value="4">4 ★</option>
              <option :value="3">3 ★</option>
              <option :value="2">2 ★</option>
              <option :value="1">1 ★</option>
            </select>
          </div>
          <div class="col-sm-6">
            <input
              class="form-control"
              v-model.trim="formReview.comentario"
              placeholder="Escribe tu opinión"
              required
            />
          </div>
        </div>
        <button class="btn btn-outline-primary mt-3" type="submit">
          Publicar reseña
        </button>
      </form>
    </section>

    <!-- Ofertas externas (Mercado Libre) -->
    <ExternalOffers v-if="producto" :queries="extQueries" :limit="3" />

    <!-- Relacionados -->
    <section v-if="relacionados.length" class="mt-5" data-aos="fade-up">
      <h3 class="h5 mb-3">También te puede interesar</h3>
      <div class="row g-3">
        <div
          class="col-6 col-md-4 col-lg-3"
          v-for="(p, idx) in relacionados"
          :key="p.id"
          :data-aos="'zoom-in'"
          :data-aos-delay="idx * 100"
        >
          <div class="card h-100">
            <img
              :src="imgUrl(p) || '/img/placeholder.png'"
              class="card-img-top"
              :alt="p.titulo"
              @error="onImgError"
            />
            <div class="card-body">
              <div class="small text-muted">{{ p.categoria }}</div>
              <h4 class="h6">{{ p.titulo }}</h4>
              <div class="fw-semibold">{{ fmtCLP(p.precio) }}</div>
            </div>
            <div class="card-footer bg-transparent">
              <RouterLink
                class="btn btn-sm btn-outline-primary w-100"
                :to="`/producto/${encodeURIComponent(p.id)}`"
              >
                Ver producto
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ExternalOffers from "@/components/ExternalOffers.vue";

const route = useRoute();
const router = useRouter();

/* ---------- Estado ---------- */
const cargando = ref(true);
const producto = ref(null);
const imagenes = ref(["/img/placeholder.png"]);
const imgIndex = ref(0);
const qty = ref(1);

const reviews = ref([]); // {id, autor, rating, comentario, fecha, productId}
const formReview = ref({ autor: "", rating: 5, comentario: "" });

const relacionados = ref([]);
const favIds = ref(new Set()); // Estado reactivo para favoritos

/* ---------- Utilidades ---------- */
const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

// Fecha robusta (evita "Invalid Date")
function fmtDate(d) {
  if (d == null || d === "") return "";
  if (typeof d === "number") {
    const ts = d < 1e12 ? d * 1000 : d; // epoch en segundos → ms
    const dt = new Date(ts);
    return isNaN(dt)
      ? ""
      : dt.toLocaleDateString("es-CL", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
  }
  const dt = new Date(String(d));
  return isNaN(dt)
    ? ""
    : dt.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
}

const onImgError = (e) => {
  e.target.src = "/img/placeholder.png";
};

function getIdParam() {
  return decodeURIComponent(String(route.params.id ?? "")).trim();
}

// Selecciona relacionados: misma categoría primero; si faltan, rellena con top vendidos/destacados de otras categorías.
function pickRelated(all, current, min = 3, max = 8) {
  const out = [];
  const seen = new Set([String(current.id)]);

  // 1) Misma categoría
  const sameCat = all
    .filter(
      (p) =>
        p.categoria === current.categoria && String(p.id) !== String(current.id)
    )
    .sort(
      (a, b) =>
        (b.vendidos || 0) - (a.vendidos || 0) ||
        (b.rating || 0) - (a.rating || 0)
    );

  for (const p of sameCat) {
    if (out.length >= max) break;
    out.push(p);
    seen.add(String(p.id));
  }

  // 2) Si faltan, rellena con otros (destacados / más vendidos)
  if (out.length < min) {
    const fillers = all
      .filter((p) => !seen.has(String(p.id)))
      .sort(
        (a, b) =>
          (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) ||
          (b.vendidos || 0) - (a.vendidos || 0) ||
          (b.rating || 0) - (a.rating || 0)
      );

    for (const p of fillers) {
      if (out.length >= min) break;
      out.push(p);
    }
  }

  return out.slice(0, Math.max(min, Math.min(max, out.length)));
}

/* ---------- Favoritos ---------- */
function loadFavs() {
  try {
    favIds.value = new Set(
      JSON.parse(localStorage.getItem("mini.favs") || "[]")
    );
  } catch {
    favIds.value = new Set();
  }
}
function saveFavs() {
  localStorage.setItem("mini.favs", JSON.stringify([...favIds.value]));
}
function isFav(id) {
  return favIds.value.has(id);
}
function toggleFav(id) {
  if (favIds.value.has(id)) {
    favIds.value.delete(id);
  } else {
    favIds.value.add(id);
  }
  saveFavs();
}

/* ---------- Carrito ---------- */
function addToCart() {
  const key = "mini.cart";
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {}
  const i = cart.findIndex((it) => String(it.id) === String(producto.value.id));
  if (i >= 0)
    cart[i].qty = Math.min(
      (cart[i].qty || 1) + qty.value,
      producto.value.stock || 1e9
    );
  else
    cart.push({
      id: producto.value.id,
      qty: qty.value,
      precio: producto.value.precio,
      titulo: producto.value.titulo,
    });
  localStorage.setItem(key, JSON.stringify(cart));

  const el = document.getElementById("appToast");
  if (el && window.bootstrap?.Toast) {
    el.querySelector(".toast-body")?.replaceChildren(
      document.createTextNode("Agregado al carrito ✅")
    );
    new window.bootstrap.Toast(el).show();
  }
}

/* ---------- Qty ---------- */
const decQty = () => {
  if (qty.value > 1) qty.value--;
};
const incQty = () => {
  if (qty.value < (producto.value?.stock || 1)) qty.value++;
};

/* ---------- Reviews ---------- */
const ratingProm = computed(() => {
  if (!reviews.value.length) return 0;
  const s = reviews.value.reduce((a, r) => a + (Number(r.rating) || 0), 0);
  return s / reviews.value.length;
});

// Normaliza reseñas provenientes del archivo o LS
// --- Aux: enmascara email si no hay nombre
function maskEmail(e) {
  if (!e) return "";
  const [u, d] = String(e).split("@");
  if (!d) return "";
  const m = u.length <= 2 ? u[0] : u[0] + "***" + u.slice(-1);
  return `${m}@${d}`;
}

// --- Normalizador robusto de reseñas
function normalizeReview(r) {
  // intenta múltiples campos para el nombre
  const rawAutor =
    r.autor ??
    r.author ??
    r.nombre ??
    r.name ??
    r.usuario ??
    r.user ??
    r.nickname ??
    r.nick ??
    r.cliente ??
    r.displayName ??
    "";

  const autor =
    String(rawAutor || "").trim() ||
    maskEmail(r.email || r.correo || r.mail) ||
    "Anónimo";

  return {
    id: r.id ?? `srv_${Math.random().toString(36).slice(2)}`,
    autor,
    rating: Number(r.rating ?? r.estrellas ?? 0),
    comentario: r.comentario || r.comment || r.text || "",
    fecha: r.fecha ?? r.date ?? r.createdAt ?? r.time ?? null,
    productId: r.productId ?? r.pid ?? null,
  };
}

function localReviewsKey(pid) {
  return `mini.reviews.${pid}`;
}
function loadLocalReviews(pid) {
  try {
    return JSON.parse(localStorage.getItem(localReviewsKey(pid)) || "[]");
  } catch {
    return [];
  }
}
function saveLocalReviews(pid, list) {
  localStorage.setItem(localReviewsKey(pid), JSON.stringify(list));
}

// --- Guarda siempre con nombre no vacío
function submitReview() {
  const pid = producto.value.id;
  const now = new Date().toISOString();

  const autorSeguro = (formReview.value.autor || "").trim() || "Anónimo";
  const r = {
    id: `l_${Date.now()}`,
    productId: pid,
    fecha: now,
    autor: autorSeguro,
    rating: formReview.value.rating,
    comentario: formReview.value.comentario,
  };

  const locals = [
    normalizeReview(r),
    ...loadLocalReviews(pid).map(normalizeReview),
  ];
  saveLocalReviews(pid, locals);
  reviews.value = [normalizeReview(r), ...reviews.value];
  formReview.value = { autor: "", rating: 5, comentario: "" };

  const el = document.getElementById("appToast");
  if (el && window.bootstrap?.Toast) {
    el.querySelector(".toast-body")?.replaceChildren(
      document.createTextNode("¡Gracias por tu reseña! ⭐")
    );
    new window.bootstrap.Toast(el).show();
  }
}

// ——— Normalización de rutas de imagen ———
function fixSrc(src) {
  if (!src) return "/img/placeholder.png";
  let s = String(src).trim();
  if (s.startsWith("http")) return s;
  if (s.startsWith("/")) return s;
  if (s.startsWith("./")) s = s.slice(2); // ./img/...
  if (s.startsWith("img/")) return `/${s}`; // img/.. -> /img/..
  return `/img/${s.replace(/^\/+/, "")}`; // cualquier otro -> /img/...
}
const imgUrl = (p) => fixSrc(p?.imagenes?.[0] || p?.images?.[0]);

// ——— Query "limpia" para la API externa ———
const extQuery = computed(() => {
  const t = producto.value?.titulo || producto.value?.name || "";
  return t
    .replace(/\(.*?\)/g, " ") // quita paréntesis
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, " ") // <- sin \p{L}
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 4)
    .join(" ");
});

const extQueries = computed(() => {
  const q1 = extQuery.value;
  const q2 = producto.value?.marca || "";
  const q3 = producto.value?.categoria || "";
  return [q1, q2, q3].filter(Boolean);
});

/* ---------- Carga de datos ---------- */
async function fetchJSON(url, fallback = null) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch {
    return fallback;
  }
}

async function loadData() {
  cargando.value = true;
  producto.value = null;
  imagenes.value = ["/img/placeholder.png"];
  imgIndex.value = 0;
  qty.value = 1;
  reviews.value = [];
  relacionados.value = [];

  const id = getIdParam();
  const [allProducts, allReviews] = await Promise.all([
    fetchJSON("/data/productos.json", []),
    fetchJSON("/data/reviews.json", []),
  ]);

  const list = Array.isArray(allProducts)
    ? allProducts
    : allProducts?.productos || [];
  const prod = list.find((p) => String(p.id) === String(id));

  if (!prod) {
    cargando.value = false;
    return;
  }

  producto.value = prod;
  imagenes.value =
    prod.imagenes && prod.imagenes.length
      ? prod.imagenes.map(fixSrc)
      : ["/img/placeholder.png"];

  // Reviews: archivo + locales (normalizadas)
  const rawSrv = (
    Array.isArray(allReviews) ? allReviews : allReviews?.reviews || []
  )
    .filter((r) => String(r.productId ?? r.pid) === String(id))
    .map(normalizeReview);
  const rawLoc = loadLocalReviews(id).map(normalizeReview);

  reviews.value = [...rawLoc, ...rawSrv].sort((a, b) => {
    const da = new Date(a.fecha ?? 0).getTime();
    const db = new Date(b.fecha ?? 0).getTime();
    return (db || 0) - (da || 0);
  });

  // Relacionados por categoría (excluye el mismo)
  const shuffled = [...pickRelated(list, prod, 4, 8)];
  relacionados.value = shuffled;
  cargando.value = false;
}

onMounted(() => {
  loadFavs();
  loadData();
});
watch(
  () => route.params.id,
  () => {
    loadData();
  }
);
</script>

<style scoped>
/* Cursor control for professional UX */
h1,
h2,
h3,
h4,
.text-muted,
.small,
dt,
dd,
.badge,
strong,
.card-body h4 {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

/* Review form inputs should allow text selection */
.form-control,
.form-select {
  cursor: text;
  user-select: text;
  -webkit-user-select: text;
}

/* Buttons and links */
.btn,
a {
  cursor: pointer;
}

/* Quantity input should allow text */
input[type="number"] {
  cursor: text;
  user-select: text;
  -webkit-user-select: text;
}
</style>
