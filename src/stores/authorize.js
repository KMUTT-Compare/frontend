import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, watch } from 'vue';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import for v4.0.0

export const useAuthorize = defineStore('authorize', () => {
  const userRole = ref(localStorage.getItem("userRole") || 'guest');
  const username = ref(localStorage.getItem("username") || 'unknown');

  const setRole = (token) => {
    if (!token) {  // ตรวจสอบว่า token เป็น null, undefined, หรือ empty string
      userRole.value = 'guest';
      username.value = 'unknown';
      localStorage.setItem("userRole", 'guest');
      localStorage.setItem("username", 'unknown');
      console.log("No token provided, setting userRole to guest");
      return;
    }

    // ถ้ามี token ให้ decode token เพื่อดึง role และ username
    const decoded = jwtDecode(token);
    userRole.value = 'admin'  //decoded.role;  // ใช้ decoded.role แทน 'admin'
    username.value = decoded.sub;

    localStorage.setItem("userRole", 'admin');  // เก็บ role ที่ถูกต้องใน localStorage
    localStorage.setItem("username", decoded.sub);

    console.log("Role:", userRole.value);
    console.log("Username:", username.value);
  };

  // ตรวจจับการเปลี่ยนแปลงใน localStorage และอัปเดตค่า userRole และ username
  watch(() => localStorage.getItem("userRole"), (newValue) => {
    if (newValue !== userRole.value) {
      userRole.value = newValue;
    }
  });

  watch(() => localStorage.getItem("username"), (newValue) => {
    if (newValue !== username.value) {
      username.value = newValue;
    }
  });

  return { userRole, setRole, username };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthorize, import.meta.hot));
}
