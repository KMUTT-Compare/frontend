const API_ROOT = import.meta.env.VITE_API_ROOT

// ฟังก์ชันสำหรับดึงข้อมูลหอพักตาม id
const getDormitoryById = async (id) => {
  try {
    const res = await fetch(`${API_ROOT}/dormitories/${id}`); // URL สำหรับดึงข้อมูลหอพักโดยใช้ id
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error('Failed to fetch dormitory');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export { getDormitoryById };