<script setup>
import { ref, onMounted, computed } from 'vue'
import { getFavorites } from '@/composables/getFavorites';
import router from '@/router';
const API_ROOT = import.meta.env.VITE_API_ROOT
import SortComponent from '@/components/filters/SortComponent.vue';
const dormitories = ref([]); // เก็บรายการโปรด



// ดูรายละเอียดหอพัก
const showDetail = (dormitoryId) =>{
  router.push({
    name : 'dormitoryDetail',
    params : {id : dormitoryId}
  })
}

// โหลดข้อมูลรายการโปรดเมื่อเริ่มต้น
onMounted(async () => {
  dormitories.value = await getFavorites();
});



// คำนวณหอพักที่มีคะแนนสูงสุด
const topDorm = computed(() => {
  if (dormitories.value.length === 0) return null;
  return [...dormitories.value].sort((a, b) => b.score - a.score)[0];
});

// ฟังก์ชันลบออกจากรายการโปรด
const removeFromFavorites = async (dormId) => {
  try {
    const response = await fetch(`${API_ROOT}/favorites/dorm/${dormId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem('token')
      },
    });

    if (response.ok) {
      dormitories.value = await getFavorites();
      
    } else {
      console.error('Failed to delete dorm:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting dorm:', error);
  }
};
</script>

<template>
  <div class="outborder flex flex-col items-center justify-center w-full h-full p-10">

    <div class="favorites-page">
      
      <!-- Rank 1 Section -->
      <div class="rank1-container" v-if="topDorm">
        <div class="rank1-image-left">
          <img src="../../components/icons/Favorite/rank.png" alt="Rank Image" class="w-60 animate-scale">
        </div>
        <div class="rank1-details">
          <div class="details text-left pl-3">
            <h2 class="text-3xl font-bold text-blue-800">{{ topDorm.dormName }}</h2>
            <p class="score pt-2">Rating: <span class="font-semibold">{{ topDorm.score }}</span></p>
          </div>
        </div>
        <div class="rank1-image-right p-4">
          <img src="../../components/icons/Favorite/jip2.gif" alt="Rank 1 GIF" class="w-72 rounded-full">
        </div>
      </div>
      <p v-else class="text-red-500 text-center text-xl">ยังไม่มีรายการโปรด</p>

      <!-- Header -->
      <header class="header flex w-full mt-5 mb-5">
        <div class="flex w-full items-center justify-between">
          <h2 class="text-xl font-semibold">💖 รายการโปรด</h2>
          <div class="w-44">
            <SortComponent :dormitories="dormitories" />
          </div>
        </div>
      </header>

      <!-- Table for Favorite List -->
      <table class="favorite-table w-full text-left">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อหอพัก</th>
            <th>คะแนน</th>
            <th>ขนาดห้อง</th>
            <th>ราคาต่ำสุด</th>
            <th>ราคาสูงสุด</th>
            <th>ระยะทาง</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dorm, index) in dormitories" :key="dorm.id">
            <td>{{ index + 1 }}</td>
            <td @click="showDetail(dorm.dormId)" class="cursor-pointer animated-hover">
              {{ dorm.dormName }}
            </td>
            <td>{{ dorm.score }}</td>
            <td>{{ dorm.size }} ตร.ม.</td>
            <td>{{ dorm.min_price }} บาท</td>
            <td>{{ dorm.max_price }} บาท</td>
            <td>{{ dorm.distance }} กม.</td>
            <td>
              <button 
                @click="removeFromFavorites(dorm.dormId)" 
                class="transition-transform transform hover:scale-110 hover:rotate-6">
                <img src="../../components/icons/Favorite/bin.png" alt="" class="w-8">
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

.animated-hover {
    transition: transform 0.3s ease, color 0.3s ease;
  }

  .animated-hover:hover {
    transform: scale(1.05); /* Scale the element slightly */
    color: #ff6600; /* Change text color when hovered */
  }


@keyframes scaleUpDown {
  0% {
    transform: scale(0.9); /* ขนาดเริ่มต้น */
  }
  50% {
    transform: scale(1); /* ขยายเป็น 1.2 เท่า */
  }
  100% {
    transform: scale(0.9); /* ย่อกลับไปที่ขนาดเริ่มต้น */
  }
}

.animate-scale {
  animation: scaleUpDown 1s ease-in-out infinite; /* ปรับเวลาเป็น 1 วินาที */
}

/* เพิ่มความน่าสนใจสำหรับชื่อหอพัก */
.rank1-container .details h2 {
  animation: textGlow 1.5s ease-in-out infinite alternate;
}

/* Rank 1 Container */
.rank1-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.rank1-details {
  flex: 1;
  text-align: left;
}

.rank1-container .details h2 {
  font-size: 2.5rem;
  color: #ff5e00;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3), /* เงานุ่มๆ */
               0 0 10px rgba(255, 255, 255, 0.4); /* เงาขาวเบาๆ */
  -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.3); /* ขอบนุ่มๆ */
}

.rank1-container .details p {
  font-size: 1.2rem;
  color: #444;
  margin-top: 10px;
  font-weight: bold;
  letter-spacing: 1px;
}

.rank1-image-left,
.rank1-image-right {
  flex-shrink: 0;
  border-radius: 50%;
}

.rank1-image-left img,
.rank1-image-right img {
  max-width: 100%;
  height: auto;
}

/* สไตล์ปุ่ม */
.btn {
  padding: 8px 15px;
  border: none;
  background-color: #e74c3c;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  background-color: #c0392b;
  transform: scale(1.05);
}

/* General Styles */
.outborder {
  background: linear-gradient(135deg,#f9ffa4, #ff4800, #fff495);
}

.favorites-page {
  max-width: 1000px;
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}



/* Table Styles */
.favorite-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.favorite-table th,
.favorite-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.favorite-table th {
  background-color: #ff5e00;
  color: white;
  font-size: 1.2rem;
  border-radius: 3px;
}

.favorite-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.favorite-table tr:hover {
  background-color: #f1f1f1;
}
</style>
