# Mini-Amazon (Vue 3 + Vite)

Tienda demo con catálogo, detalle de producto con reviews, favoritos, carrito, checkout con cupones/envíos, pedidos y ofertas externas (Mercado Libre con fallback). Tema claro/oscuro, SEO básico y 404.

## Requisitos

- Node 18+
- npm 9+

## Arranque

```bash
npm i
npm run dev        # http://localhost:5173
```

## Build & Preview

- npm run build
- npm run preview

## Estructura

```bash
src/
  pages/           # Home, Catalogo, Producto, Cart, Checkout, Orders, Favoritos, NotFound
  components/      # ExternalOffers, etc.
  router/          # index.js (lazy + meta + 404)
  assets/          # estilos globales
public/
  img/             # placeholder.png y demás imágenes
  data/            # productos.json, categorias.json, envios.json, localidades.json, cupones.json, reviews.json
```

## Datos

* Edita `public/data/productos.json` (IDs únicos).
* Categorías en `categorias.json` o se deducen del listado.
* Envíos, localidades y cupones en sus respectivos JSON.

## Ofertas externas

Componente `ExternalOffers.vue` integra Mercado Libre con manejo de límites (401/429) y **fallback dummy** si no hay resultados.

## SEO

* Título y descripción dinámicos por ruta (ver `src/router/index.js`).
* Open Graph por defecto con `placeholder.png`.

## Accesibilidad

* `alt` en imágenes clave, labels/aria en botones de iconos.
* Foco y navegación por teclado en modales.

## Rutas especiales

* 404: `/:pathMatch(.*)*` → `NotFound.vue`

## Licencia

Uso educativo.