<template>
  <main class="container py-4" v-cloak>
    <h1 class="h4 mb-3" data-aos="fade-down">Checkout</h1>

    <div v-if="lines.length === 0" class="alert alert-info" data-aos="fade-up">
      Tu carrito está vacío.
      <RouterLink class="alert-link" to="/catalogo">Ir al catálogo</RouterLink>.
    </div>

    <div v-else class="row g-4">
      <!-- Formulario -->
      <section
        class="col-12 col-lg-8"
        data-aos="fade-right"
        data-aos-duration="700"
      >
        <form @submit.prevent="submitOrder" novalidate>
          <div class="card">
            <div class="card-body">
              <!-- 1) Envío -->
              <h2 class="h6 mb-3">1) Método de envío</h2>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Envío</label>
                  <select
                    class="form-select"
                    v-model="form.envioId"
                    required
                    :class="{ 'is-invalid': errors.envioId }"
                  >
                    <option value="">Seleccionar…</option>
                    <option v-for="m in envios" :key="m.id" :value="m.id">
                      {{ m.nombre }} —
                      {{
                        (Number(m.costo) || 0) === 0
                          ? "Gratis"
                          : fmtCLP(m.costo)
                      }}<span v-if="m.dias"> ({{ m.dias }})</span>
                    </option>
                  </select>
                  <div class="form-text" v-if="currentEnvio">
                    Seleccionado: <strong>{{ currentEnvio.nombre }}</strong>
                    <span class="ms-2">{{
                      isRetiro ? "Retiro en tienda" : "Entrega a domicilio"
                    }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Costo</label>
                  <input
                    class="form-control"
                    :value="shippingFree ? 'Gratis' : fmtCLP(shippingCost)"
                    disabled
                  />
                </div>
              </div>

              <hr class="my-4" />

              <!-- 2) Dirección -->
              <h2 class="h6 mb-3">2) Dirección</h2>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input
                    class="form-control"
                    v-model.trim="form.firstName"
                    required
                    minlength="2"
                    maxlength="40"
                    :class="{ 'is-invalid': errors.firstName }"
                  />
                  <div class="form-text text-end">
                    {{ form.firstName.length }}/40
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Apellido</label>
                  <input
                    class="form-control"
                    v-model.trim="form.lastName"
                    required
                    minlength="2"
                    maxlength="40"
                    :class="{ 'is-invalid': errors.lastName }"
                  />
                  <div class="form-text text-end">
                    {{ form.lastName.length }}/40
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model.trim="form.email"
                    required
                    maxlength="80"
                    :class="{ 'is-invalid': errors.email }"
                  />
                  <div class="form-text text-end">
                    {{ form.email.length }}/80
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input
                    class="form-control"
                    v-model.trim="form.phone"
                    placeholder="+56912345678"
                    inputmode="tel"
                    required
                    maxlength="12"
                    pattern="^\\+\\d{11}$"
                    title="Debe ser + seguido de 11 dígitos, por ej. +56912345678"
                    :class="{ 'is-invalid': errors.phone }"
                    @input="sanitizePhone"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label">Región</label>
                  <select
                    class="form-select"
                    v-model="form.region"
                    :disabled="isRetiro"
                    :required="!isRetiro"
                    :class="{ 'is-invalid': errors.region }"
                  >
                    <option value="">Seleccionar…</option>
                    <option v-for="r in regiones" :key="r" :value="r">
                      {{ r }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Ciudad</label>
                  <select
                    class="form-select"
                    v-model="form.city"
                    :disabled="isRetiro || !form.region"
                    :required="!isRetiro"
                    :class="{ 'is-invalid': errors.city }"
                  >
                    <option value="">Seleccionar…</option>
                    <option v-for="c in ciudadesFiltradas" :key="c" :value="c">
                      {{ c }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Dirección</label>
                  <input
                    class="form-control"
                    v-model.trim="form.address"
                    :disabled="isRetiro"
                    :required="!isRetiro"
                    maxlength="100"
                    :class="{ 'is-invalid': errors.address }"
                  />
                  <div class="form-text text-end" v-if="!isRetiro">
                    {{ form.address.length }}/100
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Depto / Casa (opcional)</label>
                  <input
                    class="form-control"
                    v-model.trim="form.depto"
                    maxlength="20"
                    :disabled="isRetiro"
                    :class="{ 'is-invalid': errors.depto }"
                  />
                  <div class="form-text text-end" v-if="!isRetiro">
                    {{ form.depto.length }}/20
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Notas (opcional)</label>
                  <input
                    class="form-control"
                    v-model.trim="form.notes"
                    maxlength="200"
                    :class="{ 'is-invalid': errors.notes }"
                  />
                  <div class="form-text text-end">
                    {{ form.notes.length }}/200
                  </div>
                </div>
              </div>

              <hr class="my-4" />

              <!-- 3) Pago -->
              <h2 class="h6 mb-3">3) Pago</h2>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="paymethod"
                      id="payCard"
                      value="card"
                      v-model="paymethod"
                    />
                    <label class="form-check-label" for="payCard"
                      >Tarjeta</label
                    >
                  </div>
                  <div :class="{ 'd-none': paymethod !== 'card' }">
                    <div class="row g-2 mt-1">
                      <div class="col-12">
                        <input
                          class="form-control"
                          placeholder="Número de tarjeta (13–19 díg)"
                          v-model.trim="card.number"
                        />
                      </div>
                      <div class="col-6">
                        <input
                          class="form-control"
                          placeholder="MM/AA"
                          v-model.trim="card.exp"
                        />
                      </div>
                      <div class="col-6">
                        <input
                          class="form-control"
                          placeholder="CVV"
                          v-model.trim="card.cvc"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="paymethod"
                      id="payBank"
                      value="transfer"
                      v-model="paymethod"
                    />
                    <label class="form-check-label" for="payBank"
                      >Transferencia</label
                    >
                  </div>
                  <div :class="{ 'd-none': paymethod === 'card' }">
                    <div class="form-text">
                      Te enviaremos datos al confirmar.
                    </div>
                  </div>

                  <div class="mt-3 d-flex gap-2 align-items-center">
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                      @click="selectExpress('PayPal')"
                    >
                      <img src="/img/PayPal.svg.png" alt="PayPal" height="22" />
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                      @click="selectExpress('BancoEstado')"
                    >
                      <img
                        src="/img/bancoEstado.svg.png"
                        alt="BancoEstado"
                        height="22"
                      />
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                      @click="selectExpress('GPay')"
                    >
                      <img src="/img/gpay.svg.png" alt="GPay" height="22" />
                    </button>
                  </div>
                  <div class="form-text" v-if="payExpress">
                    Pago rápido seleccionado: {{ payExpress }}
                  </div>
                </div>
              </div>

              <hr class="my-4" />

              <!-- 4) Cupón -->
              <h2 class="h6 mb-3">4) Cupón</h2>
              <div class="row g-2 align-items-center">
                <div class="col-sm-8">
                  <input
                    class="form-control"
                    v-model.trim="couponInput"
                    placeholder="Ej: DESC5000, DESC5, ENVIOGRATIS"
                    maxlength="20"
                  />
                  <div
                    class="form-text"
                    :class="{
                      'text-success': couponOk,
                      'text-danger': couponInput && !couponOk,
                    }"
                  >
                    {{ couponMsg }}
                  </div>
                </div>
                <div class="col-sm-4 d-grid">
                  <button
                    class="btn btn-outline-primary"
                    type="button"
                    @click="applyCoupon"
                  >
                    Aplicar cupón
                  </button>
                </div>
              </div>

              <hr class="my-4" />

              <!-- 5) Verificación -->
              <h2 class="h6 mb-3">5) Verificación</h2>
              <div class="row g-2 align-items-center">
                <div class="col-auto">
                  <span class="fw-semibold"
                    >{{ captchaA }} + {{ captchaB }} =</span
                  >
                </div>
                <div class="col-auto">
                  <input
                    class="form-control"
                    style="width: 120px"
                    v-model.number="captchaInput"
                  />
                </div>
                <div class="col-auto">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="genCaptcha"
                  >
                    ↻
                  </button>
                </div>
                <div class="col-12">
                  <small
                    class="text-danger"
                    v-if="captchaInput !== captchaA + captchaB"
                    >Respuesta incorrecta.</small
                  >
                </div>
              </div>

              <div class="form-check mt-3">
                <input
                  id="terms"
                  class="form-check-input"
                  type="checkbox"
                  v-model="terms"
                />
                <label class="form-check-label" for="terms"
                  >Acepto los términos y condiciones</label
                >
              </div>
            </div>
          </div>

          <div class="mt-3 d-grid d-lg-none">
            <button
              class="btn btn-primary"
              :disabled="!canSubmit"
              @click="submitOrder"
            >
              Confirmar pedido
            </button>
          </div>
        </form>
      </section>

      <!-- Resumen -->
      <aside
        class="col-12 col-lg-4"
        data-aos="fade-left"
        data-aos-duration="700"
      >
        <div class="card">
          <div class="card-body">
            <h2 class="h6 mb-3">Resumen del pedido</h2>

            <div class="vstack gap-2 mb-3">
              <div
                v-for="ln in lines"
                :key="ln.p.id"
                class="d-flex gap-2 align-items-center"
              >
                <img
                  :src="imgOf(ln.p)"
                  @error="onImgErr"
                  class="rounded"
                  width="48"
                  height="48"
                  style="object-fit: cover"
                />
                <div class="flex-grow-1">
                  <div class="small fw-semibold">
                    {{ ln.p.titulo || ln.p.name }}
                  </div>
                  <div class="small text-muted">x{{ ln.qty }}</div>
                </div>
                <div class="small fw-semibold">
                  {{ fmtCLP(priceOf(ln.p, ln.price) * ln.qty) }}
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between">
              <span>Subtotal</span><strong>{{ fmtCLP(subtotal) }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span>Descuento</span
              ><strong :class="{ 'text-success': discountValue > 0 }">{{
                discountValue > 0 ? "−" + fmtCLP(discountValue) : fmtCLP(0)
              }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span>Envío</span
              ><strong>{{
                shippingFree ? "Gratis" : fmtCLP(shippingCost)
              }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span>IVA (19%)</span><strong>{{ fmtCLP(iva) }}</strong>
            </div>
            <hr />
            <div class="d-flex justify-content-between fs-5">
              <span>Total</span><strong>{{ fmtCLP(total) }}</strong>
            </div>

            <button
              class="btn btn-primary w-100 mt-3"
              :disabled="!canSubmit"
              @click="submitOrder"
            >
              Confirmar pedido
            </button>
            <div class="form-text text-danger mt-2" v-if="!canSubmit">
              Completa los campos requeridos para continuar.
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>

  <!-- Modal éxito -->
  <div class="modal fade" id="orderOkModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">¡Pedido confirmado!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Cerrar"
          ></button>
        </div>
        <div class="modal-body"><p>Se creó tu orden.</p></div>
        <div class="modal-footer">
          <RouterLink class="btn btn-primary" to="/orders"
            >Ver mis pedidos</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/* ====== Carrito ====== */
const CART_KEY = "mini.cart";
const lines = ref([]); // [{ p: product, qty, price? }]

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

async function fetchJSON(url, fallback = null) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw 0;
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
    categoria: p.categoria || p.catName,
    precio: p.precio ?? p.price ?? 0,
    price: p.price ?? p.precio ?? 0,
    images: p.images || p.imagenes || [],
    imagenes: p.imagenes || p.images || [],
    stock: p.stock ?? 0,
  };
}
const imgOf = (p) =>
  p?.images?.[0] || p?.imagenes?.[0] || "/img/placeholder.png";
const onImgErr = (e) => {
  e.target.src = "/img/placeholder.png";
};
const priceOf = (p, fallback) => Number(p?.precio ?? p?.price ?? fallback ?? 0);

/* ====== Datos maestros (envío / localidades / cupones) ====== */
const envios = ref([]);
const localidades = ref({}); // {Region: [ciudades]}
const cupones = ref([]); // [{code,type,value}] type: 'amount'|'percent'|'free_shipping'

/* fallbacks por si no hay archivos */
const ENVIO_FALLBACK = [
  { id: "retiro", nombre: "Retiro en tienda", costo: 0, dias: "0-1 días" },
  { id: "domicilio", nombre: "Envío a domicilio", costo: 4990, dias: "24-48h" },
];
const CUPON_FALLBACK = [
  { code: "DESC5000", type: "amount", value: 5000 },
  { code: "DESC5", type: "percent", value: 5 },
  { code: "ENVIOGRATIS", type: "free_shipping", value: true },
];
const LOCALIDADES_FALLBACK = {
  "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú"],
};

/* ====== Normalización de envíos ====== */
function parseMoney(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const digits = v.replace(/[^\d]/g, ""); // quita $, puntos, comas, espacios
    return digits ? parseInt(digits, 10) : 0;
  }
  return 0;
}
function normalizeEnvio(e, idx) {
  const nombre = e.nombre || e.name || e.title || "Envío";
  const idBase =
    e.id || e.slug || e.code || nombre.toLowerCase().replace(/\s+/g, "_");
  return {
    id: String(idBase),
    nombre,
    costo: parseMoney(e.costo ?? e.cost ?? e.precio ?? e.price ?? 0),
    dias: e.dias || e.plazo || e.eta || "",
    tipo: e.tipo || (/retiro/i.test(nombre) ? "retiro" : "envio"),
  };
}
function normalizeEnviosInput(raw) {
  if (Array.isArray(raw)) return raw.map(normalizeEnvio);
  if (raw && Array.isArray(raw.envios)) return raw.envios.map(normalizeEnvio);
  if (raw && typeof raw === "object")
    return Object.values(raw).map(normalizeEnvio);
  return ENVIO_FALLBACK.map(normalizeEnvio);
}

/* ====== Form ====== */
const form = ref({
  envioId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  region: "",
  city: "",
  address: "",
  depto: "",
  notes: "",
});
const paymethod = ref("card"); // 'card' | 'transfer'
const payExpress = ref(""); // etiqueta
const card = ref({ number: "", exp: "", cvc: "" });
const captchaA = ref(0),
  captchaB = ref(0),
  captchaInput = ref(null);
const terms = ref(false);
const errors = ref({});

/* ====== Cupon ====== */
const couponInput = ref("");
const coupon = ref(null); // {type, value}
const couponOk = ref(false);
const couponMsg = ref("");

function applyCoupon() {
  const code = (couponInput.value || "").toUpperCase().trim();
  if (!code) {
    coupon.value = null;
    couponOk.value = false;
    couponMsg.value = "";
    return;
  }

  // unimos archivo + fallback y NORMALIZAMOS
  const all = [...(cupones.value || []), ...CUPON_FALLBACK]
    .map(normalizeCoupon)
    .filter(Boolean);

  const found = all.find((c) => c.code === code);
  if (!found) {
    coupon.value = null;
    couponOk.value = false;
    couponMsg.value = "Cupón no válido";
    return;
  }

  coupon.value = found;
  couponOk.value = true;
  couponMsg.value =
    found.type === "amount"
      ? `Aplicado: -${fmtCLP(found.value)}`
      : found.type === "percent"
      ? `Aplicado: ${found.value}%`
      : "Aplicado: Envío gratis";
}

function normalizeCoupon(raw) {
  if (!raw) return null;
  const code = String(raw.code || raw.coupon || raw.id || "")
    .toUpperCase()
    .trim();

  // normaliza tipo: acepta "amount|monto|fixed|flat|valor", "percent|porcentaje|%", "free_shipping|envio(gratis)|shippingfree"
  const t = String(raw.type || raw.tipo || "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
  let type = "free_shipping";
  if (/(^amount$|monto|fixed|flat|valor)/.test(t)) type = "amount";
  else if (/(^percent$|percentage|porcentaje|%)/.test(t)) type = "percent";
  else if (/(freeshipping|enviogratis|envio|shippingfree)/.test(t))
    type = "free_shipping";

  // valor: para amount/percent número; para free_shipping -> true
  const value =
    type === "free_shipping"
      ? true
      : Number(raw.value ?? raw.amount ?? raw.percent ?? 0);

  return { code, type, value };
}

/* ====== Envío / Localidades ====== */
const currentEnvio = computed(() =>
  envios.value.find((e) => e.id === form.value.envioId)
);
const isRetiro = computed(() => {
  const e = currentEnvio.value;
  return (
    !!e &&
    (e.id === "retiro" || e.tipo === "retiro" || /retiro/i.test(e.nombre || ""))
  );
});

const regiones = computed(() => Object.keys(localidades.value || {}));
const ciudadesFiltradas = computed(
  () => localidades.value?.[form.value.region] || []
);
watch(
  () => form.value.region,
  () => {
    form.value.city = "";
  }
);

/* ====== Totales ====== */
const fmtCLP = (n) => {
  const num = Number(n || 0);
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `$${num}`;
  }
};
const subtotal = computed(() =>
  lines.value.reduce((acc, ln) => acc + priceOf(ln.p, ln.price) * ln.qty, 0)
);

const discountValue = computed(() => {
  if (!coupon.value) return 0;
  if (coupon.value.type === "amount")
    return Math.min(subtotal.value, Number(coupon.value.value || 0));
  if (coupon.value.type === "percent")
    return Math.round(subtotal.value * (Number(coupon.value.value || 0) / 100));
  return 0;
});

const shippingFree = computed(
  () => isRetiro.value || coupon.value?.type === "free_shipping"
);
const shippingCost = computed(() =>
  shippingFree.value ? 0 : Number(currentEnvio.value?.costo || 0)
);

const neto = computed(
  () => Math.max(0, subtotal.value - discountValue.value) + shippingCost.value
);
const iva = computed(() => Math.round(neto.value * 0.19));
const total = computed(() => neto.value + iva.value);

/* ====== Validaciones ====== */
// Solo + al inicio y dígitos, sin espacios; máx 12; patrón + y 11 dígitos
function sanitizePhone() {
  let s = (form.value.phone || "").replace(/[^\d+]/g, "");
  if (s[0] === "+") s = "+" + s.slice(1).replace(/\+/g, "");
  else s = s.replace(/\+/g, ""); // si el + no es el 1º, se elimina
  s = s.slice(0, 12); // maxlength duro
  form.value.phone = s;
}

function validate() {
  const f = form.value;
  errors.value = {};
  if (!f.firstName || f.firstName.length < 2) errors.value.firstName = true;
  if (!f.lastName || f.lastName.length < 2) errors.value.lastName = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.value.email = true;

  // Teléfono: exacto + y 11 dígitos
  if (!/^\+\d{11}$/.test(f.phone)) errors.value.phone = true;

  if (!isRetiro.value) {
    if (!f.region) errors.value.region = true;
    if (!f.city) errors.value.city = true;
    if (!f.address || f.address.length < 4) errors.value.address = true;
  }
  if (!form.value.envioId) errors.value.envioId = true;

  if (paymethod.value === "card") {
    const numOk = /^[\d\s-]{13,19}$/.test(card.value.number);
    const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.value.exp);
    const cvcOk = /^\d{3,4}$/.test(card.value.cvc);
    if (!(numOk && expOk && cvcOk)) errors.value.card = true;
  }
  if (captchaInput.value !== captchaA.value + captchaB.value)
    errors.value.captcha = true;
  if (!terms.value) errors.value.terms = true;

  return Object.keys(errors.value).length === 0;
}
const canSubmit = computed(() => validate());

/* ====== Captcha ====== */
function genCaptcha() {
  captchaA.value = 1 + Math.floor(Math.random() * 9);
  captchaB.value = 1 + Math.floor(Math.random() * 9);
  captchaInput.value = null;
}

/* ====== Pago express ====== */
function selectExpress(label) {
  payExpress.value = label;
  // Simulamos que escoger express equivale a tener método listo sin pedir tarjeta
  paymethod.value = "transfer";
  toast(`Pago rápido seleccionado: ${label}`);
}

/* ====== Toast compartido (App.vue) ====== */
function toast(msg) {
  const el = document.getElementById("appToast");
  if (el) {
    el.querySelector(".toast-body")?.replaceChildren(
      document.createTextNode(msg)
    );
    if (window.bootstrap?.Toast) new window.bootstrap.Toast(el).show();
  }
}

/* ====== Submit ====== */
function saveOrder(order) {
  const key = "mini.orders";
  let arr = [];
  try {
    arr = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {}
  arr.unshift(order);
  localStorage.setItem(key, JSON.stringify(arr));
}

async function submitOrder() {
  if (!validate()) return toast("Revisa el formulario");
  // construir orden
  const orderId = "O" + Date.now();
  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    items: lines.value.map((ln) => ({
      id: ln.p.id,
      titulo: ln.p.titulo || ln.p.name,
      qty: ln.qty,
      precio: priceOf(ln.p, ln.price),
    })),
    totals: {
      subtotal: subtotal.value,
      discount: discountValue.value,
      shipping: shippingCost.value,
      iva: iva.value,
      total: total.value,
    },
    shipping: {
      ...currentEnvio.value,
      free: shippingFree.value,
      address: isRetiro.value
        ? null
        : {
            region: form.value.region,
            city: form.value.city,
            address: form.value.address,
            depto: form.value.depto,
            notes: form.value.notes,
          },
    },
    customer: {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
    },
    payment: {
      method: payExpress.value
        ? `express:${payExpress.value}`
        : paymethod.value,
      last4: card.value.number.slice(-4) || null,
    },
    coupon: coupon.value || null,
  };
  saveOrder(order);

  // limpiar carrito
  writeCartLS([]);
  lines.value = [];

  toast("¡Pedido confirmado!");
  router.push({ path: "/orders", query: { id: orderId, ok: 1 } });
}

/* ====== Init ====== */
onMounted(async () => {
  genCaptcha();

  // cargar carrito
  const raw = readCartLS();
  const prodsRaw = await fetchJSON("/data/productos.json", []);
  const list = Array.isArray(prodsRaw) ? prodsRaw : prodsRaw?.productos || [];
  const map = new Map(list.map((p) => [String(p.id), normalizeProduct(p)]));
  lines.value = raw.map((it) => {
    const p = map.get(String(it.id));
    return {
      p: p || {
        id: it.id,
        titulo: it.titulo || "Producto",
        precio: it.precio || it.price || 0,
        images: [],
      },
      qty: Number(it.qty || 1),
      price: Number(it.precio || it.price || p?.precio || p?.price || 0),
    };
  });

  // cargar maestros
  const envRaw = await fetchJSON("/data/envios.json", ENVIO_FALLBACK);
  envios.value = normalizeEnviosInput(envRaw);
  const locRaw = await fetchJSON(
    "/data/localidades.json",
    LOCALIDADES_FALLBACK
  );
  localidades.value = Array.isArray(locRaw)
    ? Object.fromEntries(
        locRaw.map((r) => [
          r.region || r.nombre || r.name,
          r.ciudades || r.cities || [],
        ])
      )
    : locRaw;
  const coupRaw = await fetchJSON("/data/cupones.json", []);
  const coupList = Array.isArray(coupRaw)
    ? coupRaw
    : coupRaw?.cupones || coupRaw?.coupons || [];
  cupones.value = [
    ...coupList.map(normalizeCoupon),
    ...CUPON_FALLBACK.map(normalizeCoupon),
  ];

  // preselección si solo hay un método
  if (!form.value.envioId && envios.value.length)
    form.value.envioId = envios.value[0].id;
});
</script>

<style scoped>
[v-cloak] {
  display: none;
}

/* Cursor control for professional UX */
h1,
h2,
.form-label,
.form-check-label,
.small,
.fw-semibold,
.text-muted,
strong {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

/* Form inputs should allow text selection */
.form-control,
.form-select,
input[type="email"],
input[type="number"],
textarea {
  cursor: text;
  user-select: text;
  -webkit-user-select: text;
}

/* Checkboxes and radios */
.form-check-input {
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
}

/* Buttons and links */
.btn,
a {
  cursor: pointer;
}
</style>
