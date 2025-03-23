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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');

      const data = await response.json();
      submittedForms.value = data; // เก็บข้อมูลลงใน reactive variable
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
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
