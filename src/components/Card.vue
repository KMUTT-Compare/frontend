<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  dormitoryName: {
    type: String,
    required: false // ทำให้ไม่จำเป็นต้องส่งค่า
  },
  distance:{
    type: Number,
    required: true
  },
  address:{
    type: String,
    required: true
  },
});
</script>
 
<template>
<div class="card bg-base-100 shadow-xl">
  <div class="text-xl text-center font-semibold bg-black text-white">{{title}}</div>
  <figure class="relative">
    <img
      src="https://cdn.pixabay.com/photo/2017/08/28/17/07/model-2690432_960_720.jpg"
      alt="Shoes" />
    <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white">
      <span class="text-xl font-bold">{{ dormitoryName || 'ยังไม่ได้เลือก' }}</span>
    </div>
  </figure>
  <div class="p-4">
      <h3 class="card-title text-xl">ระยะทาง :<span class="text-orange-500">{{ distance }}</span></h3>
      <h3 class="card-title text-base"><span class="text-zinc-500">{{ address }}</span></h3>
  </div>
</div>

</template>
 
<style scoped>

@media (min-width: 768px) {
.card {
    width: 15rem;
    height: 22rem;
}
}

/* สำหรับหน้าจอขนาดใหญ่ (เช่น Desktop) */
@media (min-width: 1024px) {
.card {
    width: 18rem;
    height: 22rem;
}
}
</style>