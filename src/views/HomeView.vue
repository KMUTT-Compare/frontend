<script setup>
import { ref, onMounted } from 'vue'

// ใช้การตั้งค่า API_ROOT
const API_ROOT = import.meta.env.VITE_API_ROOT

const dormitories = ref([])
console.log(dormitories)

onMounted(async () => {
   await getKmutt();
})

// ฟังก์ชันสำหรับดึงข้อมูล
const getKmutt = async () => {
  try {
    const res = await fetch(`${API_ROOT}`); // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง
    if (res.ok) {
      dormitories.value = await res.json();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
</script>

<template>
  
  <div class="w-full h-full bg-gray-100 p-5">
  
    
    <form class="max-w-md mx-auto m-2">   
          
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ค้นหาด้วยชื่อ" required />
                <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ค้นหา</button>
            </div>
      </form>
    
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 m-10">
      
      <div v-for="dorm in dormitories" :key="dorm.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
        
        <figure>
          <img src="https://cdn.pixabay.com/photo/2019/05/06/23/35/vat-4184607_1280.jpg" alt="Dormitory Image" class="w-full h-48 object-cover" />
        </figure>
        
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">{{ dorm.name }}</h2>
          <p class="text-gray-600 mb-2">Location: {{ dorm.location }}</p>
          <p class="text-gray-600 mb-4">ID: {{ dorm.id }}</p>
          <div class="flex justify-end">
            <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">จอง</button>
          </div>
        </div>
      
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
