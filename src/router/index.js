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
      path: '/*',
      name: '404',
      component: () => import('../views/Notfound.vue')
    },
    {
      path: '/dormitory/:id',
      name: 'dormitoryDetail',
      component: () => import('../views/UserView/DormitoryDetail.vue')
    },
    {
      path: '/dormManagement',
      name: 'dormManagement',
      component: () => import('../views/AdminView/DormManagement.vue')
    },
    {
      path: '/AddEditDorm',
      name: 'AddEditDorm',
      component: () => import('../views/ManageDorrm/AddEditDorm.vue')
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
    }
  ]
})

export default router
