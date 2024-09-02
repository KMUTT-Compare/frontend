import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as jwtDecode from 'jwt-decode'; // ใช้ named import ถ้าการนำเข้าต้องเปลี่ยนแปลง

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('jwtToken') || '');
  // const role = ref(localStorage.getItem('userRole') || '');
  const role = ref('admin')
  // const isAuthenticated = ref(!!localStorage.getItem('jwtToken'));
  const isAuthenticated = ref(false)
  const loginError = ref('');

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ROOT}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const { token: newToken } = data;

      localStorage.setItem('jwtToken', newToken);
      token.value = newToken;
      role.value = decodeTokenRole(newToken); // Update role based on token
      isAuthenticated.value = true;
      loginError.value = '';

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      loginError.value = error.message;
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    token.value = '';
    role.value = 'guest';
    isAuthenticated.value = false;
  };

  const decodeTokenRole = (token) => {
    try {
      const decoded = jwtDecode.default(token); // ใช้ jwtDecode.default() ถ้า import * as jwtDecode
      return decoded.role || ''; // Adjust according to your token payload
    } catch (error) {
      console.error('Token decoding error:', error);
      return '';
    }
  };

  return {
    token,
    role,
    isAuthenticated,
    loginError,
    login,
    logout,
    decodeTokenRole
  };
});
