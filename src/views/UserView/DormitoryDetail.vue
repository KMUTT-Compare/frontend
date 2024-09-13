<script setup>
import {ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
const API_ROOT = import.meta.env.VITE_API_ROOT
const { params } = useRoute()
console.log(params.id)

const dormitoryDetaill = ref('')

onMounted(async()=>{
    await getDormitoryDetail()
})

const getDormitoryDetail = async () => {
  try {
    const res = await fetch(`${API_ROOT}/dormitories/${params.id}`); // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง
    if (res.ok) {
        dormitoryDetaill.value = await res.json();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}


</script>
 
<template>
<div class="w-full h-full flex justify-center mt-20">


    <div class="flex flex-col border border-xl h-full bg-gray-5oo p-2 w-2/5">
        <!-- เมนูด้านบน -->
        <div class="flex flex-col p-5 space-y-5">
            <div class="text-5xl">{{ dormitoryDetaill.name }}</div>
            <div class="flex space-x-5 justify-around">
                <p>ประกาศโดย : {{ dormitoryDetaill.staffName }}</p>
                <p>สถานะ : {{ dormitoryDetaill.status }}</p>
                <p>อัปเดตล่าสุด : {{ dormitoryDetaill.date }}</p>
            </div>
        </div>

        <!-- รูป -->
        <div class="flex bg-red-500 h-52 justify-center items-center">
            Photos
        </div>

        <!-- รายละเอียดต่างๆ -->
         <div class="flex flex-col p-5 space-y-5">

            <!-- ราคา -->
            <div>
                <div class="flex flex-row w-full justify-between">
                    <h1 class="text-3xl">5000 / เดือน</h1>
                    <div><button class="btn bg-orange-500 text-white hover:bg-orange-600 btn-xs sm:btn-sm md:btn-md lg:btn-lg ">จอง</button></div>
                    
                </div>
                <div class="flex flex-row space-x-5">
                    <p>2 เตียง</p>
                    <p>1 ห้องน้ำ</p>
                    <p>30 ตร.ม</p>
                </div>
            </div>

            <!-- รายละเอียด -->
            <div>
                <h2 class="text-xl">รายละเอียด</h2>
                <p>We admired the detail of the artist's work. The job requires attention to detail.  requires attention to detai  requires attention to detai</p>
            </div>

            <div>
                <h2 class="text-xl">เฟอร์นิเจอร์</h2>
                <div class="bg-red-500 h-52"></div>
            </div>
        </div>
    </div>

</div>
</template>
 
<style scoped>

</style>