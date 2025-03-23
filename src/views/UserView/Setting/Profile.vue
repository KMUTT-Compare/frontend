<script setup>
import Sidebar from '@/components/Sidebar.vue';
import { validatePhone, validateEmail, validateName, validatePassword } from '@/composables/Validate/ValidateData';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const router = useRouter();


const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// ข้อมูลผู้ใช้
const username = ref('');
const name = ref('');
const email = ref('');
const phone = ref('');
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// ข้อความผิดพลาด
const errors = ref({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

// ฟังก์ชันตรวจสอบรหัสผ่าน
const validatePasswordField = () => {
  if (!newPassword.value || !confirmPassword.value) {
    return false; // ให้ return false ถ้ายังไม่ได้กรอกรหัสผ่าน
  }
  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน';
    return false;
  }
  if (!validatePassword(newPassword.value)) {
    errors.value.confirmPassword = 'รหัสผ่านต้องมีอย่างน้อย 1 ตัวอักษรพิมพ์ใหญ่, 1 ตัวเลข และ 1 สัญลักษณ์พิเศษ';
    return false;
  }
  errors.value.confirmPassword = '';
  return true;
};


watch([newPassword, confirmPassword], () => {
  validatePasswordField(); // เรียกตรวจสอบรหัสผ่านทุกครั้งที่ newPassword หรือ confirmPassword เปลี่ยนค่า
});


watch([name], () => {
  validateData(); 
});

watch([email], () => {
  validateData(); 
});

watch([phone], () => {
  validateData(); 
});



// ฟังก์ชันตรวจสอบข้อมูลที่กรอก
const validateData = () => {
  errors.value.username = username.value ? '' : 'กรุณากรอกชื่อผู้ใช้';
  errors.value.name = validateName(name.value)  ? '' : 'กรุณากรอกชื่อ-นามสกุล';
  errors.value.email = validateEmail(email.value) ? '' : 'กรุณากรอกอีเมลให้ถูกต้อง';
  errors.value.phone = validatePhone(phone.value) ? '' : 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)';
};

// ฟังก์ชันดึงข้อมูลผู้ใช้
const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${API_ROOT}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('token')
      }
    });

    if (!response.ok) {
      throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }

    const data = await response.json();

    // กำหนดค่าข้อมูลผู้ใช้ในฟอร์ม
    username.value = data.username;
    name.value = data.name;
    email.value = data.email;
    phone.value = data.phone;

  } catch (error) {
    alert(error.message);
  }
};

// ฟังก์ชันอัปเดตข้อมูลผู้ใช้
const updateProfile = async () => {
  if (!validateData()) return;

  const formData = {
    username: username.value,
    name: name.value,
    email: email.value,
    phone: phone.value, 
  };

  try {
    const response = await fetch(`${API_ROOT}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
    }

    const data = await response.json();

    // แจ้งผลการอัปเดตสำเร็จ
    alert('อัปเดตข้อมูลสำเร็จ');
    router.push('/profile'); // เปลี่ยนเส้นทางไปยังหน้าประวัติผู้ใช้

  } catch (error) {
    alert(error.message);
  }
};

// ฟังก์ชันอัปเดตข้อมูลรหัสผ่าน
const changePassword = async () => {
  if (!validatePasswordField()) return;

  try {
    const response = await fetch(`${API_ROOT}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify({
        oldPassword: oldPassword.value, 
        newPassword: newPassword.value
      }),
    });

    if (!response.ok) {
      throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
    }

    // แจ้งผลการอัปเดตสำเร็จ
    alert('อัปเดตข้อมูลสำเร็จ');


  } catch (error) {
    alert(error.message);
  }
};

// ดึงข้อมูลผู้ใช้เมื่อคอมโพเนนต์ถูกโหลด
onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="flex flex-row w-full justify-center p-20">
    <Sidebar />
    <div class="pl-2 w-5/12 h-full">
      <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div class="flex flex-col space-y-6">
          <h1 class="text-3xl">แก้ไขข้อมูลสมาชิก</h1>

          <div class="flex flex-row items-center">
            <p for="username" class="w-32 text-lg">ชื่อผู้ใช้:</p>
            <input v-model="username" type="text" class="input-style" placeholder="username" />
          </div>
          <span v-if="errors.username" class="pl-32 text-red-500 text-sm mt-1">{{ errors.username }}</span>

          <div class="flex flex-row items-center">
            <p for="name_surname" class="w-32 text-lg">ชื่อ-นามสกุล:</p>
            <input v-model="name" type="text" class="input-style" placeholder="ชื่อ-นามสกุล" />
          </div>
          <span v-if="errors.name" class="pl-32 text-red-500 text-sm mt-1">{{ errors.name }}</span>

          <div class="flex flex-row items-center">
            <p for="email" class="w-32 text-lg">อีเมล:</p>
            <input v-model="email" type="email" class="input-style" placeholder="อีเมล" />
          </div>
          <span v-if="errors.email" class="pl-32 text-red-500 text-sm mt-1">{{ errors.email }}</span>

          <div class="flex flex-row items-center">
            <p for="telephone" class="w-32 text-lg">เบอร์โทรศัพท์:</p>
            <input v-model="phone" type="tel" class="input-style" placeholder="หมายเลขโทรศัพท์" />
          </div>
          <span v-if="errors.phone" class="pl-32 text-red-500 text-sm mt-1">{{ errors.phone }}</span>

          <button @click="updateProfile" class="ml-32 btn bg-orange-500 text-white hover:bg-orange-600 w-9/12">บันทึกข้อมูล</button>

          <h1 class="text-3xl">เปลี่ยนรหัสผ่าน</h1>
          <div class="flex flex-row items-center relative">
            <p for="oldPassword" class="w-32 text-lg">รหัสผ่านปัจจุบัน:</p>
            <input 
              :type="showOldPassword ? 'text' : 'password'" 
              v-model="oldPassword" 
              class="input-style pr-10" 
              placeholder="รหัสผ่านปัจจุบัน" 
            />
            <button type="button" class="toggle-btn" @click="showOldPassword = !showOldPassword">
              👁
            </button>
          </div>

          <div class="flex flex-row items-center relative">
            <p for="newPassword" class="w-32 text-lg">รหัสผ่านใหม่:</p>
            <input 
              :type="showNewPassword ? 'text' : 'password'" 
              v-model="newPassword" 
              class="input-style pr-10" 
              placeholder="รหัสผ่านใหม่" 
            />
            <button type="button" class="toggle-btn" @click="showNewPassword = !showNewPassword">
              👁
            </button>
          </div>

          <div class="flex flex-row items-center relative">
            <p for="confirmPassword" class="w-32 text-lg">ยืนยันรหัสผ่าน:</p>
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              v-model="confirmPassword" 
              class="input-style pr-10" 
              placeholder="ยืนยันรหัสผ่าน" 
            />
            <button type="button" class="toggle-btn" @click="showConfirmPassword = !showConfirmPassword">
              👁
            </button>
          </div>

          <span v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</span>

          <button @click="changePassword" class="ml-32 btn bg-orange-500 text-white hover:bg-orange-600 w-9/12">เปลี่ยนรหัสผ่าน</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.input-style {
  width: 80%;
  padding: 10px 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease-in-out;
  background-color: #fff;
}

.input-style:focus {
  border-color: #f97316; /* สีส้ม */
  box-shadow: 0 0 5px rgba(249, 115, 22, 0.5);
}

.input-style::placeholder {
  color: #a0aec0;
  font-style: italic;
}

.input-style:disabled {
  background-color: #f7f7f7;
  cursor: not-allowed;
}


.toggle-btn {
  position: absolute;
  right: 10px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  color: #888;
}

.toggle-btn:hover {
  color: #f97316;
}

</style>
