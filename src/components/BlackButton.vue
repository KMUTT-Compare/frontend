<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  context: {
    type: String,
    required: true
  }
});
</script>
 
<template>
  <button>{{ context }}</button>
</template>
 
<style scoped>
button {
  background-color: rgb(0, 0, 0);
  border: 1px solid #000000;
  color: white;
  max-width: 10rem; /* กำหนดความกว้างสูงสุด */
  height: 2.5rem; /* สูงคงที่ */
  font-size: 1rem; /* ขนาดฟอนต์เริ่มต้น */
  padding: 0.5rem; /* ลดการเว้นระยะภายใน */
  display: flex; /* ทำให้เป็น flex container */
  justify-content: center; /* จัดกึ่งกลางในแนวนอน */
  align-items: center; /* จัดกึ่งกลางในแนวตั้ง */
  text-align: center; /* จัดกึ่งกลางข้อความ */
  border-radius: 0.5rem; /* มุมโค้งมน */
  transition: background-color 0.3s, transform 0.3s; /* เพิ่มการเปลี่ยนแปลงที่นุ่มนวล */
}

/* Responsive styles */
@media (max-width: 768px) {
  button {
    font-size: 0.875rem; /* ขนาดฟอนต์เล็กลงสำหรับหน้าจอเล็ก */
    padding: 0.4rem; /* ลดการเว้นระยะภายใน */
  }
}

@media (min-width: 1024px) {
  button {
    font-size: 1rem; /* ขนาดฟอนต์สำหรับหน้าจอใหญ่ */
    width: 100%; /* เพิ่มความกว้างของปุ่มเป็น 70% */
    max-width: 20rem; /* กำหนดความกว้างสูงสุด */
    height: 3rem;
  }
}

button:hover {
  transform: scale(1.05);
}
</style>
