import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, watch } from 'vue';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import for v4.0.0

export const useAuthorize = defineStore('authorize', () => {
  const userRole = ref(localStorage.getItem("userRole") || 'admin');


  const setRole = (role) => {
    if (role === null) {
      userRole.value = 'guest';
      localStorage.setItem("userRole", 'guest');
    } else {
      const decodedRole = jwtDecode(role).role; // ✅ Use correct function name
      userRole.value = decodedRole;
      localStorage.setItem("userRole", decodedRole);
    }
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
