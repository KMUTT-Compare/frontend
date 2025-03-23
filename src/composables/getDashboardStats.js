import { ref, onMounted } from 'vue'

// ฟังก์ชันสำหรับดึงข้อมูล Dashboard (เฉพาะ Admin)
export function getDashboardStats(API_ROOT) {
  const totalDorms = ref(0)
  const totalUsers = ref(0)
  const activeUsers = ref(0)
  const offlineUsers = ref(0)
  const isLoading = ref(true)
  const errorMessage = ref('')

  const fetchStats = async () => {
    isLoading.value = true
    try {
      const response = await fetch(`${API_ROOT}/admin/dashboard`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + localStorage.getItem('token')
        }
      }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      
      totalDorms.value = data.count_dormitories
      activeUsers.value = data.active_users
      totalUsers.value = data.count_users
      offlineUsers.value = totalUsers.value - activeUsers.value // คำนวณ offline users
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchStats)

  return { totalDorms, totalUsers, activeUsers, offlineUsers, isLoading, errorMessage }
}
