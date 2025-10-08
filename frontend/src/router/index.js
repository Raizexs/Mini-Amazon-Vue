import { createRouter, createWebHistory } from 'vue-router'

// Helper: lazy import de páginas
const Home      = () => import('@/pages/Home.vue')
const Catalogo  = () => import('@/pages/Catalogo.vue')
const Producto  = () => import('@/pages/Producto.vue')
const Cart      = () => import('@/pages/Cart.vue')
const Checkout  = () => import('@/pages/Checkout.vue')
const Orders    = () => import('@/pages/Orders.vue')
const Favoritos = () => import('@/pages/Favoritos.vue')
const NotFound  = () => import('@/pages/NotFound.vue')

const routes = [
  { path: '/',              name: 'home',      component: Home,     meta: { title: 'Inicio',    desc: 'Mini-Amazon: tecnología, libros, moda y más con envíos rápidos.' } },
  { path: '/catalogo',      name: 'catalogo',  component: Catalogo, meta: { title: 'Productos', desc: 'Explora el catálogo completo por categorías, marca y precio.' } },
  { path: '/producto/:id',  name: 'producto',  component: Producto, meta: { title: 'Detalle',    desc: 'Ficha con imágenes, especificaciones y opiniones.' } },
  { path: '/cart',          name: 'cart',      component: Cart,     meta: { title: 'Carrito',   desc: 'Revisa tu carrito y continúa al pago.' } },
  { path: '/checkout',      name: 'checkout',  component: Checkout, meta: { title: 'Checkout',  desc: 'Confirma envío, pago y cupones para tu pedido.' } },
  { path: '/orders',        name: 'orders',    component: Orders,   meta: { title: 'Mis pedidos', desc: 'Historial, detalle y recompra de tus pedidos.' } },
  { path: '/favoritos',     name: 'favoritos', component: Favoritos,meta: { title: 'Favoritos', desc: 'Tus productos guardados.' } },

  // catch-all 404
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound, meta: { title: '404', desc: 'Página no encontrada.' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(){ return { top: 0 } }
})

/** ===== SEO dinámico (título + meta description + OG básicos) ===== */
function setMetaTag(name, content){
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setOG(property, content){
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

router.afterEach((to) => {
  const base = 'Mini-Amazon'
  const title = to.meta?.title ? `${to.meta.title} | ${base}` : base
  document.title = title

  const desc = to.meta?.desc || 'Tienda de tecnología, libros, moda y más con envíos rápidos.'
  setMetaTag('description', desc)

  // Open Graph básicos
  setOG('og:title', title)
  setOG('og:description', desc)
  setOG('og:type', 'website')
  // imagen por defecto (tu placeholder)
  setOG('og:image', `${location.origin}/img/placeholder.png`)
  setOG('og:url', location.href)
})

export default router