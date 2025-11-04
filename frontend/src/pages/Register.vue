<template>
  <div class="auth-page">
    <!-- Hero Background with Gradient -->
    <div class="auth-hero-bg"></div>
    <div class="auth-particles"></div>

    <div class="container-fluid">
      <div class="row min-vh-100">
        <!-- Left Side - Hero Section -->
        <div class="col-lg-6 d-none d-lg-flex auth-hero-side">
          <div class="hero-content">
            <div class="hero-icon-float mb-4">
              <i class="bi bi-rocket-takeoff display-1"></i>
            </div>
            <h1 class="hero-title display-4 fw-bold mb-4">Únete a nosotros</h1>
            <p class="hero-description lead mb-5">
              Crea tu cuenta y descubre una nueva forma de comprar. Miles de
              productos, ofertas exclusivas y envíos express te esperan.
            </p>

            <div class="hero-features">
              <div class="feature-badge mb-3">
                <i class="bi bi-lightning-charge me-2"></i>
                <span>Registro en 30 segundos</span>
              </div>
              <div class="feature-badge mb-3">
                <i class="bi bi-percent me-2"></i>
                <span>Descuentos exclusivos</span>
              </div>
              <div class="feature-badge">
                <i class="bi bi-stars me-2"></i>
                <span>Atención personalizada</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div
          class="col-lg-6 auth-form-side d-flex align-items-center justify-content-center py-5"
        >
          <div class="auth-form-container">
            <!-- Logo Mobile -->
            <div class="text-center mb-4 d-lg-none">
              <RouterLink to="/" class="auth-brand-mobile">
                <i class="bi bi-shop display-4 text-primary"></i>
                <h2 class="mt-2 mb-0">Mini-Amazon</h2>
              </RouterLink>
            </div>

            <div class="auth-card">
              <div class="auth-card-header text-center mb-4">
                <div class="auth-icon mb-3">
                  <i class="bi bi-person-plus-fill"></i>
                </div>
                <h2 class="auth-title mb-2">Crear Cuenta</h2>
                <p class="auth-subtitle text-muted">
                  Completa el formulario para comenzar
                </p>
              </div>

              <!-- Error Alert -->
              <div
                v-if="error"
                class="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ error }}
                <button
                  type="button"
                  class="btn-close"
                  @click="error = null"
                ></button>
              </div>

              <form
                @submit.prevent="handleRegister"
                novalidate
                class="auth-form"
              >
                <!-- Full Name -->
                <div class="mb-3">
                  <label for="fullName" class="form-label fw-semibold">
                    <i class="bi bi-person me-2"></i>Nombre Completo (Opcional)
                  </label>
                  <div class="input-icon-wrapper">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      id="fullName"
                      v-model="form.fullName"
                      placeholder="Juan Pérez"
                      autocomplete="name"
                    />
                    <i class="bi bi-person input-icon"></i>
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">
                    <i class="bi bi-envelope me-2"></i>Correo Electrónico
                    <span class="text-danger">*</span>
                  </label>
                  <div class="input-icon-wrapper">
                    <input
                      type="email"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': errors.email }"
                      id="email"
                      v-model="form.email"
                      placeholder="tu@email.com"
                      required
                      autocomplete="email"
                      @input="errors.email = null"
                    />
                    <i class="bi bi-envelope input-icon"></i>
                  </div>
                  <div v-if="errors.email" class="invalid-feedback d-block">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label fw-semibold">
                    <i class="bi bi-lock me-2"></i>Contraseña
                    <span class="text-danger">*</span>
                  </label>
                  <div class="input-icon-wrapper">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': errors.password }"
                      id="password"
                      v-model="form.password"
                      placeholder="Mínimo 6 caracteres"
                      required
                      autocomplete="new-password"
                      @input="errors.password = null"
                    />
                    <button
                      class="input-icon-btn"
                      type="button"
                      @click="showPassword = !showPassword"
                      :title="showPassword ? 'Ocultar' : 'Mostrar'"
                    >
                      <i
                        class="bi"
                        :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                      ></i>
                    </button>
                  </div>
                  <small class="text-muted d-block mt-1">
                    <i class="bi bi-info-circle me-1"></i>Debe tener al menos 6
                    caracteres
                  </small>
                  <div v-if="errors.password" class="invalid-feedback d-block">
                    {{ errors.password }}
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="mb-4">
                  <label for="confirmPassword" class="form-label fw-semibold">
                    <i class="bi bi-shield-lock me-2"></i>Confirmar Contraseña
                    <span class="text-danger">*</span>
                  </label>
                  <div class="input-icon-wrapper">
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': errors.confirmPassword }"
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      placeholder="Repite tu contraseña"
                      required
                      autocomplete="new-password"
                      @input="errors.confirmPassword = null"
                    />
                    <button
                      class="input-icon-btn"
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      :title="showConfirmPassword ? 'Ocultar' : 'Mostrar'"
                    >
                      <i
                        class="bi"
                        :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"
                      ></i>
                    </button>
                  </div>
                  <div
                    v-if="errors.confirmPassword"
                    class="invalid-feedback d-block"
                  >
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <!-- Terms and conditions -->
                <div class="mb-4">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :class="{ 'is-invalid': errors.terms }"
                      id="terms"
                      v-model="form.terms"
                      @change="errors.terms = null"
                    />
                    <label class="form-check-label" for="terms">
                      Acepto los
                      <a href="#" class="text-decoration-none"
                        >términos y condiciones</a
                      >
                    </label>
                  </div>
                  <div v-if="errors.terms" class="invalid-feedback d-block">
                    {{ errors.terms }}
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="btn btn-primary btn-lg btn-auth w-100 mb-3"
                  :disabled="loading"
                >
                  <span v-if="loading">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creando cuenta...
                  </span>
                  <span v-else>
                    <i class="bi bi-rocket-takeoff me-2"></i>
                    Crear Mi Cuenta
                  </span>
                </button>
              </form>

              <!-- Divider -->
              <div class="auth-divider my-4">
                <span>¿Ya tienes una cuenta?</span>
              </div>

              <!-- Login Link -->
              <RouterLink
                to="/login"
                class="btn btn-outline-primary btn-lg w-100 mb-3"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </RouterLink>

              <!-- Back to welcome -->
              <div class="text-center mt-4">
                <RouterLink
                  to="/"
                  class="text-decoration-none d-inline-flex align-items-center"
                >
                  <i class="bi bi-arrow-left me-2"></i>
                  <span>Volver al inicio</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/stores/authStore";

const router = useRouter();

const form = ref({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
});

const errors = ref({
  fullName: null,
  email: null,
  password: null,
  confirmPassword: null,
  terms: null,
});

const error = ref(null);
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function validateForm() {
  errors.value = {
    fullName: null,
    email: null,
    password: null,
    confirmPassword: null,
    terms: null,
  };

  let valid = true;

  // Email validation
  if (!form.value.email) {
    errors.value.email = "El correo electrónico es requerido";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "Ingresa un correo electrónico válido";
    valid = false;
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = "La contraseña es requerida";
    valid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = "La contraseña debe tener al menos 6 caracteres";
    valid = false;
  }

  // Confirm password validation
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = "Confirma tu contraseña";
    valid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Las contraseñas no coinciden";
    valid = false;
  }

  // Terms validation
  if (!form.value.terms) {
    errors.value.terms = "Debes aceptar los términos y condiciones";
    valid = false;
  }

  return valid;
}

async function handleRegister() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await register(
      form.value.email,
      form.value.password,
      form.value.fullName || null
    );

    // Show success message and redirect to login
    showToast("¡Cuenta creada exitosamente! Ahora inicia sesión.");

    // Redirect to login page with success message
    router.push({
      path: "/login",
      query: { registered: "true", email: form.value.email },
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Handle specific error messages
    if (err.message.includes("already registered")) {
      error.value =
        "Este correo electrónico ya está registrado. Intenta iniciar sesión.";
    } else {
      error.value =
        err.message ||
        "Error al crear la cuenta. Por favor intenta nuevamente.";
    }
  } finally {
    loading.value = false;
  }
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
</script>

<style scoped>
/* ===== Same Modern Dark Design as Login ===== */
.auth-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.auth-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 50%,
      rgba(102, 126, 234, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(118, 75, 162, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    );
  animation: gradientShift 15s ease infinite;
}

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

.auth-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.auth-particles::before,
.auth-particles::after {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(40, 40, 40, 0.3);
  animation: float 20s infinite ease-in-out;
}

.auth-particles::before {
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.auth-particles::after {
  bottom: -150px;
  right: -150px;
  animation-delay: 10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(50px, 50px) scale(1.1);
  }
}

.auth-hero-side {
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.6) 0%,
    rgba(10, 10, 10, 0.8) 100%
  );
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  padding: 4rem;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 500px;
  color: white;
  animation: fadeInLeft 0.8s ease;
}

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

.hero-icon-float {
  animation: floatIcon 3s ease-in-out infinite;
}

@keyframes floatIcon {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.hero-icon-float i {
  color: #e0e0e0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}

.hero-title {
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  user-select: none;
}

.hero-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  user-select: none;
}

.hero-features .feature-badge {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  color: white;
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.hero-features .feature-badge:hover {
  background: rgba(40, 40, 40, 0.9);
  transform: translateX(10px);
  border-color: rgba(255, 255, 255, 0.2);
}

.hero-features .feature-badge i {
  font-size: 1.2rem;
  color: #e0e0e0;
}

.auth-form-side {
  background: #0a0a0a;
  position: relative;
  z-index: 1;
}

.auth-form-container {
  width: 100%;
  max-width: 480px;
  padding: 2rem;
  animation: fadeInRight 0.8s ease;
}

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

.auth-brand-mobile {
  text-decoration: none;
  color: white;
}

.auth-brand-mobile h2 {
  color: white;
  font-weight: 700;
}

.auth-card {
  background: #1a1a1a;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: scaleIn 0.5s ease;
}

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

.auth-card-header .auth-icon {
  font-size: 3rem;
  color: #e0e0e0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  user-select: none;
}

.auth-subtitle {
  font-size: 0.95rem;
  color: #888888;
  user-select: none;
}

.auth-form .form-label {
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  user-select: none;
}

.input-icon-wrapper {
  position: relative;
}

.input-icon-wrapper .form-control {
  padding-left: 3rem;
  padding-right: 3rem;
  border: 2px solid #333333;
  border-radius: 0.75rem;
  background: #0f0f0f;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: text;
  user-select: text;
}

.input-icon-wrapper .form-control::placeholder {
  color: #999999;
}

.input-icon-wrapper .form-control:focus {
  border-color: #555555;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
  background: #0f0f0f;
}

.input-icon-wrapper .input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
  pointer-events: none;
}

.input-icon-wrapper .input-icon-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888888;
  padding: 0.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.input-icon-wrapper .input-icon-btn:hover {
  color: #e0e0e0;
}

.form-check-input {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #333333;
  background: #0f0f0f;
}

.form-check-input:checked {
  background-color: #e0e0e0;
  border-color: #e0e0e0;
}

.form-check-label {
  color: #aaaaaa;
  margin-left: 0.5rem;
  user-select: none;
}

.form-text a,
.text-center a {
  user-select: none;
}

.btn-auth {
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-auth::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-auth:hover::before {
  width: 400px;
  height: 400px;
}

.btn-auth span,
.btn-auth i {
  position: relative;
  z-index: 1;
}

.btn-primary.btn-auth {
  background: #ffffff;
  color: #000000;
  border: none;
  font-weight: 600;
}

.btn-primary.btn-auth:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
  color: #000000;
}

.btn-outline-primary {
  border: 2px solid #333333;
  color: #ffffff;
  font-weight: 600;
  background: transparent;
}

.btn-outline-primary:hover {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
  transform: translateY(-2px);
}

.auth-divider {
  text-align: center;
  position: relative;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 42%;
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background: #1a1a1a;
  padding: 0 1rem;
  color: #666666;
  font-size: 0.875rem;
  position: relative;
}

.alert {
  border-radius: 0.75rem;
  border: none;
  animation: slideDown 0.3s ease;
}

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

.text-danger {
  color: #ef4444 !important;
}

@media (max-width: 991px) {
  .auth-form-container {
    max-width: 100%;
  }

  .auth-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 575px) {
  .auth-card {
    padding: 1.5rem 1rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
