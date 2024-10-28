<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  context:{
    type: String,
    required: true
  },
  dormitoryName: {
    type: String,
    required: false // ทำให้ไม่จำเป็นต้องส่งค่า
  }
});
</script>
 
<template>
<div class="card bg-base-100 shadow-xl">
  <figure>
    <img
      src="https://cdn.pixabay.com/photo/2017/08/28/17/07/model-2690432_960_720.jpg"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title text-xl">{{title}} <span class="text-orange-500">{{ dormitoryName || 'ยังไม่ได้เลือก' }}</span></h2>
    <p>{{ context }}</p>
  </div>
</div>
</template>
 
<style scoped>

@media (min-width: 768px) {
.card {
    width: 15rem;
    height: 15rem;
}
}

/* สำหรับหน้าจอขนาดใหญ่ (เช่น Desktop) */
@media (min-width: 1024px) {
.card {
    width: 18rem;
    height: 18rem;
}
}
</style>