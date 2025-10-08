<template>
  <header class="navbar navbar-expand-lg bg-body border-bottom shadow-sm sticky-top">
  <div class="container">
    <!-- Marca con avatar redondo -->
    <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2">
      <img
        src="/img/placeholder.png"
        @error="(e)=>{ e.target.src='/img/placeholder.png' }"
        alt="Logo Mini-Amazon"
        class="brand-avatar rounded-circle"
      />
      <span class="fw-bold">Mini-Amazon</span>
    </RouterLink>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Abrir menú">
      <span class="navbar-toggler-icon"></span>
    </button>

    <nav class="collapse navbar-collapse" id="mainNav" aria-label="Principal">
      <ul class="navbar-nav me-auto my-2 my-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/" exact-active-class="active" aria-current="page">Inicio</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/catalogo" active-class="active">Productos</RouterLink>
        </li>
      </ul>

      <!-- Buscador: navega a /catalogo?q=... -->
      <form class="d-none d-lg-flex me-lg-3" role="search" @submit.prevent="goSearch">
        <div class="input-group nav-search">
          <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-search"></i></span>
          <input class="form-control border-start-0" type="search" v-model.trim="navQ" placeholder="Buscar productos…">
        </div>
      </form>

      <div class="d-flex align-items-center gap-2">
        <RouterLink class="btn btn-sm btn-outline-secondary" to="/favoritos" title="Favoritos">
          <i class="bi bi-heart"></i>
        </RouterLink>
        <RouterLink class="btn btn-sm btn-outline-secondary" to="/cart" title="Carrito">
          <i class="bi bi-cart"></i>
        </RouterLink>
        <button class="btn btn-sm btn-outline-secondary" @click="toggleTheme" title="Tema claro/oscuro">
          <i class="bi" :class="themeIcon"></i>
        </button>
      </div>
    </nav>
  </div>
</header>

  <main class="container py-4 py-md-5" v-cloak>
    <router-view />
  </main>

  <!-- Toast Bootstrap (igual que tu HTML) -->
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
    <div id="appToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Mini-Amazon</strong>
        <small class="text-muted">Ahora</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
      <div class="toast-body">Mensaje del sistema</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const navQ = ref('')

function goSearch () {
  if (!navQ.value) return router.push('/catalogo')
  router.push({ path: '/catalogo', query: { q: navQ.value } })
}

/* ===== Tema (data-bs-theme) ===== */
const theme = ref('light')
const themeIcon = ref('bi-moon')

function applyTheme (mode) {
  const m = (mode === 'dark') ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', m)
  document.documentElement.classList.toggle('dark', m === 'dark')
  theme.value = m
  themeIcon.value = (m === 'dark') ? 'bi-sun' : 'bi-moon'
  localStorage.setItem('theme', m)
  localStorage.setItem('mini.theme', m) // compat
}

function toggleTheme () {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

onMounted(() => {
  const saved = localStorage.getItem('theme') ?? localStorage.getItem('mini.theme')
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  applyTheme(saved ?? (prefersDark ? 'dark' : 'light'))
})
</script>

<style>
[v-cloak]{ display:none; }
/* Avatar de marca en la navbar */
.brand-avatar{
  width: 32px;              /* mismo tamaño que tus íconos */
  height: 32px;
  object-fit: cover;
  border-radius: 50%;       /* redundante con rounded-circle, por si no usas Bootstrap aquí */
  border: 1px solid var(--bs-border-color);
  background-color: var(--bs-body-bg);
}
</style>