<template>
  <main class="container py-5 text-center" v-cloak>
    <div class="display-5 fw-bold mb-2">404</div>
    <p class="lead mb-4">La página que buscas no existe o fue movida.</p>
    <RouterLink class="btn btn-primary me-2" to="/">Ir al inicio</RouterLink>
    <RouterLink class="btn btn-outline-secondary" to="/catalogo">Explorar productos</RouterLink>
  </main>
</template>

<script setup>
</script>

<style>
[v-cloak]{display:none}
</style>