const API_ROOT = import.meta.env.VITE_API_ROOT

// ฟังก์ชันสำหรับดึงข้อมูล
const getDormitories = async () => {
    try {
      const res = await fetch(`${API_ROOT}/dormitories`);
      if (res.ok) {
        const data = await res.json();
        return data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  

export { getDormitories }

