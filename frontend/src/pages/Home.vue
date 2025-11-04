<template>
  <!-- HERO -->
  <section class="hero-wrap p-3 p-md-5 mb-4 mb-md-5">
    <div class="row align-items-center g-4">
      <div class="col-lg-6" data-aos="fade-right" data-aos-duration="800">
        <h1 class="display-mono hero-title mb-3">
          La mejor tecnología<br />
          a tu alcance
        </h1>
        <p class="hero-lead mb-4">
          Descubre nuestra selección premium de productos tecnológicos e
          innovadores: poleras con estilo, libros de IA, lámparas LED, juguetes
          STEAM, pelotas de fútbol y figuras coleccionables. Calidad, buen
          precio y envío rápido en un solo lugar.
        </p>

        <RouterLink to="/catalogo" class="btn btn-primary btn-lg">
          Explorar Productos <i class="bi bi-arrow-right ms-2"></i>
        </RouterLink>

        <div
          class="row text-center mt-5 g-3"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div class="col-4">
            <div class="fw-bold">100+</div>
            <div class="small text-body-secondary">Productos Premium</div>
          </div>
          <div class="col-4">
            <div class="fw-bold">24/7</div>
            <div class="small text-body-secondary">Soporte Técnico</div>
          </div>
          <div class="col-4">
            <div class="fw-bold">48h</div>
            <div class="small text-body-secondary">Envío Express</div>
          </div>
        </div>
      </div>

      <div class="col-lg-6" data-aos="fade-left" data-aos-duration="800">
        <div class="hero-fig mx-auto" style="max-width: 520px">
          <div class="hero-plate"></div>
          <div class="hero-card">
            <img
              src="/img/placeholder.png"
              class="img-fluid rounded-3"
              alt="Audífonos premium"
            />
            <span class="hero-badge">Envío Gratis</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- DESTACADOS -->
  <section class="container py-4">
    <h2 class="section-title text-center mb-2" data-aos="fade-up">
      Destacados
    </h2>
    <p
      class="section-sub text-center mb-4"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      Productos seleccionados para ti
    </p>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else class="row g-3">
      <div
        class="col-6 col-md-4 col-lg-3"
        v-for="(p, idx) in destacados"
        :key="p.id"
        :data-aos="'fade-up'"
        :data-aos-delay="idx * 100"
      >
        <div class="card product-card h-100">
          <div class="position-relative">
            <img :src="imgSrc(p)" class="card-img-top" :alt="p.titulo" />
            <span
              v-if="p.stock === 0"
              class="badge text-bg-secondary position-absolute top-0 start-0 m-2"
              >Sin stock</span
            >

            <div class="card-actions">
              <button
                class="card-action"
                :class="{ 'fav-active': isFav(p.id) }"
                @click="toggleFav(p.id)"
                title="Favorito"
              >
                <i
                  class="bi"
                  :class="isFav(p.id) ? 'bi-heart-fill' : 'bi-heart'"
                ></i>
              </button>
              <RouterLink
                class="card-action"
                :to="`/producto/${encodeURIComponent(p.id)}`"
                title="Ver"
              >
                <i class="bi bi-eye"></i>
              </RouterLink>
            </div>
          </div>

          <div class="card-body">
            <h3 class="h6 mb-1">{{ p.titulo }}</h3>
            <div class="small text-muted">
              {{ p.categoria }} • {{ p.marca }}
            </div>
            <div class="mt-2 fw-semibold">{{ fmtCLP(p.precio) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const cargando = ref(true);
const destacados = ref([]);
const favs = ref(new Set());

function imgSrc(p) {
  // usa la primera imagen o placeholder
  return p?.imagenes?.[0] || "/img/placeholder.png";
}

function loadFavs() {
  try {
    const raw = localStorage.getItem("mini.favs") || "[]";
    favs.value = new Set(JSON.parse(raw));
  } catch {
    favs.value = new Set();
  }
}

function saveFavs() {
  localStorage.setItem("mini.favs", JSON.stringify([...favs.value]));
}

function isFav(id) {
  return favs.value.has(id);
}

function toggleFav(id) {
  if (favs.value.has(id)) favs.value.delete(id);
  else favs.value.add(id);
  saveFavs();
}

function fmtCLP(n) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n}`;
  }
}

onMounted(async () => {
  loadFavs();
  try {
    const res = await fetch("/data/productos.json");
    const all = await res.json();

    // Si tus productos tienen flag "destacado", úsala. Si no, toma 8 primeros.
    const list = Array.isArray(all) ? all : all?.productos || [];
    const d = list.filter((p) => p?.destacado === true);
    destacados.value = (d.length ? d : list).slice(0, 4);
  } catch (e) {
    console.error("Error cargando productos", e);
    destacados.value = [];
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
/* Cursor control for professional UX */
.hero-wrap,
.hero-title,
.hero-lead,
.hero-badge,
.section-title,
.section-sub,
.card-body h3,
.card-body .small,
.fw-bold,
.text-body-secondary {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

/* Allow button pointer cursor */
.btn,
.card-action,
a {
  cursor: pointer;
}
</style>
