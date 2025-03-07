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
      path: '/create_reservation/:id?',
      name: 'create_reservation',
      component: () => import('../views/ManageDorrm/CreateReservation.vue'),
    },
    {
      path: '/reservation/:id?/:action?',
      name: 'reservation',
      component: () => import('../views/ManageDorrm/Reservation.vue'),
    },
    {
      path: '/reservedForms',
      name: 'reservedForms',
      component: () => import('../views/UserView/Setting/ReservedForms.vue'),
      props: true, // เปิดให้รับค่า params เป็น props
    },
    {
      path: '/support',
      name: 'support',
      component: () => import('../views/UserView/Setting/Support.vue')
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: () => import('../views/AdminView/Dashboard.vue')
    },
    {
      path: '/admin/user-management',
      name: 'user-management',
      component: () => import('../views/AdminView/UserManagement.vue')
    },
    {
      path: '/admin/dormitory-management',
      name: 'dormitory-management',
      component: () => import('../views/AdminView/DormitoryManagement.vue')
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
