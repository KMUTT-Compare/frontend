<script setup>
import { ref} from 'vue';
import { useAuthStore } from '@/stores/authorize';

const authStore = useAuthStore();

const isMenuOpen = ref(false);


import { useUIStore } from '@/stores/uiStore';
import LoginPopup from '@/components/LoginPopup.vue';
import RegisterPopup from './RegisterPopup.vue';

const uiStore = useUIStore();

const openLoginPopup = () => {
  uiStore.openLoginPopup();
};

const openRegisPopup = () => {
  uiStore.openRegisPopup();
};



</script>

<template>
<nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    
    <a href="#"><img src="./icons/kmutt_icon.png" class="icon" alt="icon"></a>
    
    <div class="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
      <div v-if="authStore.role==''"><button type="button" @click="openLoginPopup" class="text-gray-900 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium rounded-lg text-sm px-4 py-2 text-center">เข้าสู่ระบบ</button></div>
      <div v-if="authStore.isAuthenticated"><button type="button" @click="authStore.logout" class="text-gray-900 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium rounded-lg text-sm px-4 py-2 text-center">ออกจากระบบ</button></div>
      <button type="button" @click="openRegisPopup" class="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">ลงประกาศฟรี</button>
      <button @click="isMenuOpen = !isMenuOpen" data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>
    </div>

    <!-- Items bar -->
    <div :class="isMenuOpen ? 'block' : 'hidden'" class="items-center justify-between w-full md:flex md:w-auto md:order-1">
      <ul class="flex flex-col pt-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <a href="/" class="hover:bg-gray-100 active:bg-gray-200">หน้าหลัก</a>
        </li>
        <li>
          <a href="about" class="hover:bg-gray-100 active:bg-gray-200">ร้านค้าแนะนำ</a>
        </li>
        <li>
          <a href="faq" class="hover:bg-gray-100 active:bg-gray-200">ช่วยเหลือ</a>
        </li>
        <li>
          <a href="contact" class="hover:bg-gray-100 active:bg-gray-200">ติดต่อเว็บ</a>
        </li>
      </ul>
    </div>
  </div>
  <LoginPopup v-if="uiStore.isLoginPopupOpen"/>
  <RegisterPopup v-if="uiStore.isRegisPopupOpen"/>
</nav>

</template>

<style scoped>
/* Add any custom styles here */
@media(min-width: 50px){
  .icon{
    height: 40px;
  }
}

@media(min-width: 640px){
  .icon{
    height: 50px;
  }
}

@media(min-width: 1280px){
  .icon{
    height: 50px;
  }
}
</style>
