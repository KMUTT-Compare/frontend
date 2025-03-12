const API_ROOT = import.meta.env.VITE_API_ROOT
import { getNewToken } from "./Authentication/getNewToken";

// ฟังก์ชันสำหรับดึงข้อมูล
const getFavorites = async () => {
  try {
    let res = await fetch(`${API_ROOT}/favorites`, {
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
      res = await fetch(`${API_ROOT}/favorites`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + localStorage.getItem('token')
        }
      });

      if (res.ok) {
        return await res.json();
      }
    }

    console.error(`Error fetching favorites: ${res.status}`);
    return []; 
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};






export { getFavorites }