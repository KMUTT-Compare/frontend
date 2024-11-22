<!-- src/components/Search.vue -->
<template>
    <div class="relative flex-grow">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        v-model="searchInput"
        type="search"
        id="default-search"
        class="block w-full p-4 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="ค้นหาหอพัก..."
        required
      />
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  // รับ props หรือ v-model สำหรับค่าการค้นหา
  const searchInput = ref('');
  
  const emit = defineEmits(['update:searchQuery']);
  
  // เมื่อค่า searchInput เปลี่ยน ให้ส่งค่ากลับไปที่ parent component
  watch(searchInput, (newValue) => {
    emit('update:searchQuery', newValue);
  });
  </script>
  
  <style scoped>
  /* สไตล์ที่เกี่ยวข้องกับ search component */
  </style>