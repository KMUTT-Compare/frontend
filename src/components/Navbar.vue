<script setup>
import { ref } from 'vue';
const statusMode = ref(false);

const mode = () => {
  statusMode.value = !statusMode.value;
};

const loginStatus = ref(true)
const isLogin = ()=>{
  loginStatus.value = !loginStatus.value
}
</script>


<template>

  <div>
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="./icons/chick.png" class="h-10" alt="Flowbite Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">JipTAX</span>
        </a>

        
        
        <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          
          <!-- Dropdown menu -->
         
          <div class="relative inline-block text-left">

            <div v-if="loginStatus">
              <button type="button" @click="mode" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                Options
                <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <div v-show="statusMode" class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
              <div class="py-1" role="none">
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">แก้ไขโปรไฟล์</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">การตั้งค่า</a>
              </div>
              <div class="py-1" role="none">
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2">Archive</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Move</a>
              </div>
              <div class="py-1" role="none">
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-4">Share</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-5">Add to favorites</a>
              </div>
              <div class="py-1" role="none">
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-6">ออกจากระบบ</a>
              </div>
            </div>
          
          </div>

        </div>

        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="/" :class="{ 'text-sky-500': $route.path === '/','text-red-500 :hover:text-sky-500': $route.path !== '/' }">หน้าหลัก</a>
            </li>
            <li>
              <a href="knowledge" :class="{ 'text-sky-500': $route.path === '/knowledge'}">สื่อความรู้</a>
            </li>
            <li>
              <a href="kb" :class="{ 'text-sky-500': $route.path === '/kb' }">คู่มือการใช้งาน</a>
            </li>
            <li>
              <a href="history" :class="{ 'text-sky-500': $route.path === '/history' }">ประวัติการคำนวน</a>
            </li>
            <li>
              <a href="Q&A" :class="{ 'text-sky-500': $route.path === '/Q&A' }">ถาม-ตอบ</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>



</template>



<style scoped>
/* Add any custom styles here */
</style>
