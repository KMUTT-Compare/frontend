<script setup>
import { ref, onMounted } from 'vue'
import { useAuthorize } from '@/stores/authorize';
import { storeToRefs } from 'pinia';
import { formatDate } from '@/composables/formatDate';
import { useRouter } from 'vue-router'
const API_ROOT = import.meta.env.VITE_API_ROOT
const router = useRouter()

const myRole = useAuthorize()
const { userRole } = storeToRefs(myRole)
const dormitories = ref([])

onMounted(async () => {
  if (userRole.value !== 'admin') {
    alert('Access Deny')
    router.back()
  }

  dormitories.value = await loadData()
  console.log(dormitories.value)

})

const loadData = async () => {
  
  try {
    const res = await fetch(API_ROOT + "/dormitories", {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('token')
      }
    });

    if (res.ok) {
      dormitories.value = await res.json();

    }else {
      if (res.status === 401) {
        try {
          await getNewToken();
          const newRes = await fetch(API_ROOT + "/dormitories", {
            headers: {
              'Authorization': "Bearer " + localStorage.getItem('token')
            }
          });

          if (newRes.ok) {
            dormitories.value = await newRes.json();
          }

        } catch (error) {
          // console.error('Failed to get new token:', error);
        }

      }
    }

  } catch (error) {
    console.error('error ', error);
  }
}


// ลบหอพัก พร้อม Authentication
const deleteDormitory = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหอพักนี้?')) return;

  try {
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage
    const res = await fetch(`${API_ROOT}/dormitories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    if (res.ok) {
      dormitories.value = dormitories.value.filter(d => d.id !== id);
      alert('ลบหอพักสำเร็จ!');
    } else if (res.status === 401) {
      // ถ้า token หมดอายุหรือไม่ได้รับอนุญาต คุณอาจทำการ refresh token แล้ว retry
      alert('ไม่สามารถลบได้ เนื่องจากไม่ได้รับอนุญาต');
    } else {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  } catch (error) {
    console.error('Error deleting dormitory:', error);
    alert('เกิดข้อผิดพลาดในการลบหอพัก');
  }
}



const editDormitory = (dormitoryId) => {
  router.push({
    name: 'addEditDormitory',
    params: { id: dormitoryId }
  });
};

</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-semibold mb-6 text-gray-800">จัดการหอพัก</h1>
    
    <div class="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
      <table class="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100 text-gray-700">
            <th class="p-3 text-left border">#</th>
            <th class="p-3 text-left border">ชื่อหอพัก</th>
            <th class="p-3 text-left border">คะแนน</th>
            <th class="p-3 text-left border">UID เจ้าของหอพัก</th>
            <th class="p-3 text-left border">วันที่ลงประกาศ</th>
            <th class="p-3 text-left border">อัปเดตล่าสุด</th>
            <th class="p-3 text-left border">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dorm, index) in dormitories" :key="dorm.id" class="hover:bg-gray-50 transition duration-200">
            <td class="p-3 border">{{ index + 1 }}</td>
            <td class="p-3 border">{{ dorm.dormName }}</td>
            <td class="p-3 border">{{ dorm.score }}</td>
            <td class="p-3 border">{{ dorm.staffId }}</td>
            <td class="p-3 border">{{ formatDate(dorm.created_at) }}</td>
            <td class="p-3 border">{{ formatDate(dorm.updated_at) }}</td>
            <td class="p-3 border flex gap-2">
              <button @click="deleteDormitory(dorm.dormId)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all">
                ลบ
              </button>
              <button @click="editDormitory(dorm.dormId)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
                แก้ไข
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}
</style>
