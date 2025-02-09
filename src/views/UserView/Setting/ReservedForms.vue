<script setup>
import { ref, onMounted, computed } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import { formatDate } from '@/composables/formatDate';
import { formatPhoneNumber } from '@/composables/formatPhoneNumber';
const API_ROOT = import.meta.env.VITE_API_ROOT;

// สร้างตัวแปรเพื่อเก็บรายการฟอร์ม
const submittedForms = ref([]);
const isLoading = ref(true);

// กำหนดจำนวนข้อมูลที่จะแสดงต่อหน้า
const perPage = 5;
const currentPage = ref(1);

// ฟังก์ชันโหลดข้อมูลฟอร์มที่ส่ง
const fetchSubmittedForms = async () => {
  try {
    const response = await fetch(`${API_ROOT}/forms`);
    if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');

    const data = await response.json();
    submittedForms.value = data.sort((a, b) => new Date(b.form_date) - new Date(a.form_date)); // เรียงจากล่าสุดไปเก่าสุด
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
  } finally {
    isLoading.value = false;
  }
};

// โหลดข้อมูลเมื่อคอมโพเนนต์ถูก mount
onMounted(() => {
  fetchSubmittedForms();
});

// คำนวณฟอร์มที่จะแสดงในแต่ละหน้า
const paginatedForms = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return submittedForms.value.slice(startIndex, endIndex);
});

// ฟังก์ชันสำหรับเปลี่ยนหน้า
const changePage = (page) => {
  currentPage.value = page;
};
</script>

<template>
    <div class="flex flex-row w-full justify-center p-20">
      <Sidebar />
      <div class="pl-2 w-1/2 h-full">
        <!-- Section for Support -->
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <h1 class="font-bold text-3xl mb-6">ฟอร์มที่ส่งแล้ว</h1>
    
          <!-- Loader ระหว่างโหลด -->
          <div v-if="isLoading" class="text-center text-gray-600">
            กำลังโหลดข้อมูล...
          </div>
    
          <!-- หากไม่มีฟอร์ม -->
          <div v-else-if="submittedForms.length === 0" class="text-center text-gray-600">
            ยังไม่มีฟอร์มที่ส่ง
          </div>
    
          <!-- แสดงรายการฟอร์ม -->
          <ul v-else class="space-y-4">
            <li v-for="form in paginatedForms" :key="form.id" class="p-4 bg-gray-100 rounded-lg shadow space-y-2">
                <div class="flex flex-between items-center justify-between">
                    <h2>{{ form.dormName || 'ไม่มีชื่อหอพัก' }}</h2>
                    <h2>วันที่ส่ง: {{ formatDate(form.form_date)}}</h2>
                </div>

              <p class="text-sm text-gray-600">ชื่อผู้ดูแลหอพัก: {{ form.staffName || 'ไม่มีข้อมูล' }}</p>
              <p class="text-sm text-gray-600">เบอร์ติดต่อ: {{ formatPhoneNumber(form.staffPhone || 'ไม่มีข้อมูล') }}</p>
              <p class="text-sm text-gray-600">อีเมล: {{ form.staffEmail || 'ไม่มีข้อมูล' }}</p>
            </li>
          </ul>


        <!-- Pagination -->
        <div class="mt-6 flex justify-center items-center space-x-4">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="btn p-2 bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            <!-- Chevron Left Icon (ก่อนหน้า) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <span class="text-sm text-gray-600">
            หน้า {{ currentPage }} จาก {{ Math.ceil(submittedForms.length / perPage) }}
          </span>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === Math.ceil(submittedForms.length / perPage)"
            class="btn p-2 bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            <!-- Chevron Right Icon (ถัดไป) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>




        </div>
      </div>
    </div>
</template>

<style scoped>
h1{
    font-size: 2rem;
    color: #2b2b2b; 
}

h2{
    font-size: 1.5rem;
    color: #333;
    font-weight: bold;
}

p {
    font-size: 1rem;
    line-height: 1.6;
    color: #666;
}

span {
   font-size: 1rem;
   color: #333;
}

ul {
    list-style-type: disc;
    margin-left: 20px;
}



</style>
