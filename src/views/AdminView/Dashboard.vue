<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
import { useAuthorize } from '@/stores/authorize';
import { storeToRefs } from 'pinia';
import EditIcon from '@/components/icons/EditIcon.vue';
import EditUserIcon from '@/components/icons/EditUserIcon.vue';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels);

const myRole = useAuthorize()
const {userRole} = storeToRefs(myRole)
const API_ROOT = import.meta.env.VITE_API_ROOT

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const router = useRouter()

// สถิติ
const totalDorms = ref(0)
const totalUsers = ref(50)
const activeUsers = ref(0)
const isLoading = ref(true)
const errorMessage = ref('')

// เพิ่มค่า offline users
const offlineUsers = ref(0)

const fetchStats = async () => {
  isLoading.value = true
  try {
    const response = await fetch(API_ROOT + '/auth/active-users')
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    const data = await response.json()
    totalDorms.value = data.totalDormitories
    activeUsers.value = data.activeUserCount
    totalUsers.value = 10
    offlineUsers.value = totalUsers.value - activeUsers.value // คำนวณ offline users

    // อัปเดตข้อมูลกราฟ
    chartData.value.datasets[0].data = [activeUsers.value, offlineUsers.value]
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

// อัปเดต labels และสีใน Pie Chart
const chartData = ref({
  labels: ['Active Users', 'Offline Users'], // เพิ่ม Offline Users
  datasets: [
    {
      label: 'จำนวน',
      data: [0, 0, 0], // เริ่มต้นด้วยค่า 0
      backgroundColor: ['#38c172', '#C8C8C8'], // เพิ่มสีแดงให้ offline users
      hoverOffset: 4
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'สถิติระบบ'
    },
    legend: {
      position: 'top',
    },
    datalabels: {
      formatter: (value, ctx) => {
        let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        let percentage = ((value / sum) * 100).toFixed(2) + "%";
        return percentage;
      },
      color: '#fff',
      font: {
        weight: 'bold'
      }
    }
  }
});


// ไปยังหน้าจัดการหอพัก
const goToDormManagement = () => {
  router.push('/admin/dormitory-management')
}

// ไปยังหน้าจัดการผู้ใช้
const goToUserManagement = () => {
  router.push('/admin/user-management')
}

// โหลดข้อมูลตอนเปิดหน้า
onMounted(async () => {
  if (userRole.value !== 'admin') {
    alert('Access Denied')
    router.push({name:'home'})
  }
  await fetchStats()
})
</script>

<template>
      <!-- 🏡 แสดงกราฟ -->
    <div class="bg-white p-6">
      <!-- Check if data exists before rendering chart -->
      <div v-if="!isLoading" class="h-72 flex flex-col items-center justify-center">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
    </div>

  <div class="py-5 px-72">
    <!-- 🏡 การ์ดสถิติระบบ -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center w-full">
        <h2 class="text-xl font-semibold">หอพักทั้งหมด</h2>
        <p class="text-3xl font-bold">{{ totalDorms }}</p>
      </div>
      <div class="bg-green-500 text-white p-4 rounded-lg shadow-md text-center w-full">
        <h2 class="text-xl font-semibold">Active Users</h2>
        <p class="text-3xl font-bold">{{ activeUsers }}</p>
      </div>
      <div class="bg-yellow-500 text-white p-4 rounded-lg shadow-md text-center w-full">
        <h2 class="text-xl font-semibold">ผู้ใช้ทั้งหมด</h2>
        <p class="text-3xl font-bold">{{ totalUsers }}</p>
      </div>
    </div>

<!-- การ์ดจัดการหอพัก และ การ์ดจัดการผู้ใช้ -->
<div class="flex flex-row items-center justify-between h-52 space-x-4 hover:cursor-pointer">
  <!-- 🏡 การ์ดจัดการหอพัก -->
  <div @click="goToDormManagement" class="w-1/2 h-full bg-white p-6 rounded-lg shadow-md flex justify-between items-center bg-dorm-management">
    <div class="w-full h-full flex flex-col items-start justify-center">
      <h2 class="text-2xl font-semibold mb-3 text-white">จัดการหอพัก</h2>
      <p class="text-white">ดูและจัดการหอพักทั้งหมด</p>
    </div>
    <div class="w-full h-full flex flex-col items-end justify-center">
      <EditIcon/>
    </div>
  </div>

  <!-- 👤 การ์ดจัดการผู้ใช้ -->
  <div @click="goToUserManagement" class="w-1/2 h-full bg-white p-6 rounded-lg shadow-md flex justify-between items-center bg-user-management">
    <div class="w-full h-full flex flex-col items-start justify-center">
      <h2 class="text-2xl font-semibold mb-3 text-white">จัดการผู้ใช้</h2>
      <p class="text-white">ดูและจัดการผู้ใช้ในระบบ</p>
    </div>
    <div class="w-full h-full flex flex-col items-end justify-center">
      <EditUserIcon/>
    </div>
  </div>
</div>

      
    <!-- Loading spinner -->
    <div v-if="isLoading" class="text-center mt-4">กำลังโหลด...</div>
  </div>
</template>

<style scoped>
/* เพิ่มสไตล์ hover ให้ปุ่ม */
.bg-blue-500:hover, .bg-green-500:hover, .bg-yellow-500:hover, .bg-red-500:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.bg-dorm-management:hover,.bg-user-management:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

.bg-dorm-management {
  background-image: linear-gradient(to right, #e65100, #f57c00, #fb8c00);
}
.bg-user-management {
  background-image: linear-gradient(to right, #1565c0, #0d47a1, #0d47a1);
}


/* เพิ่มสีสันให้ข้อความในการ์ด */
.text-white {
  color: white;
}

.text-gray-200 {
  color: #e5e5e5;
}
</style>

