<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserById } from '@/composables/getUserById';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const { params } = useRoute();
const router = useRouter();
const userData = ref({
  username: '',
  name: '',
  email: '',
  phone: '',
  role: 'user',
  password: ''
});
const mode = ref('add');
const passwordVisible = ref(false); // สำหรับแสดง/ซ่อนรหัสผ่าน
const errorMessages = ref({
  username: '',
  email: '',
  password: '',
  phone: '' // เพิ่ม error message สำหรับ phone
});

// ฟังก์ชันสำหรับ generate รหัสผ่านที่ปลอดภัย
const generatePassword = () => {
  const length = 12; // ความยาวของรหัสผ่าน
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  userData.value.password = password;
};

// ฟังก์ชันที่ใช้ตรวจสอบความแรงของรหัสผ่าน
const checkPasswordStrength = (password) => {
  const strength = password.length >= 8 ? 1 : 0;
};

// ฟังก์ชันที่ใช้ validate ฟอร์ม
const validateForm = () => {
  errorMessages.value = { username: '', email: '', password: '', phone: '' }; // รีเซ็ตรหัสผิดสำหรับ phone
  let valid = true;

  if (!userData.value.username) {
    errorMessages.value.username = 'Username is required';
    valid = false;
  }

  if (!userData.value.email || !/\S+@\S+\.\S+/.test(userData.value.email)) {
    errorMessages.value.email = 'Please enter a valid email';
    valid = false;
  }

  if (mode.value === 'add' && (!userData.value.password || userData.value.password.length < 8)) {
    errorMessages.value.password = 'Password must be at least 8 characters long';
    valid = false;
  }

  if (!userData.value.phone || !/^\+?[0-9]\d{1,14}$/.test(userData.value.phone)) { // ตรวจสอบเบอร์โทรศัพท์
    errorMessages.value.phone = 'Please enter a valid phone number';
    valid = false;
  }

  return valid;
};

onMounted(async () => {
  if (params.id) {
    mode.value = 'edit';
    userData.value = await getUserById(params.id);
  } else {
    mode.value = 'add';
  }
});

// ฟังก์ชันที่ใช้บันทึกข้อมูล
const save = async () => {
  if (!validateForm()) {
    return;
  }

    // เช็คว่า userData มีข้อมูลที่สมบูรณ์ก่อนการส่ง
    console.log('User Data:', userData.value);  // ตรวจสอบข้อมูลที่ส่ง

  try {
    const response = mode.value === 'add'
      ? await fetch(`${API_ROOT}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('token')
          },
          body: JSON.stringify(userData.value),
        })
      : await fetch(`${API_ROOT}/admin/user/${params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('token')
          },
          body: JSON.stringify(userData.value),
        });

    // ถ้า response ไม่ ok (เช่น 400, 500 เป็นต้น)
    if (!response.ok) {
      const errorData = await response.json();
      
      // ตรวจสอบ error message และแสดงข้อความ
      if (errorData.message === 'Email already exists') {
        errorMessages.value.email = 'Email already exists';
      } else if (errorData.message === 'Username already exists') {
        errorMessages.value.username = 'Username already exists';
      } else {
        alert(errorData.message || 'Failed to save user data');
      }

      return; // หยุดการทำงานเมื่อเกิดข้อผิดพลาด
    }

    // ถ้าส่งข้อมูลสำเร็จ
    alert(mode.value === 'add' ? 'User added successfully' : 'User updated successfully');
    router.back(); // กลับไปยังหน้าก่อนหน้า
  } catch (error) {
    console.error('Error saving user:', error);
    alert('An error occurred while saving the user data');
  }
};

</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-6 w-1/4 bg-white rounded-xl shadow-md space-y-6">
      <h2 class="text-2xl font-semibold text-gray-700 text-center">
        {{ mode === 'edit' ? 'Edit User' : 'Add New User' }}
      </h2>
      <div class="space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-600">Username</label>
          <input id="username" v-model="userData.username" placeholder="Username" class="input" :class="{'border-red-500': errorMessages.username}" />
          <span v-if="errorMessages.username" class="text-red-500 text-sm">{{ errorMessages.username }}</span>
        </div>

        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600">Name</label>
          <input id="name" v-model="userData.name" placeholder="Name" class="input" />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
          <input id="email" v-model="userData.email" placeholder="Email" class="input" :class="{'border-red-500': errorMessages.email}" />
          <span v-if="errorMessages.email" class="text-red-500 text-sm">{{ errorMessages.email }}</span>
        </div>

        <!-- Role -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-600">Role</label>
          <select id="role" v-model="userData.role" class="input">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- ฟิลด์ Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-600">Phone</label>
          <input id="phone" v-model="userData.phone" placeholder="Phone" class="input" :class="{'border-red-500': errorMessages.phone}" />
          <span v-if="errorMessages.phone" class="text-red-500 text-sm">{{ errorMessages.phone }}</span>
        </div>

        <!-- ฟิลด์ Password -->
        <div v-if="mode === 'add'">
          <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
          <div class="flex items-center space-x-2">
            <input 
              v-if="mode === 'add'"
              v-model="userData.password"
              @input="checkPasswordStrength(userData.password)"
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="Password"
              class="input"
              :class="{'border-red-500': errorMessages.password}" 
            />
            <button type="button" @click="passwordVisible = !passwordVisible" class="text-blue-500 text-sm">
              {{ passwordVisible ? 'Hide Password' : 'Show Password' }}
            </button>
          </div>
          <span v-if="errorMessages.password" class="text-red-500 text-sm">{{ errorMessages.password }}</span>

          <!-- ปุ่มสำหรับ generate password -->
          <div v-if="mode === 'add'" class="my-4">
            <button @click="generatePassword" class="btn bg-blue-500 text-white">
              Generate Password
            </button>
          </div>

          <div v-if="mode === 'add'" class="mt-2">
            <span>Password Strength: </span>
            <div :class="{'text-green-500': userData.password.length >= 8, 'text-red-500': userData.password.length < 8}">
              {{ userData.password.length >= 8 ? 'Strong' : 'Weak' }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button @click="router.back()" class="btn bg-gray-300">Cancel</button>
        <button @click="save" class="btn bg-blue-500 text-white">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn {
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.min-h-screen {
  min-height: 100vh;
}

.border-red-500 {
  border-color: red;
}

.text-red-500 {
  color: red;
}

.text-green-500 {
  color: green;
}
</style>
