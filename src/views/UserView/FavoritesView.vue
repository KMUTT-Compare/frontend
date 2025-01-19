<script setup>
import { ref, onMounted, computed } from 'vue'
const API_ROOT = import.meta.env.VITE_API_ROOT


let userid = 1

onMounted(async () => {
  dormitories.value = await getFavorites(userid);
  // console.log(dormitories.value)
  
})

const favorites = ref([
  { id: 1, name: "หอพัก ABC", score: 4.8, size: 20, min_price: 3000, max_price: 5000, },
  { id: 2, name: "หอพัก XYZ", score: 4.6, size: 10, min_price: 4000, max_price: 6000, },
  { id: 3, name: "หอพัก 123", score: 4.4, size: 30, min_price: 5000, max_price: 7000,},
]);

// Sorting
const sortBy = ref("score");
const sortedFavorites = computed(() => {
  return [...favorites.value].sort((a, b) => {
    if (sortBy.value === "score") return b.score - a.score;
    return a.name.localeCompare(b.name);
  });
});

// ฟังก์ชันสำหรับดึงข้อมูล Favorite Dormitories
const getFavorites = async (userId = null) => {
  try {
    // กำหนด URL โดยเพิ่ม query parameter `user_id` ถ้ามี
    const url = userId ? `${API_ROOT}/favorites/${userId}` : `${API_ROOT}/favorites`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    // ตรวจสอบว่ามีข้อมูลหรือไม่ ถ้าไม่มีส่งกลับ array ว่าง
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching favorite dormitories:', error);
    return []; // Return empty array on error
  }
};

const topDorm = computed(() => {
  if (favorites.value.length === 0) return null; // ถ้าไม่มีรายการ favorite ให้คืนค่า null
  return [...favorites.value].sort((a, b) => b.score - a.score)[0]; // คืนหอพักที่มี score สูงสุด
});

</script>
 
<template>
  <div class="favorites-page">
    <h1 class="title text-center">🏆 Ranking</h1>

    <!-- Rank 1 -->
    <div class="rank1-container">
      <div class="image-container">
        <img :src="topDorm.image || '/images/no_image.jpg'" alt="Dorm Image" class="main-image">
        <div class="rank-badge">
          <img src="/images/rank.png" alt="Rank 1">
        </div>
      </div>
      <div class="details text-center">
        <h2 class="text-2xl font-bold text-blue-800">{{ topDorm.name }}</h2>
        <p class="score">คะแนน: <span>{{ topDorm.score }}</span></p>
      </div>
    </div>

    <!-- Header -->
    <header class="header flex w-full mt-5 mb-5">
      <div class="flex w-full items-center">
        <h2 class="text-xl">💖 รายการโปรด</h2>
      </div>
      <div class="flex w-44">
        <select v-model="sortBy" class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="score">คะแนนสูงสุด</option>
        <option value="name">เรียงตามชื่อ</option>
      </select>
      </div>

    </header>

    <!-- Favorite List -->
    <div class="dorm-list">
      <div v-for="(dorm, index) in sortedFavorites" :key="dorm.id" class="dorm-card">
        <div class="card-image">
          <img :src="dorm.image || '/images/no_image.jpg'" alt="Dorm Image" />
        </div>
        <div class="card-details">
          <h3 class="dorm-name">{{ index + 1 }}. {{ dorm.name }}</h3>
          <p class="dorm-score">คะแนน: {{ dorm.score }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* General Styles */
.favorites-page {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #f7f9fc, #ffffff);
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* Title */
.title {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #4a90e2;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: bold;
}

/* Dropdown */
.sort-dropdown {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.sort-dropdown:hover {
  background-color: rgb(241, 241, 241);
  border: 1px solid #ddd; /* เพิ่มกรอบเมื่อ hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* เพิ่มเงาเล็กน้อย */
  color: #333; /* เพิ่มสีตัวอักษรเมื่อ hover */
  cursor: pointer; /* เพิ่ม pointer เมื่อ hover */
}

/* Rank 1 Section */
.rank1-container {
  background: #fff7e6;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(255, 165, 0, 0.2);
  cursor: pointer;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  max-width: 300px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.rank-badge {
  position: absolute;
  top: -20px;
  right: -20px;
  background: #ffffff;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.rank-badge img {
  width: 100px;
}

.details {
  text-align: center;
}

.details h2 {
  font-size: 1.8rem;
  color: #333;
}

.details .score {
  font-size: 1.2rem;
  color: #4caf50;
  font-weight: bold;
}

/* Favorite List Section */
.dorm-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.dorm-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.dorm-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-details {
  padding: 15px;
  text-align: center;
}

.card-details .dorm-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.card-details .dorm-score {
  font-size: 1rem;
  color: #4caf50;
}
</style>

