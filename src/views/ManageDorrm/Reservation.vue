<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SuccessModal from '@/components/modals/SuccessModal.vue';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const { params } = useRoute();
const router = useRouter();
const isModalSuccessVisible = ref(false);
const modalProps = ref({ title: '', message: '' });
const isLoading = ref(false);
const form = ref({
  name: '',
  email: '',
  phone: '',
  date_in: '',
  time_in: '',
  date_out: '',
  time_out: '',
  description: ''
});
const errors = ref({
  name: '',
  email: '',
  phone: '',
  date_in: '',
  time_in: '',
  date_out: '',
  time_out: '',
  description: ''
});

onMounted(async () => {
  await fetchFormData(params.id);
  if (params.action === 'cancel' && form.value) {
    form.value.description = "ยกเลิกการจอง";
    submitForm();
  }
});

const fetchFormData = async (formId) => {
  try {
    const response = await fetch(`${API_ROOT}/forms/${formId}`);
    if (!response.ok) throw new Error('ไม่พบข้อมูลฟอร์ม');
    const data = await response.json();

    form.value = {
      ...data,
      date_in: data.date_in.split('T')[0], // Ensure it's in the correct yyyy-MM-dd format
      date_out: data.date_out.split('T')[0], // Ensure it's in the correct yyyy-MM-dd format
      time_in: new Date(data.date_in).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      time_out: new Date(data.date_out).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  }
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// เช็คเบอร์โทรให้เป็นตัวเลข
const validatePhone = (phone) => {
  return /^[0-9]{1,10}$/.test(phone);
};


const validateField = (field) => {
  switch (field) {
    case 'name':
      if (!form.value.name.trim()) {
        errors.value.name = 'กรุณากรอกชื่อ-นามสกุล';
      } else if (form.value.name.length > 50) {
        errors.value.name = 'ชื่อ-นามสกุลต้องไม่เกิน 50 ตัวอักษร';
      } else if (!/^[A-Za-zก-๙\s]+$/.test(form.value.name)) {
        errors.value.name = 'ชื่อ-นามสกุลต้องเป็นตัวอักษรเท่านั้น';
      } else {
        errors.value.name = '';
      }
      break;

    case 'email':
      if (!form.value.email.trim()) {
        errors.value.email = 'กรุณากรอกอีเมล';
      } else if (!validateEmail(form.value.email)) {
        errors.value.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      } else {
        errors.value.email = '';
      }
      break;

    case 'phone':
      if (!form.value.phone.trim()) {
        errors.value.phone = 'กรุณากรอกเบอร์โทร';
      } else if (!validatePhone(form.value.phone)) {
        errors.value.phone = 'เบอร์โทรต้องเป็นตัวเลขและไม่เกิน 10 ตัว';
      } else {
        errors.value.phone = '';
      }
      break;

    case 'date_in':
      if (!form.value.date_in.trim()) {
        errors.value.date_in = 'กรุณาระบุวันที่เข้าพัก';
      } else {
        const today = new Date();
        const dateIn = new Date(form.value.date_in);
        today.setHours(0, 0, 0, 0);
        dateIn.setHours(0, 0, 0, 0);

        if (dateIn < today) {
          errors.value.date_in = 'วันที่เข้าพักต้องเป็นวันนี้หรือหลังจากนี้';
        } else {
          errors.value.date_in = '';
        }
      }
      break;

    case 'time_in':
      if (!form.value.time_in.trim()) {
        errors.value.time_in = 'กรุณาระบุเวลาเข้าพัก';
      } else {
        errors.value.time_in = '';
      }
      break;

    case 'date_out':
      if (!form.value.date_out.trim()) {
        errors.value.date_out = 'กรุณาระบุวันที่ออก';
      } else {
        const dateIn = new Date(form.value.date_in);
        const dateOut = new Date(form.value.date_out);
        if (dateOut < dateIn) {
          errors.value.date_out = 'วันที่ออกต้องมากกว่าหรือเท่ากับวันที่เข้าพัก';
        } else {
          errors.value.date_out = '';
        }
      }
      break;

    case 'time_out':
      if (!form.value.time_out.trim()) {
        errors.value.time_out = 'กรุณาระบุเวลาออก';
      } else {
        errors.value.time_out = '';
      }
      break;

    case 'description':
      if (form.value.description.trim().length === 0) {
        errors.value.description = 'กรุณากรอกรายละเอียด';
      } else {
        errors.value.description = '';
      }
      break;

    default:
      break;
  }
};


const validateForm = () => {
  Object.keys(form.value).forEach(field => {
    validateField(field);
  });
  return Object.values(errors.value).every(error => !error); // Return true if no errors
};


const submitForm = async () => {
  if (!validateForm()) return; // Only submit if the form is valid

  isLoading.value = true;
  try {
    let url = `${API_ROOT}/forms/${params.id}`;
    const method = 'PUT';

    form.value.date_in = `${form.value.date_in}T${form.value.time_in}`;
    form.value.date_out = `${form.value.date_out}T${form.value.time_out}`;
    form.value.form_date = new Date().toISOString();

    const response = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(form.value),
    });

    if (response.ok) {
      isModalSuccessVisible.value = true;
      modalProps.value = { 
        title: 'สำเร็จ!', 
        message: form.value.description === 'ยกเลิกการจอง' 
          ? 'ยกเลิกการจองเรียบร้อยแล้ว' 
          : 'อัปเดตข้อมูลเรียบร้อยแล้ว' 
      };
    } else {
      console.error('ไม่สามารถบันทึกข้อมูลได้');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100 p-4">
    <div class="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-center mb-6">
        {{ params.id ? 'แก้ไขฟอร์มการจอง' : 'ฟอร์มการจองหอพัก' }}
      </h2>

      <form @submit.prevent="submitForm">
        <!-- ชื่อ-นามสกุล -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <input type="text" v-model="form.name" @input="validateField('name')" class="input input-bordered w-full" />
          <p class="text-red-500 text-sm" v-if="errors.name">{{ errors.name }}</p>
        </div>

        <!-- อีเมล -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">อีเมล</label>
          <input type="email" v-model="form.email" @input="validateField('email')" class="input input-bordered w-full" />
          <p class="text-red-500 text-sm" v-if="errors.email">{{ errors.email }}</p>
        </div>

        <!-- เบอร์โทร -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">เบอร์โทร</label>
          <input type="text" v-model="form.phone" @input="validateField('phone')" class="input input-bordered w-full" />
          <p class="text-red-500 text-sm" v-if="errors.phone">{{ errors.phone }}</p>
        </div>

        <!-- วันที่และเวลาเข้าพัก -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">วันที่เข้าพัก</label>
          <input type="date" v-model="form.date_in" @input="validateField('date_in')" class="input input-bordered w-full" />
          <p class="text-red-500 text-sm" v-if="errors.date_in">{{ errors.date_in }}</p>
          <label class="block text-sm font-medium text-gray-700 mt-4">เวลาเข้าพัก</label>
          <input type="time" v-model="form.time_in" @input="validateField('time_in')" class="input input-bordered w-full mt-2" />
          <p class="text-red-500 text-sm" v-if="errors.time_in">{{ errors.time_in }}</p>
        </div>

        <!-- วันที่และเวลาออก -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">วันที่ออก</label>
          <input type="date" v-model="form.date_out" @input="validateField('date_out')" class="input input-bordered w-full" />
          <p class="text-red-500 text-sm" v-if="errors.date_out">{{ errors.date_out }}</p>
          <label class="block text-sm font-medium text-gray-700 mt-4">เวลาออก</label>
          <input type="time" v-model="form.time_out" @input="validateField('time_out')" class="input input-bordered w-full mt-2" />
          <p class="text-red-500 text-sm" v-if="errors.time_out">{{ errors.time_out }}</p>
        </div>

        <!-- รายละเอียดเพิ่มเติม -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">รายละเอียดเพิ่มเติม</label>
          <textarea v-model="form.description" @input="validateField('description')" class="input input-bordered w-full h-32"></textarea>
          <p class="text-red-500 text-sm" v-if="errors.description">{{ errors.description }}</p>
        </div>

        <!-- ปุ่มบันทึก -->
        <button type="submit" class="btn btn-primary w-full">
          {{ params.id ? 'อัปเดตข้อมูล' : 'ยืนยันการจอง' }}
        </button>

        <!-- ปุ่มยกเลิกการจอง (เฉพาะกรณีแก้ไขฟอร์ม) -->
        <button type="button" class="btn btn-danger w-full mt-2" @click="router.push('/reservedForms')">
          ยกเลิกการแก้ไข
        </button>
      </form>
    </div>
  </div>

  <!-- Spinner Modal -->
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-lg flex flex-col items-center">
      <span class="loading loading-spinner loading-lg"></span>
      <p class="mt-4 text-gray-700">กำลังส่งข้อมูล...</p>
    </div>
  </div>

  <!-- Success Modal -->
  <SuccessModal v-if="isModalSuccessVisible" :title="modalProps.title" :message="modalProps.message" context="reservation" @close="isModalSuccessVisible = false" />
</template>
