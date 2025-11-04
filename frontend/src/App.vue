<template>
  <header
    v-if="!isWelcomePage"
    class="navbar navbar-expand-lg bg-body border-bottom shadow-sm sticky-top"
  >
    <div class="container">
      <!-- Marca con avatar redondo -->
      <RouterLink
        to="/dashboard"
        class="navbar-brand d-flex align-items-center gap-2"
      >
        <img
          src="/img/placeholder.png"
          @error="
            (e) => {
              e.target.src = '/img/placeholder.png';
            }
          "
          alt="Logo Mini-Amazon"
          class="brand-avatar rounded-circle"
        />
        <span class="fw-bold">Mini-Amazon</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-label="Abrir menú"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <nav class="collapse navbar-collapse" id="mainNav" aria-label="Principal">
        <ul class="navbar-nav me-auto my-2 my-lg-0">
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/dashboard"
              exact-active-class="active"
              aria-current="page"
              >Inicio</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/catalogo" active-class="active"
              >Productos</RouterLink
            >
          </li>
        </ul>

        <!-- Buscador: navega a /catalogo?q=... -->
        <form
          class="d-none d-lg-flex me-lg-3"
          role="search"
          @submit.prevent="goSearch"
        >
          <div class="input-group nav-search">
            <span class="input-group-text bg-transparent border-end-0"
              ><i class="bi bi-search"></i
            ></span>
            <input
              class="form-control border-start-0"
              type="search"
              v-model.trim="navQ"
              placeholder="Buscar productos…"
            />
          </div>
        </form>

        <div class="d-flex align-items-center gap-2">
          <RouterLink
            class="btn btn-sm btn-outline-secondary"
            to="/favoritos"
            title="Favoritos"
          >
            <i class="bi bi-heart"></i>
          </RouterLink>
          <RouterLink
            class="btn btn-sm btn-outline-secondary"
            to="/cart"
            title="Carrito"
          >
            <i class="bi bi-cart"></i>
          </RouterLink>
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="toggleTheme"
            title="Tema claro/oscuro"
          >
            <i class="bi" :class="themeIcon"></i>
          </button>

          <!-- User menu (authenticated) -->
          <div v-if="isAuthenticated" class="dropdown">
            <button
              class="btn btn-sm btn-outline-primary dropdown-toggle"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              :title="currentUser?.email"
            >
              <i class="bi bi-person-circle me-1"></i>
              <span class="d-none d-md-inline">{{ userDisplayName }}</span>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="userMenu"
            >
              <li>
                <h6 class="dropdown-header">
                  <i class="bi bi-person me-2"></i>{{ currentUser?.email }}
                </h6>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink class="dropdown-item" to="/orders">
                  <i class="bi bi-box-seam me-2"></i>Mis Pedidos
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/favoritos">
                  <i class="bi bi-heart me-2"></i>Favoritos
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>

          <!-- Login/Register buttons (not authenticated) -->
          <div v-else class="d-flex gap-2">
            <RouterLink class="btn btn-sm btn-outline-primary" to="/login">
              <i class="bi bi-box-arrow-in-right me-1"></i>
              <span class="d-none d-md-inline">Iniciar Sesión</span>
              <span class="d-md-none">Login</span>
            </RouterLink>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <main :class="isWelcomePage ? '' : 'container py-4 py-md-5'" v-cloak>
    <router-view />
  </main>

  <!-- Toast Bootstrap (igual que tu HTML) -->
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
    <div
      id="appToast"
      class="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header">
        <strong class="me-auto">Mini-Amazon</strong>
        <small class="text-muted">Ahora</small>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Cerrar"
        ></button>
      </div>
      <div class="toast-body">Mensaje del sistema</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  isAuthenticated,
  currentUser,
  logout,
  initAuth,
} from "@/stores/authStore";

const router = useRouter();
const route = useRoute();
const navQ = ref("");

// Check if current route is welcome, login or register page (no navbar)
const isWelcomePage = computed(() => {
  return (
    route.name === "welcome" ||
    route.name === "login" ||
    route.name === "register"
  );
});

// User display name (truncate long emails)
const userDisplayName = computed(() => {
  if (!currentUser.value) return "";
  const name = currentUser.value.full_name || currentUser.value.email;
  return name.length > 20 ? name.substring(0, 17) + "..." : name;
});

function goSearch() {
  if (!navQ.value) return router.push("/catalogo");
  router.push({ path: "/catalogo", query: { q: navQ.value } });
}

function handleLogout() {
  logout();
  showToast("Has cerrado sesión correctamente");
  router.push("/");
}

function showToast(message) {
  const toastEl = document.getElementById("appToast");
  if (toastEl) {
    const bodyEl = toastEl.querySelector(".toast-body");
    if (bodyEl) bodyEl.textContent = message;
    const toast = new window.bootstrap.Toast(toastEl);
    toast.show();
  }
}

/* ===== Tema (data-bs-theme) ===== */
const theme = ref("light");
const themeIcon = ref("bi-moon");

function applyTheme(mode) {
  const m = mode === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-bs-theme", m);
  document.documentElement.classList.toggle("dark", m === "dark");
  theme.value = m;
  themeIcon.value = m === "dark" ? "bi-sun" : "bi-moon";
  localStorage.setItem("theme", m);
  localStorage.setItem("mini.theme", m); // compat
}

function toggleTheme() {
  applyTheme(theme.value === "dark" ? "light" : "dark");
}

onMounted(async () => {
  // Initialize auth state
  await initAuth();

  // Initialize theme
  const saved =
    localStorage.getItem("theme") ?? localStorage.getItem("mini.theme");
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  applyTheme(saved ?? (prefersDark ? "dark" : "light"));

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }
});
</script>

<style>
[v-cloak] {
  display: none;
}
/* Avatar de marca en la navbar */
.brand-avatar {
  width: 32px; /* mismo tamaño que tus íconos */
  height: 32px;
  object-fit: cover;
  border-radius: 50%; /* redundante con rounded-circle, por si no usas Bootstrap aquí */
  border: 1px solid var(--bs-border-color);
  background-color: var(--bs-body-bg);
}
</style>
