import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
  },
  {
    path: '/typography',
    name: 'typography',
    component: () => import('@/views/typography/Typography.vue'),
  },
  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/views/icons/Icons.vue'),
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/views/cards/Card.vue'),
  },
  {
    path: '/simple-table',
    name: 'simple-table',
    component: () => import('@/views/simple-table/SimpleTable.vue'),
  },
  {
    path: '/form-layouts',
    name: 'form-layouts',
    component: () => import('@/views/form-layouts/FormLayouts.vue'),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    component: () => import('@/views/pages/account-settings/AccountSettings.vue'),
  },
  {
    path: '/pages/login',
    name: 'pages-login',
    component: () => import('@/views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/register',
    name: 'pages-register',
    component: () => import('@/views/pages/Register.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/registro-liga',
    name: 'registro-liga',
    component: () => import('@/views/pages/RegistroLiga.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/Catalogo-equipos',
    name: 'catalogo-equipos',
    component: () => import('@/views/pages/CatalogoEquipos.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/Catalogo-TipoSancion',
    name: 'catalogo-tiposancion',
    component: () => import('@/views/pages/CatalogoTipoSancion.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/Catalogo-Arbitro',
    name: 'catalogo-arbitro',
    component: () => import('@/views/pages/CatalogoArbitro.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/Catalogo-Jugador-Equipo',
    name: 'catalogo-jugador-equipo',
    component: () => import('@/views/pages/CatalogoJugadorEquipo.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/grid',
    name: 'grid',
    component: () => import('@/views/pages/Grid.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/grid2',
    name: 'grid',
    component: () => import('@/views/pages/Grid2.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
