<template>
    <div class="p-32">
      <!-- 🏡 การ์ดสถิติระบบ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center">
          <h2 class="text-xl font-semibold">หอพักทั้งหมด</h2>
          <p class="text-3xl font-bold">{{ totalDorms }}</p>
        </div>
        <div class="bg-green-500 text-white p-4 rounded-lg shadow-md text-center">
          <h2 class="text-xl font-semibold">ผู้ใช้ทั้งหมด</h2>
          <p class="text-3xl font-bold">{{ totalUsers }}</p>
        </div>
        <div class="bg-yellow-500 text-white p-4 rounded-lg shadow-md text-center">
          <h2 class="text-xl font-semibold">Active Users</h2>
          <p class="text-3xl font-bold">{{ activeUsers }}</p>
        </div>
      </div>
  
      <!-- 🏡 จัดการหอพัก -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-semibold">จัดการหอพัก</h2>
        <button @click="goToDormManagement" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
          จัดการหอพัก
        </button>
      </div>
  
      <!-- 👤 จัดการผู้ใช้ -->
      <div class="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <h2 class="text-2xl font-semibold">จัดการผู้ใช้</h2>
        <button @click="goToUserManagement" class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          จัดการผู้ใช้
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // สถิติ
  const totalDorms = ref(0)
  const totalUsers = ref(0)
  const activeUsers = ref(0)
  
  // ดึงข้อมูลสถิติระบบ
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats')
      const data = await response.json()
      totalDorms.value = data.totalDormitories
      totalUsers.value = data.totalUsers
      activeUsers.value = data.activeUsers
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }
  
  // ไปยังหน้าจัดการหอพัก
  const goToDormManagement = () => {
    router.push('/admin/dormitory-management')
  }
  
  // ไปยังหน้าจัดการผู้ใช้
  const goToUserManagement = () => {
    router.push('/admin/user-management')
  }
  
  // โหลดข้อมูลตอนเปิดหน้า
  onMounted(async() => {
    if(userRole.value !== 'admin'){
    alert('Access Deny')
    router.back()
  }
    await fetchStats()
  })
  </script>
  
  <style scoped>
  </style>
  