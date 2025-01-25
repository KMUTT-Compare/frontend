<script setup>
import { ref } from 'vue';

const searchInput = ref('');
const emit = defineEmits(['update:search']); // กำหนด event ที่จะ emit

const emitSearch = () => {
  emit('update:search', searchInput.value); // ส่งค่ากลับไปยัง parent
};
</script>

<template>
  <div class="relative flex-grow">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
      @input="emitSearch"
      type="search"
      id="default-search"
      class="block w-full ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="ค้นหาหอพัก..."
      required
    />
  </div>
</template>

<style scoped>
/* เพิ่มสไตล์ตามต้องการ */
</style>
