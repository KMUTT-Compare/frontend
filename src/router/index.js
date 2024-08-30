import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/Q&A',
      name: 'Q&A',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
