import { getNewToken } from "@/composables/Authentication/getNewToken";
const API_ROOT = import.meta.env.VITE_API_ROOT;

// ฟังก์ชันสำหรับดึงข้อมูล dormitories ของ user โดยใช้ userId ในระบบ
export const getUserDormByUserId = async (userId) => {
  if (!userId) return []; // ถ้าไม่มี userId ให้คืนค่า []

  try {
    let res = await fetch(`${API_ROOT}/dormitories/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (res.ok) {
      return await res.json();
    }

    if (res.status === 401) {
      await getNewToken(); // รีเฟรช token
      res = await fetch(`${API_ROOT}/dormitories/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (res.ok) {
        return await res.json();
      }
    }

    console.error(`Error fetching user dormitories (ID: ${userId}): ${res.status}`);
    return []; // คืนค่า [] แทน null
  } catch (error) {
    console.error("Error:", error);
    return []; // คืนค่า [] ในกรณีที่เกิดข้อผิดพลาด
  }
};

