<script setup>
import {ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { formatDate } from '@/composables/formatDate'
import Map from '@/components/Map.vue'
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


    <div class="flex flex-col border border-xl h-full bg-gray-500 p-2 w-2/5">
        <!-- เมนูด้านบน -->
        <div class="flex flex-col p-5 space-y-5">
            <div class="text-5xl">{{ dormitoryDetaill.name }}</div>
            <div class="flex space-x-5 justify-around">
                <p>ประกาศโดย : {{ dormitoryDetaill.staffName }}</p>
                <p>สถานะ : {{ dormitoryDetaill.status }}</p>
                <p>อัปเดตล่าสุด : {{ formatDate(dormitoryDetaill.updated_at) }}</p>
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
                    <h1 class="text-3xl">{{dormitoryDetaill.min_price}} - {{ dormitoryDetaill.max_price }}</h1>
                    <button @click="setMainDormitory(dorm.id)" class="btn bg-black text-white hover:bg-zinc-600">
                      ตั้งเป็นหอพักหลัก
                    </button>
                    <button @click="setSecondaryDormitory(dorm.id)" class="btn bg-white border-2 border-black hover:bg-zinc-300 hover:border-black">
                      ตั้งเป็นหอพักรอง
                    </button>
                    
                </div>
                <div class="flex flex-col space-x-5">
                    <p>จำนวนห้องพักที่เหลือให้เช่า: {{ dormitoryDetaill.roomCount }}</p>
                    <p>ประเภทหอพัก: {{ dormitoryDetaill.type }}</p>
                    <p>ขนาดห้อง: {{ dormitoryDetaill.size }}</p>
                </div>
            </div>

            <!-- รายละเอียด -->
            <div>
                <h2>ที่อยู่หอพัก</h2>
                <ul>
                    <li v-for="(address, index) in dormitoryDetaill.address" :key="index">
                        {{ address }}
                    </li>
                </ul>
            </div>

            <div>
                <h2 class="text-xl">เฟอร์นิเจอร์</h2>
                <div>
                    <h2 class="text-xl">สิ่งอำนวยความสะดวกของอาคาร</h2>
                    <ul>
                        <li v-for="(facility, index) in dormitoryDetaill.building_facility" :key="index">
                        {{ facility }}
                        </li>
                    </ul>

                    <h2 class="text-xl mt-4">สิ่งอำนวยความสะดวกของห้อง</h2>
                    <ul>
                        <li v-for="(facility, index) in dormitoryDetaill.room_facility" :key="index">
                        {{ facility }}
                        </li>
                    </ul>
                </div>
                
            </div>
    </div>
    </div>


</div>
</template>
 
<style scoped>

</style>