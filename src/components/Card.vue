<script setup>
import { defineProps, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  dormitoryName: {
    type: String,
    required: false
  },
  distance: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  minprice: {
    type: String,
    required: false
  },
  maxprice: {
    type: String,
    required: false
  },
  size: {
    type: String,
    required: false
  },
  roomFacilities: {
    type: Array,
    required: false
  },
  buildingFacilities: {
    type: Array,
    required: false
  },
  imageUrl: {  // เพิ่ม prop นี้เพื่อรับ URL ของภาพ
    type: String,
    required: true
  }
});

onMounted(() => {
  console.log("roomFacilities: ", props.roomFacilities);  // แสดงข้อมูลใน console
  console.log("buildingFacilities: ", props.buildingFacilities);  // แสดงข้อมูลใน console
})


</script>

<template>
  <div class="bg-base-100 shadow-xl w-full rounded-xl">
    <div class="text-xl text-center font-semibold bg-black text-white rounded-t-xl">{{ title }}</div>
    <div class="flex flex-col">
      <div class="img">
        <figure class="relative">
          <!-- แสดงภาพที่ได้รับมาจาก imageUrl -->
          <img :src="imageUrl" alt="หอพัก" class="w-full h-24 object-cover" />
          <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white">
            <span class="text-3xl font-semibold">{{ dormitoryName || 'ยังไม่ได้เลือก' }}</span>
          </div>
        </figure>
      </div>

      <div class="grid h-10 flex-grow place-items-center mt-2">
        <h3 class="text-xl font-semibold">ระยะห่างจาก KMUTT: <span class="text-orange-500">{{ distance }}</span></h3>
      </div>
      
      <div class="flex w-full p-4 space-x-2">
        <div class="bg-base-200 rounded-box grid h-10 flex-grow place-items-center hover:bg-gray-200">
          <h3>ราคาต่ำสุด: <span class="text-green-500">{{ minprice || 'ยังไม่ได้เลือก' }}</span></h3>
        </div>

        <div class="bg-base-200 rounded-box grid h-10 flex-grow place-items-center hover:bg-gray-200">
          <h3>ราคาสูงสุด: <span class="text-green-500">{{ maxprice || 'ยังไม่ได้เลือก' }}</span></h3>
        </div>
      </div>

      <div class="p-4 space-y-2 h-28 fixed-height-div">
        <h3>ขนาดห้องพัก: <span class="text-gray-600">{{ size || 'ยังไม่ได้เลือก' }}</span></h3>
        <h3>ที่อยู่หอพัก: <span class="text-gray-600">{{ address || 'ยังไม่ได้เลือก' }}</span></h3>
      </div>


      <div class="flex flex-row w-full justify-center">

      <!-- สิ่งอำนวยความสะดวกในห้องพัก -->
      <div class="p-4 w-1/2" v-if="Array.isArray(roomFacilities) && roomFacilities.length">
        <table class="min-w-full table-auto">
          <thead>
            <tr>
              <th class="px-4 py-2 border">สิ่งอำนวยความสะดวกภายในห้องพัก</th>
            </tr>
          </thead>
          <tbody class="scrollable-table border">
            <tr v-for="(facility, index) in roomFacilities" :key="index">
              <td class="px-4 py-2">{{ facility }}</td>
            </tr>
          </tbody>
        </table>
      </div>
            <!-- สิ่งอำนวยความสะดวกในห้องพัก -->
      <div class="p-4 w-1/2" v-if="Array.isArray(roomFacilities) && roomFacilities.length">
        <table class="min-w-full table-auto">
          <thead>
            <tr>
              <th class="px-4 py-2 border">สิ่งอำนวยความสะดวกภายนอกห้องพัก</th>
            </tr>
          </thead>
          <tbody class="scrollable-table border">
            <tr v-for="(facility, index) in buildingFacilities" :key="index">
              <td class="px-4 py-2">{{ facility }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="p-4">
        <p>ไม่มีข้อมูลเกี่ยวกับสิ่งอำนวยความสะดวก</p>
      </div>

    </div>
    </div>
  </div>
</template>


<style scoped>
/* ขนาดของการ์ด */
.card {
  min-height: 22rem; /* ให้การ์ดมีความสูงขั้นต่ำ */
  height: auto; /* ปรับให้ความสูงพอดีกับข้อมูล แต่ไม่ต่ำกว่า min-height */
  width: 100%; /* กำหนดให้ความกว้างเต็ม */
}

img {
  object-fit: cover;
  height: 10rem; /* กำหนดความสูงของภาพ */
}

p{
  font-size: 1rem;
}

h3{
font-weight: 500;
color: black;
}

span{
  font-weight: 500;
}

/* ทำให้ตารางสามารถ scroll ได้เมื่อแถวเกิน */
.scrollable-table {
  max-height: 125px; /* ขีดจำกัดความสูงของตาราง */
  overflow-y: auto; /* เปิด scroll แนวตั้งเมื่อข้อมูลเกิน */
  display: block;
  height: 100%; /* ทำให้ตารางเต็มพื้นที่ภายใน */
}

</style>
