import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, watch } from 'vue';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import for v4.0.0

export const useAuthorize = defineStore('authorize', () => {
  const userRole = ref(localStorage.getItem("userRole") || 'guest');


  const setRole = (role) => {
    if (!role) {  // ตรวจสอบว่า token เป็น null, undefined, หรือ empty string
      userRole.value = 'guest';
      localStorage.setItem("userRole", 'guest');
      console.log("No token provided, setting userRole to guest");
      return;
    }
    // ถ้ามี token ให้ decode token เพื่อดึง role
    const decodedRole = jwtDecode(role).role;
    userRole.value = decodedRole;
    localStorage.setItem("userRole", decodedRole);
    console.log("Decoded token:", jwtDecode(role));
  };
  

  // ตรวจจับการเปลี่ยนแปลงใน localStorage และอัปเดตค่า userRole
  watch(() => localStorage.getItem("userRole"), (newValue) => {
    if (newValue !== userRole.value) {
      userRole.value = newValue;
    }
  });

  return { userRole, setRole };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthorize, import.meta.hot));
}
