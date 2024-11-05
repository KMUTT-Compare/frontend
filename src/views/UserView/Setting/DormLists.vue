<script setup>
import Sidebar from '@/components/Sidebar.vue';

// const API_ROOT = import.meta.env.VITE_API_ROOT
// const dormitories = ref([])

// onMounted(async () => {
//    await getDormitories();
// })

// const getDormitories = async () => {
//   try {
//     const res = await fetch(`${API_ROOT}/dormitories`); // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง
//     if (res.ok) {
//       dormitories.value = await res.json();
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// }

</script>
 
<template>
<div class="flex flex row w-full justify-center p-20">
    <Sidebar/>
    <div class="pl-2 w-1/2 h-full">
        <!-- <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <h1>รายการประกาศ</h1>
            <div class="flex w-full cursor-pointer" @click="showDetail(dorm.id)">
              <div class="item">
                <h1>{{ dorm.name }}</h1>
                <h2>{{ dorm.min_price }} - {{ dorm.max_price }} <span>บาท/เดือน</span></h2>
                <p>Location: {{ dorm.location }}</p>
              </div>
            </div>
        </div> -->
        
    </div>
</div>
</template>
 
<style scoped>
h1{
    font-size: 1.8rem;
}
h2{
    font-size: 1.4rem;
}
span{
   font-size: 1.2rem;
}
</style>