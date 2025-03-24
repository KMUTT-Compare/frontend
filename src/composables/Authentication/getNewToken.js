import { clearToken } from './clearToken.js'
const API_ROOT = import.meta.env.VITE_API_ROOT
import { useUIStore } from '@/stores/uiStore';
const uiStore = useUIStore();

const getNewToken = async () => {

    try {
      const res = await fetch(`${API_ROOT}/token`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('refreshToken')
        }
      });
  
      if (res.ok) {
        const data = await res.json();
        const newToken = data.token;
        // บันทึก token ใหม่ใน localStorage
        localStorage.setItem('token', newToken);
        // console.log('Token refreshed successfully');
      }else{
        clearToken()
        alert('Please login.')
        uiStore.openLoginPopup();
      }
    } catch (err) {
      console.error('An error occurred while refreshing the token', err);
      throw new Error(err);
    }
  };



export { getNewToken }