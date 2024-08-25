import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dormitory/:id',
      name: 'dormitoryDetail',
      component: () => import('../views/DormitoryDetail.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LoginPopup.vue')
    },
    {
      path: '/Q&A',
      name: 'Q&A',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
