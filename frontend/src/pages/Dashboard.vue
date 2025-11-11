<template>
  <!-- HERO -->
  <section class="hero-wrap p-3 p-md-5 mb-4 mb-md-5">
    <div class="row align-items-center g-4">
      <div class="col-lg-6">
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

        <div class="row text-center mt-5 g-3">
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

      <div class="col-lg-6">
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
    <h2 class="section-title text-center mb-2">Destacados</h2>
    <p class="section-sub text-center mb-4">Productos seleccionados para ti</p>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else class="row g-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="p in destacados" :key="p.id">
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
/* ===== Animaciones del Dashboard (estilo Login/Register) ===== */

/* Animación de entrada desde la izquierda */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animación de entrada desde la derecha */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animación de escala */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animación de pulso */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Animación desde abajo */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animación de cambio de gradiente */
@keyframes gradientShift {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Animación de flotación de ícono */
@keyframes floatIcon {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Animación deslizante hacia abajo */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Aplicar animaciones a elementos */
.hero-wrap {
  animation: fadeInUp 0.8s ease;
}

.hero-title {
  animation: fadeInLeft 0.8s ease 0.2s backwards;
}

.hero-lead {
  animation: fadeInLeft 0.8s ease 0.3s backwards;
}

.hero-wrap .btn {
  animation: scaleIn 0.6s ease 0.4s backwards;
}

.hero-wrap .row.text-center {
  animation: fadeInUp 0.8s ease 0.5s backwards;
}

.hero-fig {
  animation: fadeInRight 0.8s ease 0.3s backwards;
}

.hero-badge {
  animation: pulse 2s ease-in-out infinite;
}

.hero-plate {
  animation: floatIcon 3s ease-in-out infinite;
}

.section-title {
  animation: fadeInUp 0.6s ease;
}

.section-sub {
  animation: fadeInUp 0.6s ease 0.1s backwards;
}

.product-card {
  animation: scaleIn 0.5s ease backwards;
}

.col-6:nth-child(1) .product-card,
.col-md-4:nth-child(1) .product-card,
.col-lg-3:nth-child(1) .product-card {
  animation-delay: 0.1s;
}

.col-6:nth-child(2) .product-card,
.col-md-4:nth-child(2) .product-card,
.col-lg-3:nth-child(2) .product-card {
  animation-delay: 0.2s;
}

.col-6:nth-child(3) .product-card,
.col-md-4:nth-child(3) .product-card,
.col-lg-3:nth-child(3) .product-card {
  animation-delay: 0.3s;
}

.col-6:nth-child(4) .product-card,
.col-md-4:nth-child(4) .product-card,
.col-lg-3:nth-child(4) .product-card {
  animation-delay: 0.4s;
}

.product-card:hover {
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

/* Mantener el overflow para las animaciones */
.hero-wrap {
  position: relative;
}

/* Spinner con animación */
.spinner-border {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Efecto de aparición suave para todo el contenido */
section {
  animation: fadeInUp 0.6s ease;
}
</style>
