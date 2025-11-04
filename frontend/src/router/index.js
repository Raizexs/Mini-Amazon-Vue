import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/stores/authStore";

// Helper: lazy import de páginas
const Welcome = () => import("@/pages/Welcome.vue");
const Dashboard = () => import("@/pages/Dashboard.vue");
const Catalogo = () => import("@/pages/Catalogo.vue");
const Producto = () => import("@/pages/Producto.vue");
const Cart = () => import("@/pages/Cart.vue");
const Checkout = () => import("@/pages/Checkout.vue");
const Orders = () => import("@/pages/Orders.vue");
const Favoritos = () => import("@/pages/Favoritos.vue");
const Login = () => import("@/pages/Login.vue");
const Register = () => import("@/pages/Register.vue");
const NotFound = () => import("@/pages/NotFound.vue");

const routes = [
  // Welcome page (landing) - for non-authenticated users
  {
    path: "/",
    name: "welcome",
    component: Welcome,
    meta: {
      title: "Bienvenido",
      desc: "Mini-Amazon: tecnología, libros, moda y más con envíos rápidos.",
      guest: true,
    },
  },

  // Auth routes
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Iniciar Sesión",
      desc: "Ingresa a tu cuenta de Mini-Amazon.",
      guest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      title: "Registrarse",
      desc: "Crea tu cuenta en Mini-Amazon.",
      guest: true,
    },
  },

  // Protected routes (require authentication)
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      title: "Inicio",
      desc: "Dashboard principal de Mini-Amazon.",
      requiresAuth: true,
    },
  },
  {
    path: "/catalogo",
    name: "catalogo",
    component: Catalogo,
    meta: {
      title: "Productos",
      desc: "Explora el catálogo completo por categorías, marca y precio.",
      requiresAuth: true,
    },
  },
  {
    path: "/producto/:id",
    name: "producto",
    component: Producto,
    meta: {
      title: "Detalle",
      desc: "Ficha con imágenes, especificaciones y opiniones.",
      requiresAuth: true,
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
    meta: {
      title: "Carrito",
      desc: "Revisa tu carrito y continúa al pago.",
      requiresAuth: true,
    },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
    meta: {
      title: "Checkout",
      desc: "Confirma envío, pago y cupones para tu pedido.",
      requiresAuth: true,
    },
  },
  {
    path: "/orders",
    name: "orders",
    component: Orders,
    meta: {
      title: "Mis pedidos",
      desc: "Historial, detalle y recompra de tus pedidos.",
      requiresAuth: true,
    },
  },
  {
    path: "/favoritos",
    name: "favoritos",
    component: Favoritos,
    meta: {
      title: "Favoritos",
      desc: "Tus productos guardados.",
      requiresAuth: true,
    },
  },

  // catch-all 404
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: NotFound,
    meta: { title: "404", desc: "Página no encontrada." },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

/** ===== Navigation Guards ===== */
router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated.value;

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuth) {
    // Redirect to login with return URL
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }
  // Check if route is only for guests (login/register/welcome)
  else if (to.meta.guest && isAuth) {
    // Already logged in, redirect to dashboard
    next({ name: "dashboard" });
  } else {
    next();
  }
});

/** ===== SEO dinámico (título + meta description + OG básicos) ===== */
function setMetaTag(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setOG(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

router.afterEach((to) => {
  const base = "Mini-Amazon";
  const title = to.meta?.title ? `${to.meta.title} | ${base}` : base;
  document.title = title;

  const desc =
    to.meta?.desc ||
    "Tienda de tecnología, libros, moda y más con envíos rápidos.";
  setMetaTag("description", desc);

  // Open Graph básicos
  setOG("og:title", title);
  setOG("og:description", desc);
  setOG("og:type", "website");
  // imagen por defecto (tu placeholder)
  setOG("og:image", `${location.origin}/img/placeholder.png`);
  setOG("og:url", location.href);
});

export default router;
