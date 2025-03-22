<script setup>
import Sidebar from '@/components/Sidebar.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const router = useRouter();

// ข้อมูลผู้ใช้
const username = ref('');
const name_surname = ref('');
const email = ref('');
const telephone = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// ฟังก์ชันตรวจสอบการกรอกข้อมูล
const validateForm = () => {
  if (!username.value || !name_surname.value || !email.value || !telephone.value) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return false;
  }
  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    alert('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
    return false;
  }
  return true;
};

const validatePassword = () => {
  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    alert('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
    return false;
  }
  return true;
};

// ฟังก์ชันดึงข้อมูลผู้ใช้
const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${API_ROOT}/users/profile`, {
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
    name_surname.value = data.name_surname;
    email.value = data.email;
    telephone.value = data.telephone;

  } catch (error) {
    alert(error.message);
  }
};

// ฟังก์ชันอัปเดตข้อมูลผู้ใช้
const updateProfile = async () => {
  if (!validateForm()) return;

  const formData = {
    username: username.value,
    name_surname: name_surname.value,
    email: email.value,
    telephone: telephone.value,
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  };

  try {
    const response = await fetch(`${API_ROOT}/users`, {
      method: 'POST',
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


// ฟังก์ชันอัปเดตข้อมูลผู้ใช้
const changePassword = async () => {
  if (!validatePassword()) return;

  const formData = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  };

  try {
    const response = await fetch(`${API_ROOT}/users/password`, {
      method: 'POST',
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

// ดึงข้อมูลผู้ใช้เมื่อคอมโพเนนต์ถูกโหลด
onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="flex flex row w-full justify-center p-20">
    <Sidebar />
    <div class="pl-2 w-5/12 h-full">
      <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div class="flex flex-col space-y-6">
          <h1 class="text-3xl">แก้ไขข้อมูลสมาชิก</h1>

          <div class="flex flex-row items-center">
            <p for="username" class="w-32 text-lg">ชื่อผู้ใช้:</p>
            <input v-model="username" type="text" class="input-style" placeholder="username" required />
          </div>
          <div class="flex flex-row items-center">
            <p for="name_surname" class="w-32 text-lg">ชื่อ-นามสกุล:</p>
            <input v-model="name_surname" type="text" class="input-style" placeholder="ชื่อ-นามสกุล" required />
          </div>
          <div class="flex flex-row items-center">
            <p for="email" class="w-32 text-lg">อีเมล:</p>
            <input v-model="email" type="email" class="input-style" placeholder="อีเมล" required />
          </div>
          <div class="flex flex-row items-center">
            <p for="telephone" class="w-32 text-lg">เบอร์โทรศัพท์:</p>
            <input v-model="telephone" type="tel" class="input-style" placeholder="หมายเลขโทรศัพท์" required />
          </div>
          <button @click="updateProfile" class="ml-32 btn bg-orange-500 text-white hover:bg-orange-600 w-9/12">บันทึกข้อมูล</button>

          <h2>เปลี่ยนรหัสผ่าน</h2>
          <div class="flex flex-row items-center">
            <p for="currentPassword" class="w-32 text-lg">รหัสผ่านปัจจุบัน:</p>
            <input v-model="currentPassword" type="password" class="input-style" placeholder="รหัสผ่านปัจจุบัน" required />
          </div>
          <div class="flex flex-row items-center">
            <p for="newPassword" class="w-32 text-lg">รหัสผ่านใหม่:</p>
            <input v-model="newPassword" type="password" class="input-style" placeholder="รหัสผ่านใหม่" required />
          </div>
          <div class="flex flex-row items-center">
            <p for="confirmPassword" class="w-32 text-lg">ยืนยันรหัสผ่าน:</p>
            <input v-model="confirmPassword" type="password" class="input-style" placeholder="ยืนยันรหัสผ่าน" required />
          </div>
          <button @click="changePassword" class="ml-32 btn bg-orange-500 text-white hover:bg-orange-600 w-9/12">เปลี่ยนรหัสผ่าน</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-style {
  @apply border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none block w-9/12 p-2.5;
}

.input-style:focus {
  @apply border-blue-500;
}

.input-style::placeholder {
  @apply text-gray-500;
}

.input-style.dark {
  @apply bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500;
}

.input-style.light {
  @apply bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500;
}
</style>
