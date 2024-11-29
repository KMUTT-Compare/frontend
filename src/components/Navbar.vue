<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (event) => {
  if (!event.target.closest('#dropdownInformationButton') && !event.target.closest('#dropdownInformation')) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown);
});
import { useAuthStore } from '@/stores/authorize';
import router from '@/router';

const authStore = useAuthStore();

const isMenuOpen = ref(false);


import { useUIStore } from '@/stores/uiStore';
import LoginPopup from '@/components/popups/LoginPopup.vue';
import RegisterPopup from './popups/RegisterPopup.vue';

const uiStore = useUIStore();

const openLoginPopup = () => {
  uiStore.openLoginPopup();
};

const openRegisPopup = () => {
  uiStore.openRegisPopup();
};

const clickProfile = () => {
  toggleDropdown()
  router.push('/profile')
}

const clickDormlists = ()=>{
  toggleDropdown()
  router.push('/dormlists')
}

const clickSupport = ()=>{
  toggleDropdown()
  router.push('/support')
}


</script>

<template>
<nav class="relative bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    
    <a href="#"><img src="./icons/logoKmutt.png" class="w-20" alt="icon"></a>
    
    <div class="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
      <div v-if="authStore.role=='guest'"><button type="button" @click="openLoginPopup" class="text-gray-900 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium rounded-lg text-sm px-4 py-2 text-center">เข้าสู่ระบบ</button></div>
      <div v-if="authStore.role !== 'guest'"><button type="button" @click="router.push('/addEditDormitory')" class="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">เพิ่มหอพัก</button></div>
      
      <button v-if="authStore.role=='guest'"  type="button" @click="openRegisPopup" class="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">สมัครสมาชิก</button>
      <button @click="isMenuOpen = !isMenuOpen" data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>

      

      <div v-if="authStore.role !== 'guest'" class="flex flex-row">
        <p class="py-2.5"><img src="../components/icons/line.png" alt=""></p>
          <button @click="toggleDropdown" id="dropdownInformationButton" class="font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
            User: Korapin
            <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>

          <!-- Dropdown menu -->

          <div v-if="isDropdownOpen" id="dropdownInformation" class="w-56 absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
            <div @click="toggleDropdown" class="px-4 py-3 text-sm text-gray-900 cursor-pointer">
              <div>Korapin Jeng</div>
              <div class="font-medium truncate">Korapin.jong@gmail.com</div>
            </div>
            <ul class="py-2 text-sm text-gray-700">
              <li>
                <p @click="clickProfile"  class="block px-4 py-2 hover:bg-gray-100 cursor-pointer">โปรไฟล์</p>
              </li>
              <li>
                <p @click="clickDormlists" class="block px-4 py-2 hover:bg-gray-100 cursor-pointer">รายการประกาศ</p>
              </li>
              <li>
                <p @click="clickSupport" class="block px-4 py-2 hover:bg-gray-100 cursor-pointer">ความช่วยเหลือและการสนับสนุน</p>
              </li>
            </ul>
            <div class="py-2">
              <p @click="authStore.logout()" class="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ออกจากระบบ</p>
            </div>
          </div>

      </div>

    </div>

    <!-- Items bar -->
    <div :class="isMenuOpen ? 'block' : 'hidden'" class="items-center justify-between w-full md:flex md:w-auto md:order-1">
      <ul class="flex flex-col pt-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <p @click="$router.push('/')" class="cursor-pointer hover hover:bg-gray-100 active:bg-gray-200">หน้าหลัก</p>
        </li>
        <li  v-if="authStore.role !== 'guest'"> 
          <p @click="$router.push('/favorites')" class="cursor-pointer hover hover:bg-gray-100 active:bg-gray-200">รายการโปรด</p>
        </li>
        <li>
          <p @click="$router.push('/faq')" class="cursor-pointer hover hover:bg-gray-100 active:bg-gray-200">ช่วยเหลือ</p>
        </li>
        <li>
          <p @click="$router.push('/contact')" class="cursor-pointer hover hover:bg-gray-100 active:bg-gray-200">ติดต่อเรา</p>
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
