<template>
  <div class="welcome-page">
    <!-- Hero Section con gradiente animado -->
    <section class="hero-section">
      <div class="hero-bg-animation"></div>

      <div class="container hero-content">
        <div class="row align-items-center min-vh-100 py-5">
          <div class="col-lg-6 hero-text" data-aos="fade-right">
            <div class="hero-badge mb-3">
              <i class="bi bi-stars me-2"></i>
              Bienvenido a la experiencia de compra del futuro
            </div>

            <h1 class="hero-title">
              Mini-Amazon
              <span class="hero-title-highlight">Tu tienda de confianza</span>
            </h1>

            <p class="hero-description mb-4">
              Descubre miles de productos premium con la mejor calidad, precios
              competitivos y envíos rápidos. La tecnología más innovadora, todo
              en un solo lugar.
            </p>

            <div class="hero-features mb-5">
              <div
                class="feature-item"
                v-for="(feature, i) in features"
                :key="i"
              >
                <div class="feature-icon">
                  <i :class="feature.icon"></i>
                </div>
                <div>
                  <strong>{{ feature.title }}</strong>
                  <p>{{ feature.desc }}</p>
                </div>
              </div>
            </div>

            <div class="hero-cta">
              <RouterLink
                to="/register"
                class="btn btn-light btn-lg btn-cta btn-white-purple"
              >
                <span><strong>Crear Cuenta</strong></span>
                <i class="bi bi-arrow-right ms-2"></i>
              </RouterLink>

              <RouterLink
                to="/login"
                class="btn btn-outline-light btn-lg btn-cta ms-3"
              >
                <span>Iniciar Sesión</span>
              </RouterLink>
            </div>

            <div class="hero-stats mt-5">
              <div class="stat-item" v-for="(stat, i) in stats" :key="i">
                <div class="stat-number">{{ stat.number }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 hero-visual" data-aos="fade-left">
            <div class="visual-container">
              <!-- Card flotante 1 -->
              <div class="floating-card card-1">
                <div class="card-icon">
                  <i class="bi bi-laptop"></i>
                </div>
                <div class="card-content">
                  <div class="card-title">Tecnología</div>
                  <div class="card-subtitle">+25 productos</div>
                </div>
              </div>

              <!-- Card flotante 2 -->
              <div class="floating-card card-2">
                <div class="card-icon">
                  <i class="bi bi-truck"></i>
                </div>
                <div class="card-content">
                  <div class="card-title">Envío Rápido</div>
                  <div class="card-subtitle">24-48 horas</div>
                </div>
              </div>

              <!-- Card flotante 3 -->
              <div class="floating-card card-3">
                <div class="card-icon">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div class="card-content">
                  <div class="card-title">Compra Segura</div>
                  <div class="card-subtitle">100% protegido</div>
                </div>
              </div>

              <!-- Imagen central con efecto glassmorphism -->
              <div class="main-visual">
                <div class="visual-glass">
                  <img
                    src="/img/placeholder.png"
                    alt="Mini-Amazon"
                    class="visual-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">¿Por qué elegir Mini-Amazon?</h2>
          <p class="section-subtitle">La mejor experiencia de compra online</p>
        </div>

        <div class="row g-4">
          <div
            class="col-md-6 col-lg-3"
            v-for="(benefit, i) in benefits"
            :key="i"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <div class="benefit-card">
              <div class="benefit-icon">
                <i :class="benefit.icon"></i>
              </div>
              <h3 class="benefit-title">{{ benefit.title }}</h3>
              <p class="benefit-text">{{ benefit.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const features = [
  {
    icon: "bi bi-shield-check",
    title: "Compra Segura",
    desc: "Protección total en cada transacción",
  },
  {
    icon: "bi bi-lightning-charge",
    title: "Envío Express",
    desc: "Recibe tus productos en 24-48 horas",
  },
  {
    icon: "bi bi-award",
    title: "Calidad Premium",
    desc: "Productos verificados y garantizados",
  },
];

const stats = [
  { number: "1K+", label: "Clientes Felices" },
  { number: "25+", label: "Productos" },
  { number: "4.7★", label: "Calificación" },
];

const benefits = [
  {
    icon: "bi bi-box-seam",
    title: "Catálogo Amplio",
    text: "Miles de productos en tecnología, moda, libros y más",
  },
  {
    icon: "bi bi-credit-card",
    title: "Pagos Seguros",
    text: "Múltiples métodos de pago con encriptación SSL",
  },
  {
    icon: "bi bi-headset",
    title: "Soporte 24/7",
    text: "Atención al cliente siempre disponible para ti",
  },
  {
    icon: "bi bi-arrow-repeat",
    title: "Devoluciones Fáciles",
    text: "30 días para devolver sin complicaciones",
  },
];

onMounted(() => {
  // Inicializar AOS (Animate On Scroll) si está disponible
  if (typeof window !== "undefined" && window.AOS) {
    window.AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
      offset: 100,
    });
  }
});
</script>

<style scoped>
/* ===== Variables ===== */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --dark-bg: #0f0f1e;
  --card-bg: rgba(255, 255, 255, 0.05);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --text-light: rgba(255, 255, 255, 0.9);
  --text-muted: rgba(255, 255, 255, 0.6);
}

/* ===== Hero Section ===== */
.welcome-page {
  background: var(--dark-bg);
  color: var(--text-light);
  overflow-x: hidden;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.hero-section {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  cursor: default;
}

.hero-bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0.1;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(167, 139, 250, 0.15);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 50px;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease;
  cursor: default;
  user-select: none;
  color: #ffffff;
}

.hero-badge i {
  color: #a78bfa;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.75rem !important;
  animation: fadeInUp 0.8s ease 0.2s both;
  cursor: default;
  user-select: none;
  color: #ffffff;
}

.hero-title-highlight {
  display: block;
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: default;
  user-select: none;
  font-weight: 900;
}

.hero-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  line-height: 1.6;
  animation: fadeInUp 0.8s ease 0.4s both;
  cursor: default;
  user-select: none;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeInUp 0.8s ease 0.6s both;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(167, 139, 250, 0.4);
  transform: translateX(10px);
}

.feature-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-size: 1.5rem;
  flex-shrink: 0;
  color: #ffffff;
}

.feature-item strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #ffffff;
  font-size: 1rem;
}

.feature-item p {
  margin: 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.hero-cta {
  animation: fadeInUp 0.8s ease 0.8s both;
}

.btn-cta {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer !important;
  user-select: none;
}

.btn-cta::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-cta:hover::before {
  width: 300px;
  height: 300px;
}

.btn-cta span,
.btn-cta i {
  position: relative;
  z-index: 1;
}

.btn-primary.btn-cta {
  background: var(--primary-gradient);
  border: none;
}

.btn-primary.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-white-purple {
  background: white !important;
  color: #5a3e8c !important;
  border: 3px solid white !important;
  font-weight: 700 !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
}

.btn-white-purple:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  background: #f8f9ff !important;
  color: #5a3e8c !important;
}

.btn-outline-light.btn-cta {
  border: 2px solid white !important;
  color: white !important;
  font-weight: 600 !important;
  background: transparent !important;
}

.btn-outline-light.btn-cta:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px) !important;
  border-color: white !important;
  color: white !important;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  animation: fadeInUp 0.8s ease 1s both;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.stat-item {
  text-align: center;
  flex: 1;
  padding: 1rem;
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 70%;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(102, 126, 234, 0.5) 20%,
    rgba(118, 75, 162, 0.5) 80%,
    transparent
  );
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.6));
}

.stat-label {
  font-size: 1.1rem;
  color: #ffffff;
  margin-top: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.95;
}

/* ===== Visual Container ===== */
.hero-visual {
  animation: fadeInUp 0.8s ease 0.5s both;
}

.visual-container {
  position: relative;
  width: 100%;
  height: 600px;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.floating-card:hover {
  transform: translateY(-10px);
}

.card-1 {
  top: 15%;
  left: 0;
  animation: float 6s ease-in-out infinite;
}

.card-2 {
  top: 50%;
  right: 0;
  animation: float 6s ease-in-out infinite 2s;
}

.card-3 {
  bottom: 15%;
  left: 10%;
  animation: float 6s ease-in-out infinite 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.card-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-size: 1.5rem;
  color: #ffffff;
}

.card-title {
  font-weight: 700;
  font-size: 1rem;
  color: #ffffff;
}

.card-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.main-visual {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 350px;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.visual-glass {
  width: 100%;
  height: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 30px 80px rgba(102, 126, 234, 0.3);
}

.visual-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  animation: rotate 20s linear infinite reverse;
}

/* ===== Features Section ===== */
.features-section {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  cursor: default;
  user-select: none;
  color: #ffffff;
}

.section-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: default;
  user-select: none;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  height: 100%;
  text-align: center;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(167, 139, 250, 0.4);
  transform: translateY(-10px);
}

.benefit-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  font-size: 2rem;
  color: #ffffff;
}

.benefit-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
}

.benefit-text {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* ===== Animations ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ===== Responsive ===== */
@media (max-width: 991px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .visual-container {
    height: 400px;
  }

  .main-visual {
    width: 250px;
    height: 250px;
  }

  .floating-card {
    padding: 1rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }
}

@media (max-width: 767px) {
  .hero-cta .btn-cta {
    display: block;
    width: 100%;
    margin: 0.5rem 0 !important;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .stat-item:not(:last-child)::after {
    display: none;
  }

  .stat-item {
    padding: 0.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .floating-card {
    font-size: 0.875rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}
</style>
