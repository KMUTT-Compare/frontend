import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/kb',
      name: 'kb',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/Q&A',
      name: 'Q&A',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
