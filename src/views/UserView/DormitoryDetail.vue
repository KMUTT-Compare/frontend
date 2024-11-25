<script setup>
import {ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { formatDate } from '@/composables/formatDate'
import WhiteButton from '@/components/buttons/WhiteButton.vue';
import BlackButton from '@/components/buttons/BlackButton.vue';
const API_ROOT = import.meta.env.VITE_API_ROOT
const { params } = useRoute()
console.log(params.id)

const dormitoryDetaill = ref([])

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
<div class="w-full h-full flex justify-center">


    <div class="flex flex-col border border-xl h-full p-2 w-2/4">
        <!-- เมนูด้านบน -->
            <div class="flex justify-between w-3/5">
                <p>ประกาศโดย : {{ dormitoryDetaill.staffName }}</p>
                <p>สถานะ : {{ dormitoryDetaill.status }}</p>
                <p>อัปเดตล่าสุด : {{ formatDate(dormitoryDetaill.updated_at) }}</p>
            </div>

        <!-- รายละเอียดมุมขวาบน -->    
        <div class="flex flex-row p-5 px-2 space-x-2 justify-center w-full">
            <!-- กรอบสำหรับรูป 3 รูปทางซ้าย -->
            <div class="w-1/5 flex flex-col space-y-2">
                <img class="imgs object-cover w-full h-36" src="../../assets/images/cat.jpg" alt="">
                <img class="imgs object-cover w-full h-36" src="../../assets/images/cat.jpg" alt="">
                <img class="imgs object-cover w-full h-36" src="../../assets/images/cat.jpg" alt="">
            </div>
            
            <!-- กรอบสำหรับรูปเดียวทางขวา -->
            <div class="w-3/6 flex justify-center">
                <img class="imgs object-cover w-full" src="../../assets/images/cat.jpg" alt="">
            </div>
            
            <!-- รายละเอียดหอพัก -->
            <div class="flex flex-col w-3/6 space-y-2 px-4">
                <h1>{{ dormitoryDetaill.name }}</h1>
                <div class="pt-4">
                    <p>ราคา</p>
                    <h2>{{dormitoryDetaill.min_price}} - {{ dormitoryDetaill.max_price }} บาท / เดือน</h2>
                </div>
                <!-- ปุ่ม -->
                <div class="flex flex-col pt-4 space-y-2">
                    <BlackButton @click="setMainDormitory(dorm.dormId)" context="ตั้งเป็นหอพักหลัก"/>
                    <WhiteButton @click="setSecondaryDormitory(dorm.dormId)" context="ตั้งเป็นหอพักรอง"/>
                </div>
            </div>
        </div>

        <!-- รายละเอียดต่างๆ -->
         <div class="flex flex-col px-2 py-5 space-y-5">
            <h2>รายละเอียด</h2>
                <div class="flex flex-col space-y-2">
                    <p>จำนวนห้องพักที่เหลือให้เช่า: {{ dormitoryDetaill.roomCount }}</p>
                    <p>ประเภทหอพัก: {{ dormitoryDetaill.type }}</p>
                    <p>ขนาดห้อง: {{ dormitoryDetaill.size }}</p>
                </div>
      

            <!-- รายละเอียด -->
            <div class="space-y-2">
                <h3>ที่อยู่หอพัก</h3>
                <ul>
                    <p v-for="(address, index) in dormitoryDetaill" :key="index">
                        <p>{{ address.dormNumber }} {{ address.street }} {{ address.subdistrict }} {{ address.district }} {{ address.province }} {{ address.postalCode }} </p>
                    </p>
                </ul>
            </div>

            <div class="space-y-2">
                <h3 class="text-xl">เฟอร์นิเจอร์</h3>
                <div class="space-y-4">
                    <div class="flex space-x-8">
                        <!-- สิ่งอำนวยความสะดวกภายในห้อง (ซ้าย) -->
                        <div class="flex-1">
                            <h4 class="text-xl">สิ่งอำนวยความสะดวกภายในห้อง</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <p v-for="(facility, index) in dormitoryDetaill.room_facility" :key="index">
                                    {{ facility }}
                                </p>
                            </div>
                        </div>

                        <!-- สิ่งอำนวยความสะดวกนอกอาคาร (ขวา) -->
                        <div class="flex-1">
                            <h4 class="text-xl">สิ่งอำนวยความสะดวกนอกอาคาร</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <p v-for="(facility, index) in dormitoryDetaill.building_facility" :key="index">
                                    {{ facility }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    </div>
    </div>


</div>
</template>
 
<style scoped>

p{
    font-size: 1.3rem;
}

h1{
    font-size: 2rem;
}

h2{
    font-size: 1.7rem;
}

h3{
    font-size: 1.5rem;
}


p{
    font-size: 1.2rem;
}

</style>