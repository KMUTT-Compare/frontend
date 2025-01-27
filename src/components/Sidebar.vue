<script setup>

</script>
 
<template>

<div aria-label="Sidebar">
   <div class="px-3 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
         <li>
            <a href="profile" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img class="w-7" src="./icons/user_icon.png" alt="">
               <span class="ms-3">แก้ไขโปรไฟล์</span>
            </a>
         </li>
         <li>
            <a href="dormlists" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img class="w-7" src="./icons/list_icon.png" alt="">
               <span class="flex-1 ms-3 whitespace-nowrap">รายการประกาศ</span>
            </a>
         </li>
         <li>
            <a href="reservedForms" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img class="w-7" src="./icons/reservation.png" alt="">
               <span class="flex-1 ms-3 whitespace-nowrap">หอพักที่จอง</span>
            </a>
         </li>
         <li>
            <a href="support" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img class="w-7" src="./icons/information_icon.png" alt="">
               <span class="flex-1 ms-3 whitespace-nowrap">support</span>
            </a>
         </li>
      </ul>
   </div>
</div>

</template>
 
<style scoped>

</style>