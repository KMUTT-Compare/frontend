<script setup>
import { onMounted, computed, ref } from 'vue';
import { formatDate } from '@/composables/formatDate';
import { getUsers } from '@/composables/getUsers';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_ROOT = import.meta.env.VITE_API_ROOT;

const userDetail = ref([]);
const searchQuery = ref(''); // ค่าค้นหา
const roleFilter = ref(''); // ค่า filter role

onMounted(async () => {
  const users = await getUsers();
  userDetail.value = users;
  // console.log('ข้อมูล user', userDetail.value);
});

// ฟังก์ชันกรองผู้ใช้จาก Search + Role Filter
const filteredUsers = computed(() => {
  return userDetail.value.filter((user) => {
    const query = searchQuery.value.toLowerCase();
    const role = roleFilter.value;

    const matchesSearch =
      user.username.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);

    const matchesRole = role ? user.role === role : true;

    return matchesSearch && matchesRole;
  });
});

const deleteUser = async (userId) => {
  const confirmed = window.confirm(
    'โปรดยืนยันการลบข้อมูลนี้ เนื่องจากการลบไม่สามารถย้อนกลับได้'
  );
  if (confirmed) {
    try {
      const res = await fetch(`${API_ROOT}/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        method: 'DELETE',
      });

      if (res.ok) {
        userDetail.value = userDetail.value.filter((user) => user.userId !== userId);
      } else {
        if (res.status === 401) {
          alert('Access Denied!');
        } else if (res.status === 403) {
          alert('You cannot delete your own account.');
        } else {
          alert(`User ID ${userId} not found.`);
        }
        throw new Error('Cannot delete user!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    router.push({ name: 'AdminUserView' });
  }
};

const editUser = (userId) => {
  router.push({
    name: 'AdminEditUser',
    params: { id: userId },
  });
};
</script>

<template>
  <div class="px-40 py-10 flex flex-col bg-gray-100 min-h-screen">
    <div class="w-full flex justify-center text-4xl font-bold text-gray-800 mb-8 mt-3">
      <img class="h-12 mr-3" src="../../../components/icons/user.png" />
      <h1>User Management</h1>
    </div>

    <div class="w-full flex justify-between items-center mb-6">
      <h3 class="text-2xl font-semibold text-gray-700">
        Date/Time shown in Timezone:
        <span class="text-green-700">{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}</span>
      </h3>
      <div class="flex flex-row space-x-2">
        <SearchComponent v-model:search="searchQuery" placeholder="ค้นหาผู้ใช้..." />
        
        <!-- Dropdown สำหรับ Role Filter -->
        <select v-model="roleFilter" class="border rounded-lg px-4 py-2 bg-white shadow">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <router-link to="/admin/add-edit-user">
          <button class="bg-green-500 hover:bg-green-700 text-white text-lg font-semibold px-6 py-2 rounded-lg shadow-lg flex items-center transition duration-200">
            <img class="h-6 mr-2" src="../../../components/icons/plus3.png" alt="user" /> Add User
          </button>
        </router-link>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-blue-500 text-white">
            <th class="p-3">ID</th>
            <th class="p-3">Username</th>
            <th class="p-3">Name</th>
            <th class="p-3">Email</th>
            <th class="p-3">Role</th>
            <th class="p-3">Created On</th>
            <th class="p-3">Updated On</th>
            <th class="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.userId" class="border-b hover:bg-gray-100">
            <td class="p-3">{{ user.userId }}</td>
            <td class="p-3">{{ user.username }}</td>
            <td class="p-3">{{ user.name }}</td>
            <td class="p-3">{{ user.email }}</td>
            <td class="p-3">{{ user.role }}</td>
            <td class="p-3">{{ user.createdOn ? formatDate(user.createdOn) : '-' }}</td>
            <td class="p-3">{{ user.updatedOn ? formatDate(user.updatedOn) : '-' }}</td>
            <td class="p-3 flex justify-center space-x-3">
              <button @click="editUser(user.userId)" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                Edit
              </button>
              <button @click="deleteUser(user.userId)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
}
th, td {
  padding: 12px;
  text-align: left;
}
th {
  background-color: #f16d2b;
  color: white;
}
tbody tr:nth-child(even) {
  background-color: #F3F4F6;
}
tbody tr:hover {
  background-color: #E5E7EB;
}
</style>
