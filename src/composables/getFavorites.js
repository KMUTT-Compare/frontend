const API_ROOT = import.meta.env.VITE_API_ROOT

// ฟังก์ชันสำหรับดึงข้อมูล
const getFavorites = async () => {
  try {
    const res = await fetch(`${API_ROOT}/favorites`);
    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    return data.length > 0 ? data : []; 
  } catch (error) {
    console.error('Error fetching dormitories:', error);
    return []; // Return empty array on error
  }
};


export { getFavorites }