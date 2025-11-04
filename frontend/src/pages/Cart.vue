<template>
  <main class="container py-4" v-cloak>
    <h1 class="h4 mb-3" data-aos="fade-down">Carrito</h1>

    <!-- Vacío -->
    <div v-if="lines.length === 0" class="alert alert-info" data-aos="fade-up">
      Tu carrito está vacío.
      <RouterLink to="/catalogo" class="alert-link">Ir al catálogo</RouterLink>.
    </div>

    <!-- Contenido -->
    <div v-else class="row g-4">
      <!-- Lista -->
      <section
        class="col-12 col-lg-8"
        data-aos="fade-right"
        data-aos-duration="700"
      >
        <div class="card cart-box">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr>
                    <th style="width: 64px"></th>
                    <th>Producto</th>
                    <th class="text-end">Precio</th>
                    <th style="width: 190px">Cantidad</th>
                    <th class="text-end">Subtotal</th>
                    <th class="text-end" style="width: 100px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ln in lines" :key="ln.p.id">
                    <td>
                      <img
                        :src="imgOf(ln.p)"
                        @error="onImgErr"
                        class="rounded"
                        width="48"
                        height="48"
                        style="object-fit: cover"
                      />
                    </td>
                    <td>
                      <div class="fw-semibold">
                        <RouterLink
                          :to="`/producto/${encodeURIComponent(ln.p.id)}`"
                          class="link-body-emphasis"
                        >
                          {{ ln.p.titulo || ln.p.name }}
                        </RouterLink>
                      </div>
                      <div class="small text-muted">
                        {{ ln.p.marca || ln.p.brand }} •
                        {{ ln.p.categoria || ln.p.catName }}
                      </div>
                    </td>
                    <td class="text-end">
                      {{ fmtCLP(priceOf(ln.p, ln.price)) }}
                    </td>
                    <td>
                      <div
                        class="input-group input-group-sm"
                        style="max-width: 170px"
                      >
                        <button
                          class="btn btn-outline-secondary"
                          @click="decQty(ln)"
                          :disabled="ln.qty <= 1"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          class="form-control text-center"
                          min="1"
                          :max="stockOf(ln.p)"
                          v-model.number="ln.qty"
                          @change="clampQty(ln)"
                        />
                        <button
                          class="btn btn-outline-secondary"
                          @click="incQty(ln)"
                          :disabled="ln.qty >= stockOf(ln.p)"
                        >
                          +
                        </button>
                      </div>
                      <div
                        class="form-text text-danger"
                        v-if="ln.qty > stockOf(ln.p)"
                      >
                        Máximo stock: {{ stockOf(ln.p) }}
                      </div>
                    </td>
                    <td class="text-end">
                      {{ fmtCLP(priceOf(ln.p, ln.price) * ln.qty) }}
                    </td>
                    <td class="text-end">
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="askRemove(ln)"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button class="btn btn-link text-danger mt-3" @click="clearCart">
              Vaciar carrito
            </button>
          </div>
        </div>
      </section>

      <!-- Resumen -->
      <aside
        class="col-12 col-lg-4"
        data-aos="fade-left"
        data-aos-duration="700"
      >
        <div class="cart-summary">
          <div class="card">
            <div class="card-body">
              <h2 class="h6 mb-3">Resumen del pedido</h2>

              <div class="d-flex justify-content-between">
                <span>Subtotal</span><strong>{{ fmtCLP(subtotal) }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span>IVA (19%)</span><strong>{{ fmtCLP(iva) }}</strong>
              </div>
              <hr />
              <div class="d-flex justify-content-between fs-5">
                <span>Total</span><strong>{{ fmtCLP(total) }}</strong>
              </div>

              <RouterLink class="btn btn-primary w-100 mt-3" to="/checkout"
                >Ir al checkout</RouterLink
              >
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>

  <!-- Modal eliminar -->
  <div class="modal fade" id="removeModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Quitar producto</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Cerrar"
          ></button>
        </div>
        <div class="modal-body">
          ¿Seguro que quieres quitar
          <strong>{{
            pending?.p?.titulo || pending?.p?.name || "este producto"
          }}</strong>
          del carrito?
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="confirmRemove">Quitar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

/* ===== Estado ===== */
const lines = ref([]); // [{ p: product, qty, price? }]
const pending = ref(null);
const IVA_RATE = 0.19;

/* ===== Utilidades ===== */
const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
const onImgErr = (e) => {
  e.target.src = "/img/placeholder.png";
};
const imgOf = (p) =>
  p?.imagenes?.[0] || p?.images?.[0] || "/img/placeholder.png";
const stockOf = (p) => Number(p?.stock ?? 0);
const priceOf = (p, fallback) => Number(p?.precio ?? p?.price ?? fallback ?? 0);

/* ===== LocalStorage ===== */
const CART_KEY = "mini.cart";
function readCartLS() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeCartLS(arr) {
  localStorage.setItem(CART_KEY, JSON.stringify(arr));
}

/* ===== Cargar productos + construir líneas ===== */
async function fetchJSON(url, fallback = []) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.statusText);
    return await r.json();
  } catch {
    return fallback;
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

async function loadCart() {
  const raw = readCartLS(); // [{id, qty, precio?, titulo?}]
  const prodsRaw = await fetchJSON("/data/productos.json", []);
  const list = Array.isArray(prodsRaw) ? prodsRaw : prodsRaw?.productos || [];
  const map = new Map(list.map((p) => [String(p.id), normalizeProduct(p)]));

  lines.value = raw
    .map((it) => {
      const p = map.get(String(it.id));
      return {
        p: p || {
          id: it.id,
          titulo: it.titulo || "Producto",
          precio: it.precio || it.price || 0,
          imagenes: [],
        },
        qty: Number(it.qty || 1),
        price: Number(it.precio || it.price || (p?.precio ?? p?.price ?? 0)),
      };
    })
    .filter((ln) => ln.p); // por si había ids huérfanos
}

/* ===== Operaciones ===== */
function clampQty(ln) {
  ln.qty = Math.max(1, Math.min(ln.qty || 1, stockOf(ln.p) || 9999));
  save();
}
function decQty(ln) {
  if (ln.qty > 1) {
    ln.qty--;
    save();
  }
}
function incQty(ln) {
  if (ln.qty < stockOf(ln.p)) {
    ln.qty++;
    save();
  }
}

function askRemove(ln) {
  pending.value = ln;
  const el = document.getElementById("removeModal");
  if (el && window.bootstrap?.Modal) new window.bootstrap.Modal(el).show();
}
function confirmRemove() {
  if (!pending.value) return;
  const id = String(pending.value.p.id);
  lines.value = lines.value.filter((x) => String(x.p.id) !== id);
  save();
  // cierra modal
  document.querySelector('#removeModal [data-bs-dismiss="modal"]')?.click();
  toast("Producto removido 🗑️");
}
function clearCart() {
  lines.value = [];
  save();
  toast("Carrito vaciado");
}

function save() {
  // sincroniza LS con lo que se ve
  const arr = lines.value.map((ln) => ({
    id: ln.p.id,
    qty: ln.qty,
    precio: priceOf(ln.p, ln.price),
    titulo: ln.p.titulo || ln.p.name,
  }));
  writeCartLS(arr);
}

/* ===== Totales ===== */
const subtotal = computed(() =>
  lines.value.reduce((acc, ln) => acc + priceOf(ln.p, ln.price) * ln.qty, 0)
);
const iva = computed(() => Math.round(subtotal.value * IVA_RATE));
const total = computed(() => subtotal.value + iva.value);

/* ===== Toast compartido (App.vue) ===== */
function toast(msg) {
  const el = document.getElementById("appToast");
  if (el) {
    el.querySelector(".toast-body")?.replaceChildren(
      document.createTextNode(msg)
    );
    if (window.bootstrap?.Toast) new window.bootstrap.Toast(el).show();
  }
}

/* ===== Init ===== */
onMounted(loadCart);

// Guarda ante cualquier cambio (por si editan input manual)
watch(lines, save, { deep: true });
</script>

<style scoped>
[v-cloak] {
  display: none;
}

/* Cursor control for professional UX */
h1,
h2,
th,
.fw-semibold,
.text-muted,
.small {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

/* Inputs should allow text selection */
input[type="number"],
.form-control {
  cursor: text;
  user-select: text;
  -webkit-user-select: text;
}

/* Buttons and links */
.btn,
a {
  cursor: pointer;
}
</style>
