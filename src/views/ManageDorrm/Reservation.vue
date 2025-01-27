<script setup>
import { ref, onMounted, computed } from 'vue';
const API_ROOT = import.meta.env.VITE_API_ROOT;
import { useRoute } from 'vue-router';
const { params } = useRoute();
import SuccessModal from '@/components/modals/SuccessModal.vue';

const isModalSuccessVisible = ref(false);
const modalProps = ref({ title: '', message: '' });
const modalContext = ref('');

const isUpdating = ref(false);
const maxLength = 200;

// คำนวณจำนวนตัวอักษรที่ผู้ใช้พิมพ์
const remainingChars = computed(() => {
  return maxLength - form.value.description.length;
});

// ฟังก์ชันที่คอยตรวจสอบให้ความยาวไม่เกิน 200
const handleInput = () => {
  if (form.value.description.length > maxLength) {
    form.value.description = form.value.description.slice(0, maxLength);
  }
};

// สร้างตัวแปรสำหรับฟอร์ม
const form = ref({
  dormId: params.id, // ห้องพัก
  form_date: new Date().toISOString(),
  username: '',
  email: '',
  phone: '',
  date_in: '',
  date_out: '',
  // description:''
});

// โหลดข้อมูลฟอร์มหากเป็นการอัปเดต
onMounted(async () => {
  if (params.formId) {  // หากมี formId ใน params URL
    isUpdating.value = true;
    try {
      const response = await fetch(`${API_ROOT}/forms/${params.formId}`);
      const formData = await response.json();
      form.value = { ...formData };
    } catch (error) {
      console.error('ไม่สามารถโหลดข้อมูลฟอร์มได้:', error);
    }
  }
});

// ฟังก์ชันการส่งฟอร์ม
const submitForm = async () => {
  try {
    const url = `${API_ROOT}/forms`; // ใช้ URL นี้สำหรับการส่งฟอร์มใหม่
    const method = 'POST'; // เปลี่ยนเป็น POST เสมอสำหรับการส่งข้อมูลใหม่

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('การบันทึกข้อมูลสำเร็จ:', data);

      const successMessage = { 
        title: 'ส่งฟอร์มสำเร็จ', 
        message: 'ส่งฟอร์มจองหอพักเรียบร้อยแล้ว' 
      };

      isModalSuccessVisible.value = true;
      modalProps.value = successMessage;
      
    } else {
      console.error('ไม่สามารถส่งข้อมูลได้');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  }
};


</script>



<template>
    <div class="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div class="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-center mb-6">ฟอร์มการจองหอพัก</h2>
        
        <form @submit.prevent="submitForm">
          <!-- ชื่อเต็ม -->
          <div class="mb-4">
            <label for="fullName" class="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
            <input type="text" id="fullName" v-model="form.username" class="input input-bordered w-full" required />
          </div>
          
          <!-- อีเมล -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">อีเมล</label>
            <input type="email" id="email" v-model="form.email" class="input input-bordered w-full" required />
          </div>
          
          <!-- เบอร์โทร -->
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">เบอร์โทร</label>
            <input type="text" id="phone" v-model="form.phone" class="input input-bordered w-full" required />
          </div>
          
          <!-- วันที่เข้าพัก -->
          <div class="mb-4">
            <label for="dateIn" class="block text-sm font-medium text-gray-700">วันที่เข้าพัก</label>
            <input type="date" id="dateIn" v-model="form.date_in" class="input input-bordered w-full" required />
          </div>
          
          <!-- วันที่ออก -->
          <div class="mb-4">
            <label for="dateOut" class="block text-sm font-medium text-gray-700">วันที่ออก</label>
            <input type="date" id="dateOut" v-model="form.date_out" class="input input-bordered w-full" required />
          </div>

          <!-- รายละเอียดเพิ่มเติม -->
          <!-- <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">รายละเอียดเพิ่มเติม</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              class="input input-bordered w-full h-32" 
              rows="4" 
              @input="handleInput"
            ></textarea>
            <p class="text-right text-sm text-gray-500">{{ remainingChars }} ตัวอักษรเหลือ</p>
          </div> -->


          
          <!-- ปุ่มส่ง -->
          <div class="text-center mt-10">
            <button type="submit" class="btn btn-primary w-full">
                ยืนยันการจอง
            </button>
          </div>

        </form>
      </div>
    </div>

      <!-- เมื่อ isModalVisible เป็น true จะทำให้แสดง SuccessModal -->
      <SuccessModal
        v-if="isModalSuccessVisible"
        :title="modalProps.title"
        :message="modalProps.message"
        @close="isModalSuccessVisible = false" 
        :context="modalContext"
      />
      
  </template>
  

  <style scoped>
  /* คุณสามารถเพิ่มสไตล์ที่คุณต้องการที่นี่ */
  </style>
  