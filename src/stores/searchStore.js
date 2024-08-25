import { defineStore } from 'pinia';
import {ref} from 'vue'

export const useSearchStore = defineStore('search', () => {
  // State
  const searchQuery = ref('');

  // Actions
  function setSearchQuery(query) {
    searchQuery.value = query;
    console.log(searchQuery.value)
  }


  // Getters
  function filteredDormitories(dormitories) {
    return dormitories.filter(dorm =>
      dorm.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredDormitories
  };
});