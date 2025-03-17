const API_ROOT = import.meta.env.VITE_API_ROOT;
import { getNewToken } from "./Authentication/getNewToken";

// ฟังก์ชันสำหรับดึงข้อมูล
const getUsers = async () => {
  try {
    let res = await fetch(`${API_ROOT}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + localStorage.getItem('token')
      }
    });

    if (res.ok) {
      return await res.json();
    }

    if (res.status === 401) {
      await getNewToken(); // รีเฟรช token

      // ดึง token ใหม่จาก localStorage หลังจากรีเฟรช
      const newToken = localStorage.getItem('token');  

      res = await fetch(`${API_ROOT}/users`, {  // 🔥 เรียก /users ใหม่ ไม่ใช่ /favorites
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + newToken
        }
      });

      if (res.ok) {
        return await res.json();
      }
    }

    console.error(`Error fetching users: ${res.status}`);
    return []; 
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export { getUsers };
