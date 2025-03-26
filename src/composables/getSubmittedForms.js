import { ref } from 'vue';
const API_ROOT = import.meta.env.VITE_API_ROOT;

export const useSubmittedForms = () => {
  const isLoading = ref(true);
  const submittedForms = ref([]);

  const fetchSubmittedForms = async () => {
    try {
      const response = await fetch(`${API_ROOT}/forms/user`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // ถ้าสถานะเป็น 401, รีเฟรช token และลองใหม่
      if (response.status === 401) {
        await getNewToken(); // รีเฟรช token ใหม่
        response = await fetch(`${API_ROOT}/forms/user`, {  // 🔥 ใช้ endpoint เดิม
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });
      }

      // ตรวจสอบว่าการตอบกลับจาก API ถูกต้องหรือไม่
      if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');

      const data = await response.json();

      // ถ้าไม่มีข้อมูลให้ตั้งค่าเป็น [] (array ว่าง)
      if (data && Array.isArray(data) && data.length > 0) {
        submittedForms.value = data; // เก็บข้อมูลลงใน reactive variable
      } else {
        submittedForms.value = []; // กรณีไม่มีข้อมูล
      }
    } catch (error) {
      // console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
      submittedForms.value = []; // กรณีเกิดข้อผิดพลาดในการดึงข้อมูล
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    submittedForms,
    fetchSubmittedForms
  };
};
