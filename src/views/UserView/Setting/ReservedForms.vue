<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import { formatDate } from '@/composables/formatDate';
const API_ROOT = import.meta.env.VITE_API_ROOT;
const userId = 1; // สมมติว่า userId ถูกกำหนดค่าจากการล็อกอิน

// สร้างตัวแปรเพื่อเก็บรายการฟอร์ม
const submittedForms = ref([]);
const isLoading = ref(true);

// ฟังก์ชันโหลดข้อมูลฟอร์มที่ส่ง
const fetchSubmittedForms = async () => {
  try {
    const response = await fetch(`${API_ROOT}/forms`);
    if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');

    const data = await response.json();
    submittedForms.value = data;
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
            <li v-for="form in submittedForms" :key="form.id" class="p-4 bg-gray-100 rounded-lg shadow space-y-2">
                <div class="flex flex-between items-center justify-between">
                    <h2>{{ form.dormName || 'ไม่มีชื่อหอพัก' }}</h2>
                    <h2>วันที่ส่ง: {{ formatDate(form.form_date)}}</h2>
                </div>

              <p class="text-sm text-gray-600">ชื่อเจ้าของหอพัก: {{ form.staffName || 'ไม่มีข้อมูล' }}</p>
              <p class="text-sm text-gray-600">เบอร์ติดต่อ: {{ form.staffPhone || 'ไม่มีข้อมูล' }}</p>
              <p class="text-sm text-gray-600">อีเมล: {{ form.staffEmail || 'ไม่มีข้อมูล' }}</p>
            </li>
          </ul>
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

button {
    background-color: #007BFF;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}
</style>
