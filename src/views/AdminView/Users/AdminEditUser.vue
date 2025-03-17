\<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserById } from '@/composables/getUserById';
import { useRoute } from 'vue-router'

const API_ROOT = import.meta.env.VITE_API_ROOT
const { params } = useRoute()
const router = useRouter()
const userData = ref({
  username: '',
  name: '',
  email: '',
  role: 'user'
})
const mode = ref('add')

onMounted(async () => {
  if (params.id) {
    mode.value = 'edit'
    userData.value = await getUserById(params.id);
  } else {
    mode.value = 'add'
  }
});

const save = async () => {
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
      : await fetch(`${API_ROOT}/users/${params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData.value),
        });

    if (response.ok) {
      alert(mode.value === 'add' ? 'User added successfully' : 'User updated successfully');
      router.back(); // กลับไปยังหน้าก่อนหน้า
    } else {
      alert('Failed to save user data');
    }
  } catch (error) {
    console.error('Error saving user:', error);
    alert('An error occurred while saving the user data');
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-6 max-w-lg bg-white rounded-xl shadow-md space-y-6">
      <h2 class="text-2xl font-semibold text-gray-700 text-center">
        {{ mode === 'edit' ? 'Edit User' : 'Add New User' }}
      </h2>
      <div class="space-y-4">
        <input v-model="userData.username" placeholder="Username" class="input" />
        <input v-model="userData.name" placeholder="Name" class="input" />
        <input v-model="userData.email" placeholder="Email" class="input" />
        <select v-model="userData.role" class="input">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
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

/* ปรับตำแหน่งของฟอร์มให้อยู่กลางหน้าจอทั้งในแนวตั้งและแนวนอน */
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
</style>
