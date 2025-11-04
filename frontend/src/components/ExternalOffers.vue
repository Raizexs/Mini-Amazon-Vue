<template>
  <section class="mt-4">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h3 class="h6 m-0 d-flex align-items-center gap-2">
        Ofertas externas
        <span class="text-muted small">(Mercado Libre)</span>
      </h3>
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="load"
        :disabled="loading"
      >
        <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
      </button>
    </div>

    <div v-if="qList.length === 0" class="text-muted small">
      Ingresa un término de búsqueda o abre un producto para ver ofertas.
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-3">
        <div class="spinner-border spinner-border-sm" role="status"></div>
      </div>

      <div v-else-if="error" class="alert alert-warning py-2">{{ error }}</div>

      <div v-else-if="items.length === 0" class="text-muted small">
        Sin resultados para “{{ qList.join(" / ") }}”.
      </div>

      <div v-else class="row g-2">
        <div
          class="col-12 col-md-6 col-lg-4"
          v-for="it in items"
          :key="it.source + '-' + it.id"
        >
          <a
            class="card h-100 text-decoration-none"
            :href="it.permalink"
            target="_blank"
            rel="noopener"
          >
            <div class="row g-0 align-items-center">
              <div class="col-3 p-2">
                <img
                  :src="it.thumbnail || '/img/placeholder.png'"
                  class="img-fluid rounded"
                  :alt="it.title"
                  @error="(e) => (e.target.src = '/img/placeholder.png')"
                />
              </div>
              <div class="col-9 p-2">
                <div class="small text-truncate" :title="it.title">
                  {{ it.title }}
                </div>
                <div class="fw-semibold">
                  {{ fmtPrice(it.price, it.currency) }}
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span
                    class="badge bg-secondary-subtle text-secondary-emphasis small d-inline-flex align-items-center"
                  >
                    <img
                      v-if="it.mlMatched || it.source === 'Mercado Libre'"
                      src="/img/ml-logo.svg.png"
                      alt="ML"
                      class="ml-logo me-1"
                    />
                    {{ it.source }}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { searchExternalOffers } from "@/services/meliApi";

const props = defineProps({
  query: { type: String, default: "" }, // compat
  queries: { type: Array, default: () => [] },
  limit: { type: Number, default: 3 },
  debounceMs: { type: Number, default: 400 },
});

const qList = computed(() => {
  const arr = props.queries.length ? props.queries : [props.query];
  return arr.map((s) => String(s || "").trim()).filter(Boolean);
});

const loading = ref(false);
const error = ref("");
const items = ref([]);

function fmtPrice(n, cur) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: cur || "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n}`;
  }
}

let t = null;
async function load() {
  error.value = "";
  items.value = [];
  if (qList.value.length === 0) return;
  loading.value = true;
  try {
    items.value = await searchExternalOffers(qList.value, {
      limit: props.limit,
      randomize: true,
    });
  } catch (e) {
    error.value = "No se pudieron cargar ofertas externas.";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(qList, () => {
  clearTimeout(t);
  t = setTimeout(load, props.debounceMs);
});
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ml-logo {
  width: 18px;
  height: auto;
}

/* Hacer que solo el card sea clickeable, con efecto hover */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Prevenir selección de texto en ofertas externas */
.card .small,
.card .fw-semibold,
.card .badge {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
