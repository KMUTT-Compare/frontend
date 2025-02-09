<script setup>
import { ref, onMounted, computed } from 'vue';
const API_ROOT = import.meta.env.VITE_API_ROOT;
import { useRoute } from 'vue-router';
const { params } = useRoute();
import SuccessModal from '@/components/modals/SuccessModal.vue';

const isModalSuccessVisible = ref(false);
const modalProps = ref({ title: '', message: '' });
const modalContext = ref('');

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
  form_date: new Date().toISOString(),
  name: '',
  email: '',
  phone: '',
  date_in: '',
  date_out: '',
  description:'',
  dormId: params.id, // ห้องพัก
  userId:1
});


// ฟังก์ชันการแปลงวันที่เป็น ISO format
const formatDateToISO = (date) => {
  const d = new Date(date);
  return d.toISOString(); // ส่งค่ากลับเป็น ISO 8601
};

const isLoading = ref(false);

const submitForm = async () => {
  isLoading.value = true; // เริ่มการโหลด
  try {
    // เช็คว่า dormId มีค่า
    if (!form.value.dormId) {
      console.error('กรุณาระบุ dormId');
      return;  // หยุดการส่งข้อมูล
    }

    const formattedDateIn = formatDateToISO(form.value.date_in);
    const formattedDateOut = formatDateToISO(form.value.date_out);
    
    const formData = {
      form_date: formatDateToISO(form.value.form_date),
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      date_in: formattedDateIn,
      date_out: formattedDateOut,
      description: form.value.description,
      dormId: form.value.dormId,
      userId: form.value.userId,
    };

    const url = `${API_ROOT}/forms`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
  } finally {
    isLoading.value = false; // สิ้นสุดการโหลด
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
            <input type="text" id="fullName" v-model="form.name" class="input input-bordered w-full" required />
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
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">รายละเอียดเพิ่มเติม</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              class="input input-bordered w-full h-32" 
              rows="4" 
              @input="handleInput"
            ></textarea>
            <p class="text-right text-sm text-gray-500">{{ remainingChars }} ตัวอักษรเหลือ</p>
          </div>


          
                <!-- ปุ่มส่ง -->
                <!-- เพิ่ม spinner หรือข้อความกำลังโหลด -->
                <div v-if="isLoading" class="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                  <div class="text-center text-white">
                    <svg class="animate-spin h-16 w-16 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                      <path d="M4 12a8 8 0 018-8V4" fill="none" stroke="currentColor"></path>
                    </svg>
                    <p class="text-lg mt-4">กำลังส่งข้อมูล...</p>
                  </div>
                </div>

              <!-- ปุ่มส่งเมื่อไม่มีการโหลด -->
              <div v-else class="text-center mt-10">
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
  