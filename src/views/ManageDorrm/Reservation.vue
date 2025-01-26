<script setup>
import { ref } from 'vue';

const API_ROOT = import.meta.env.VITE_API_ROOT

// สร้างตัวแปรสำหรับฟอร์ม
const form = ref({
  username: '',
  email: '',
  phone: '',
  date_in: '',
  date_out: '',
  dormId: 1, // ห้องพัก
  specialRequests: ''
});

// ฟังก์ชันการส่งฟอร์ม
const submitForm = async () => {
  try {
    const response = await fetch(`${API_ROOT}/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('การจองสำเร็จ:', data);
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
            <label for="fullName" class="block text-sm font-medium text-gray-700">ชื่อเต็ม</label>
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
          
          <!-- ห้องพัก -->
          <div class="mb-4">
            <label for="roomType" class="block text-sm font-medium text-gray-700">ประเภทห้องพัก</label>
            <select id="roomType" v-model="form.dormId" class="select select-bordered w-full">
              <option value="1">ห้องเดี่ยว</option>
              <option value="2">ห้องคู่</option>
              <option value="3">ห้องสวีท</option>
            </select>
          </div>
          
          <!-- ข้อความพิเศษ -->
          <div class="mb-4">
            <label for="specialRequests" class="block text-sm font-medium text-gray-700">ข้อกำหนดพิเศษ</label>
            <textarea id="specialRequests" v-model="form.specialRequests" class="textarea textarea-bordered w-full" placeholder="ระบุข้อกำหนดพิเศษหากมี"></textarea>
          </div>
          
          <!-- ปุ่มส่ง -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary w-full">ยืนยันการจอง</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  

  <style scoped>
  /* คุณสามารถเพิ่มสไตล์ที่คุณต้องการที่นี่ */
  </style>
  