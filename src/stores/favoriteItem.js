import { defineStore } from 'pinia';
import { ref } from 'vue';
const API_ROOT = import.meta.env.VITE_API_ROOT// Your API endpoint

export const useFavoriteItem = defineStore('dorm', () => {
  const dormitories = ref([]);

  // Function to fetch dormitories
  const fetchDormitories = async () => {
    try {
      const response = await fetch(`${API_ROOT}/dormitories`);
      if (!response.ok) {
        throw new Error('Failed to fetch dormitories');
      }
      dormitories.value = await response.json();
    } catch (error) {
      console.error('Error fetching dormitories:', error);
    }
  };

  // Internal function to update favorite status
  const updateFavoriteStatus = async (id, isFavorite) => {
    try {
      const response = await fetch(`${API_ROOT}/dormitories/${id}`, {
        method: 'PATCH', // Use PATCH to update partial data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite: isFavorite }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating favorite status:', error);
      throw error; // Re-throw the error if needed
    }
  };

  // Action to toggle the favorite status of a dormitory
  const toggleFavorite = async (id) => {
    const dormitory = dormitories.value.find(d => d.id === id);
    if (dormitory) {
      dormitory.favorite = !dormitory.favorite;
      try {
        await updateFavoriteStatus(id, dormitory.favorite);
      } catch (error) {
        console.error('Error updating favorite status:', error);
        // Revert change if API call fails
        dormitory.favorite = !dormitory.favorite;
      }
    }
  };

  fetchDormitories();

  return {
    dormitories,
    toggleFavorite,
  };
});
