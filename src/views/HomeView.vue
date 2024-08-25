<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSearchStore } from '@/stores/searchStore';
import { useRouter } from 'vue-router'
const router = useRouter()

// ใช้การตั้งค่า API_ROOT
const API_ROOT = import.meta.env.VITE_API_ROOT

const dormitories = ref([])
const store = useSearchStore();
const filteredDormitories = computed(() => store.filteredDormitories(dormitories.value));

onMounted(async () => {
   await getDormitories();
})

// ฟังก์ชันสำหรับดึงข้อมูล
const getDormitories = async () => {
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

const showDetail = (dormitoryId) =>{
  router.push({
    name : 'dormitoryDetail',
    params : {id : dormitoryId}
  })
}


</script>

<template>
  <div class="w-full h-full flex justify-center mt-24">


    <div class="items">
      
      <div v-for="dorm in filteredDormitories" :key="dorm.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
        
        <figure>
          <img src="https://cdn.pixabay.com/photo/2019/05/06/23/35/vat-4184607_1280.jpg" alt="Dormitory Image" class="w-full h-48 object-cover" />
        </figure>
        
        <div class="item">
          <h2 class="text-xl font-bold mb-2">{{ dorm.name }}</h2>
          <p class="text-gray-600 mb-2">Location: {{ dorm.location }}</p>
          <p class="text-gray-600 mb-4">ID: {{ dorm.id }}</p>
          <div class="flex justify-end">
            <button @click="showDetail(dorm.id)" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">ดูรายละเอียดเพิ่มเติม</button>
          </div>
        </div>
      
      </div>
    </div> 
  </div>

  
</template>

<style scoped>

.items{
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-template-rows: auto;
  column-gap: 10px;
  row-gap: 5px;
}

.item{
  padding: 16px;
}
</style>
