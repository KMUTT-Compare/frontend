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
          <img src="./icons/kmutt.png" class="h-24" alt="Flowbite Logo" />
        </a>

        
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="/" :class="{ 'text-sky-500': $route.path === '/','text-red-500 :hover:text-sky-500': $route.path !== '/' }">โปรโมชั่น</a>
            </li>
            <li>
              <a href="knowledge" :class="{ 'text-sky-500': $route.path === '/knowledge'}">หอใน</a>
            </li>
            <li>
              <a href="kb" :class="{ 'text-sky-500': $route.path === '/kb' }">หอนอก</a>
            </li>
            <li>
              <a href="history" :class="{ 'text-sky-500': $route.path === '/history' }">ติดต่อเว็บไซต์</a>
            </li>
            <li>
              <a href="Q&A" :class="{ 'text-sky-500': $route.path === '/Q&A' }">ร้านค้ายอดนิยม</a>
            </li>
          </ul>
        </div>

        
        <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
         
          <div class="relative inline-block text-left">
              <button class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-center mb-2">ลงประกาศฟรี!</button>
          </div>

        </div>



      </div>
    </nav>
  </div>



</template>



<style scoped>
/* Add any custom styles here */
</style>
