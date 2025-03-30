import { clearAllToken, clearToken } from './clearToken.js';
const API_ROOT = import.meta.env.VITE_API_ROOT;
import { useUIStore } from '@/stores/uiStore';
const uiStore = useUIStore();

const getNewToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      clearAllToken();
      alert('Please login.');
      uiStore.openLoginPopup();
      return;
    }

    const res = await fetch(`${API_ROOT}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      const newToken = data.accessToken;
      localStorage.setItem('token', newToken);
      console.log('Token refreshed successfully:', newToken);
    } else {
      clearAllToken();
      alert('Please login.');
      uiStore.openLoginPopup();
    }
  } catch (err) {
    console.error('An error occurred while refreshing the token', err);
    throw new Error(err);
  }
};

export { getNewToken };
