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
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/UserView/FavoritesView.vue')
    },
    {
      path: '/service',
      name: 'service',
      component: () => import('../views/UserView/FavoritesView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/UserView/Contact.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/UserView/FAQ.vue')
    },
    {
      path: '/dormitory/:id',
      name: 'dormitoryDetail',
      component: () => import('../views/UserView/DormitoryDetail.vue')
    },
    {
      path: '/addEditDormitory/:id?',
      name: 'addEditDormitory',
      component: () => import('../views/ManageDorrm/AddEditDormitory.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserView/Setting/Profile.vue')
    },
    {
      path: '/dormlists',
      name: 'dormlists',
      component: () => import('../views/UserView/Setting/DormLists.vue')
    },
    {
      path: '/support',
      name: 'support',
      component: () => import('../views/UserView/Setting/Support.vue')
    },
    // 404 route - ใช้ pathMatch(.*)* สำหรับจับทุก URL
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/Notfound.vue')
    }
  ]
})

export default router
