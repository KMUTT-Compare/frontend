// stores/favoritesStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
const API_ROOT = import.meta.env.VITE_API_ROOT
export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteDorms = ref([]);

  // ฟังก์ชันตรวจสอบว่าหอพักถูก Favorite หรือไม่
  function isFavorite(dormId) {
    return favoriteDorms.value.includes(dormId);
  }

  // ฟังก์ชัน POST สำหรับเพิ่ม Favorite
  async function addFavorite(dormId) {
    const favoriteObj = {
      userId: 2, // แก้ให้เชื่อมต่อกับข้อมูล user จริง
      dormId,
    };
    try {
      const response = await fetch(`${API_ROOT}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favoriteObj),
      });

      if (!response.ok) {
        throw new Error(`Failed to add favorite: ${response.statusText}`);
      }

      console.log(`Added dorm ${dormId} to favorites.`);

      favoriteDorms.value.push(dormId);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  // ฟังก์ชัน DELETE สำหรับลบ Favorite
  async function removeFavorite(dormId) {
    try {
      const response = await fetch(`${API_ROOT}/favorites/${dormId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to remove favorite: ${response.statusText}`);
      }

      console.log(`Removed dorm ${dormId} from favorites.`);
      favoriteDorms.value = favoriteDorms.value.filter(id => id !== dormId);
    } catch (error) {
      console.error(error.message);
    }
  }

  // ฟังก์ชันสำหรับสลับสถานะ Favorite
  async function toggleFavorite(dormId) {
    if (isFavorite(dormId)) {
      await removeFavorite(dormId);
    } else {
      await addFavorite(dormId);
    }
  }

  return {
    favoriteDorms,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
});
