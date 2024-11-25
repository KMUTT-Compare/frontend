<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from '@/composables/formatDate';
import WhiteButton from '@/components/buttons/WhiteButton.vue';
import BlackButton from '@/components/buttons/BlackButton.vue';
import { getDormitoryById } from '@/composables/getDormitoryById';

// สมมุติว่าเรามีรูปภาพหลายรูปที่อยู่ในตัวแปร
const dormImages = ref([
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg"
  // เพิ่มเติมรูปภาพอื่น ๆ
]);

const showModal = ref(false);
const selectedImage = ref("");

// ใช้ `useRoute` เพื่อดึงข้อมูลจาก URL
const { params } = useRoute();
const dormitoryDetaill = ref([]);

onMounted(async () => {
  try {
    dormitoryDetaill.value = await getDormitoryById(params.id);
  } catch (error) {
    console.error('Error fetching dormitory:', error);
  }
});

// ฟังก์ชันเปิดปิดโมดัล
function openModal(image) {
  selectedImage.value = image;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
</script>

<template>
  <div class="w-full h-full flex justify-center bg-gray-100 py-8">
    <div class="flex flex-col border border-gray-300 rounded-lg shadow-lg w-3/4 bg-white p-6">
      <!-- เมนูด้านบน -->
      <div class="flex text-gray-700 px-6 justify-between text-lg">
        <p>ประกาศโดย : {{ dormitoryDetaill.staffName }}</p>
        <p>สถานะ : {{ dormitoryDetaill.status }}</p>
        <p>อัปเดตล่าสุด : {{ formatDate(dormitoryDetaill.updated_at) }}</p>
      </div>

      <!-- รายละเอียดมุมขวาบน -->
      <div class="flex flex-col md:flex-row md:space-x-4 p-6 rounded-lg">
        <!-- กรอบสำหรับรูป 3 รูปทางซ้าย -->
        <div class="w-full md:w-1/5 flex flex-col space-y-2">
          <img class="imgs object-cover w-full h-36 rounded-lg shadow-md hover:scale-105 transition-transform" :src="dormImages[0]" alt="Image 1">
          <img class="imgs object-cover w-full h-36 rounded-lg shadow-md hover:scale-105 transition-transform" :src="dormImages[1]" alt="Image 2">
          <div class="relative">
            <img class="imgs object-cover w-full h-36 rounded-lg shadow-md hover:scale-105 transition-transform" :src="dormImages[2]" alt="Image 3">
            <!-- ป้ายดูเพิ่มเติม -->
            <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 text-white font-semibold text-xl cursor-pointer" @click="openModal(dormImages)">
              ดูเพิ่มเติม
            </div>
          </div>
        </div>

        <!-- กรอบสำหรับรูปเดียวทางขวา -->
        <div class="w-full md:w-3/6 flex justify-center">
          <img class="imgs object-cover w-full rounded-lg shadow-lg hover:scale-105 transition-transform" :src="dormImages[3]" alt="Main Image">
        </div>

        <!-- รายละเอียดหอพัก -->
        <div class="w-full md:w-3/6 space-y-4 p-4 rounded-lg shadow-md">
          <h1 class="text-5xl font-semibold">{{ dormitoryDetaill.name }}</h1>
          <div class="pt-4">
            <p class="font-semibold">ราคา</p>
            <h2 class="text-2xl font-semibold"><span class="text-4xl text-green-500 font-semibold">{{ dormitoryDetaill.min_price }} - {{ dormitoryDetaill.max_price }}</span> บาท / เดือน</h2>
          </div>
          <div class="flex flex-col pt-4 space-y-2">
            <BlackButton @click="setMainDormitory(dorm.dormId)" context="ตั้งเป็นหอพักหลัก" />
            <WhiteButton @click="setSecondaryDormitory(dorm.dormId)" context="ตั้งเป็นหอพักรอง" />
          </div>
        </div>
      </div>

      <!-- รายละเอียดต่างๆ -->
      <div class="flex flex-col space-y-6 px-6">
        <h2 class="text-3xl font-semibold">รายละเอียดหอพัก</h2>
        <div class="space-y-4">
          <p>จำนวนห้องพักที่เหลือให้เช่า: {{ dormitoryDetaill.roomCount }}</p>
          <p>ประเภทหอพัก: {{ dormitoryDetaill.type }}</p>
          <p>ขนาดห้อง: {{ dormitoryDetaill.size }}</p>
        </div>
        
        <!-- ที่อยู่ -->
        <div class="space-y-4">
          <h3 class="text-2xl font-semibold">ที่อยู่หอพัก</h3>
          <ul class="space-y-2">
            <li v-for="(address, index) in dormitoryDetaill" :key="index">
              {{ address.dormNumber }} {{ address.street }} {{ address.subdistrict }} {{ address.district }} {{ address.province }} {{ address.postalCode }}
            </li>
          </ul>
        </div>

        <!-- Facility: ภายในห้องพัก และ ภายนอกอาคาร -->
        <div class="flex space-x-4">
          <!-- ภายในห้องพัก -->
          <div class="w-full md:w-1/2 space-y-4">
            <h3 class="text-2xl font-semibold">เฟอร์นิเจอร์ภายในห้องพัก</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full table-auto text-left border-collapse">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="px-4 py-2 font-semibold text-xl text-gray-700">รายการเฟอร์นิเจอร์</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(facility, index) in dormitoryDetaill.room_facility" :key="index">
                    <td class="border px-4 py-2">{{ facility }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ภายนอกอาคาร -->
          <div class="w-full md:w-1/2 space-y-4">
            <h3 class="text-2xl font-semibold">เฟอร์นิเจอร์ภายนอกอาคาร</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full table-auto text-left border-collapse">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="px-4 py-2 font-semibold text-xl text-gray-700">รายการเฟอร์นิเจอร์</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(facility, index) in dormitoryDetaill.building_facility" :key="index">
                    <td class="border px-4 py-2">{{ facility }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal แสดงรูปภาพเพิ่มเติม -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-4 rounded-lg w-4/5 h-4/5 overflow-auto">
      <div class="flex justify-end">
        <button @click="closeModal" class="text-xl font-bold text-gray-700">X</button>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(image, index) in dormImages" :key="index" class="relative">
          <img :src="image" alt="Gallery Image" class="w-full h-48 object-cover rounded-lg shadow-md">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ปรับแต่งโมดัล */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.z-50 {
  z-index: 50;
}

/* เพิ่มเอฟเฟกต์สำหรับการคลิก */
.imgs {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.imgs:hover {
  transform: scale(1.05);
}

/* ปรับแต่งตาราง facility */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
}

td {
  text-align: left;
}

.flex {
  display: flex;
}

.space-x-4 {
  gap: 1rem;
}
</style>
