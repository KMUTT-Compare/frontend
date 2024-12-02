import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { getDormitories } from '@/composables/getDormitories'; // ปรับ path ให้ตรงกับโปรเจกต์ของคุณ

export const useDormitoryStore = defineStore('dormitory', () => {
  const mainDormitory = ref(null);
  const secondaryDormitory = ref(null);
  const dormitories = ref([]); // เก็บข้อมูลหอพักทั้งหมดที่ได้จาก API

  // ดึงข้อมูลหอพักเมื่อเริ่มต้น
  onMounted(async () => {
    try {
      dormitories.value = await getDormitories();
      if (dormitories.value.length === 0) {
        console.warn('No dormitories found.');
      } else {
        // console.log('Dormitories data:', dormitories.value);
      }
    } catch (error) {
      console.error('Error fetching dormitories:', error);
    }
  });
  

  // ตั้งหอพักหลัก
  const setMainDormitory = (dormId) => {
    if (secondaryDormitory.value === dormId) {
      secondaryDormitory.value = null; // ลบหอพักรองถ้าซ้ำกับหอพักหลัก
    }
    mainDormitory.value = dormId;
  };

  // ตั้งหอพักรอง
  const setSecondaryDormitory = (dormId) => {
    if (mainDormitory.value === dormId) {
      mainDormitory.value = null; // ลบหอพักหลักถ้าซ้ำกับหอพักรอง
    }
    secondaryDormitory.value = dormId;
  };

  // ค่าของหอพักหลัก
  const mainDormitoryData = computed(() => {
    if (mainDormitory.value) {
      return dormitories.value.find(dorm => dorm.dormId === mainDormitory.value) || null;
    }
    return null;
  });

  // ค่าของหอพักรอง
  const secondaryDormitoryData = computed(() => {
    if (secondaryDormitory.value) {
      return dormitories.value.find(dorm => dorm.dormId === secondaryDormitory.value) || null;
    }
    return null;
  });

  return {
    mainDormitory,
    secondaryDormitory,
    dormitories,
    setMainDormitory,
    setSecondaryDormitory,
    mainDormitoryData,
    secondaryDormitoryData,
  };
});
