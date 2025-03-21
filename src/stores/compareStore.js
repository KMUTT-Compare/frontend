// stores/compareStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompareStore = defineStore('compare', () => {
  const compareItems = ref([]);

 // ฟังก์ชัน addDormToCompare
 const addDormToCompare = (id, dormitories) => {
  // ค้นหาหอพักที่มี dormId ตรงกับที่เลือก
  const dormToAdd = dormitories.find(dorm => dorm.dormId === id);
  if (!dormToAdd) {
    console.log('Dorm not found');
    return;
  }

  // เช็คว่ามี dormId นี้อยู่ใน compareItems หรือยัง
  const isAlreadyAdded = compareItems.value.some(dorm => dorm.dormId === id);

  if (isAlreadyAdded) {
    console.log('This dorm has already been added to the comparison.');
    return;
  }

  // เช็คว่ามีหอพักใน compareItems ถึง 2 ตัวแล้วหรือไม่
  if (compareItems.value.length >= 2) {
    alert('คุณสามารถเปรียบเทียบได้แค่สองหอพัก.');
    return;
  }

  // เพิ่มหอพักเข้า compareItems
  compareItems.value.push(dormToAdd);
  console.log(compareItems.value);
};


 // ฟังก์ชัน addDormToCompare
 const addDormDetailToCompare = (id, dormToAdd) => {
  const isAlreadyAdded = compareItems.value.some(dorm => dorm.dormId === id);

  if (isAlreadyAdded) {
    console.log('This dorm has already been added to the comparison.');
    return;
  }

  if (compareItems.value.length >= 2) {
    alert('คุณสามารถเปรียบเทียบได้แค่สองหอพัก.');
    return;
  }

  compareItems.value.push(dormToAdd);
  console.log(compareItems.value);
};


// ลบหอพักออกจาก compareItems
const removeDormFromCompare = (index) => {
  compareItems.value.splice(index, 1);
};

// เคลียร์ compareItems
const clearCompareItems = () => {
  compareItems.value = [];
};

  return {
    compareItems,
    addDormToCompare,
    addDormDetailToCompare,
    removeDormFromCompare,
    clearCompareItems
  };
});
