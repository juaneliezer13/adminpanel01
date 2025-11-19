import { createRouter, createWebHistory } from 'vue-router'
import LayoutApp from '../layouts/App.vue'
import LayoutAuth from '../layouts/AuthLayout.vue'
import { isAuthenticated } from '../services/sessionService'

const routes = [
  // Rutas con layout principal (con navegación)
  {
    path: '/',
    component: LayoutApp,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import('../views/AboutView.vue')
      }
    ]
  },
  // Rutas con layout de autenticación (sin navegación)
  {
    path: '/auth',
    component: LayoutAuth,
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
      },
      {
        path: 'olvido-contrasena',
        name: 'forgot-password',
        component: () => import('../views/ForgotPasswordView.vue')
      }
    ]
  },
  // Rutas directas (alias para facilitar acceso)
  {
    path: '/login',
    redirect: '/auth/login'
  },
  {
    path: '/olvido-contrasena',
    redirect: '/auth/olvido-contrasena'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.guestOnly && authenticated) {
    return next({ name: 'home' })
  }

  return next()
})

export default router