import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/UserView/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/UserView/AboutView.vue')
    },
    {
      path: '/service',
      name: 'service',
      component: () => import('../views/UserView/AboutView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/UserView/Contact.vue')
    },
    {
      path: '/*',
      name: '404',
      component: () => import('../views/Notfound.vue')
    },
    {
      path: '/dormitory/:id',
      name: 'dormitoryDetail',
      component: () => import('../views/UserView/DormitoryDetail.vue')
    },
  ]
})

export default router
