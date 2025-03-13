<script setup>
import { ref, onMounted, computed,watch } from 'vue'
import router from '@/router';
import WhiteButton from '@/components/buttons/WhiteButton.vue';
import BlackButton from '@/components/buttons/BlackButton.vue';
import Card from '@/components/Card.vue';
import { getDormitories } from '@/composables/getDormitories';
import { formatPrice } from '@/composables/formatPrice';
import { getFavorites } from '@/composables/getFavorites';
import SortComponent from '@/components/SortComponent.vue';
import { useAuthorize } from '@/stores/authorize';
import { storeToRefs } from 'pinia';
const myRole = useAuthorize()
const {userRole} = storeToRefs(myRole)

const API_ROOT = import.meta.env.VITE_API_ROOT
const dormitories = ref([])
const favorites = ref([]); // เก็บรายการโปรด

onMounted(async () => {
  dormitories.value = await getDormitories();
  if(userRole.value !== 'guest'){
    favorites.value = await getFavorites();
  }
})


// ดูรายละเอียดหอพัก
const showDetail = (dormitoryId) =>{
  router.push({
    name : 'dormitoryDetail',
    params : {id : dormitoryId}
  })
}


//---------------------------------- Sort ----------------------------------
// ตัวแปรสำหรับเก็บวิธีการจัดเรียง
const sortBy = ref('name'); // ค่าเริ่มต้นคือการจัดเรียงตามชื่อ

// ฟังก์ชันสำหรับจัดเรียงข้อมูล
const sortDormitories = (sortType) => {
  if (sortType === 'min_price') {
    dormitories.value.sort((a, b) => a.max_price - b.max_price); // เรียงจากราคาต่ำสุด
  } else if (sortType === 'max_price') {
    dormitories.value.sort((a, b) => b.min_price - a.min_price); // เรียงจากราคาสูงสุด
  } else if (sortType === 'distance') {
    dormitories.value.sort((a, b) => a.distance - b.distance); // เรียงตามระยะทาง
  } else if (sortType === 'name') {
    dormitories.value.sort((a, b) => a.dormName.localeCompare(b.dormName)); // เรียงตามชื่อ A-Z
  }
};

// การเฝ้าติดตามการเปลี่ยนแปลงของ sortBy
watch(sortBy, (newSortType) => {
  sortDormitories(newSortType);
});



//---------------------------------- Favorite ----------------------------------

// เช็คว่าหอพักอยู่ใน Favorites หรือไม่
const isFavorite = (id) => {
  return favorites.value.some((favorite) => favorite.dormId === id);
};

// เพิ่ม/ลบรายการโปรด
const handleToggleFavorite = async (id) => {

  const userId = 1;

  try {
    if (isFavorite(id)) {
      // ลบรายการโปรด
      const res = await fetch(`${API_ROOT}/favorites/dorm/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        favorites.value = favorites.value.filter((fav) => fav.dormId !== id);
      } else {
        console.error('Error removing favorite:', res.status);
      }
    } else {
      // เพิ่มรายการโปรด
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dormId: id }),
      });
      if (res.ok) {
        favorites.value.push({ userId, dormId: id });
      } else {
        console.error('Error adding favorite:', res.status);
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};


//---------------------------------- Search & Filter ----------------------------------

const searchInput = ref('')
const selectTypes = ref('')


// ตัวแปรที่เก็บค่าที่ผู้ใช้กรอก
const minPrice = ref(0);  // ราคาต่ำสุดเริ่มต้น
const maxPrice = ref(20000);  // ราคาสูงสุดเริ่มต้น

const selectedDistance = ref(0) // เก็บระยะทางที่ผู้ใช้เลือก

const filteredDormitories = computed(() => {
  // หากไม่มี searchInput ก็ให้แสดง dormitories ทั้งหมด
  if (!searchInput.value) {
    return dormitories.value.filter(dorm => {
      // กรองตามช่วงราคา
      const inPriceRange = dorm.min_price >= minPrice.value && dorm.max_price <= maxPrice.value;

      // กรองตามประเภทหอพัก
      const typeMatches = dorm.type === selectTypes.value || selectTypes.value === '';

      // กรองตามระยะทาง
      let inDistanceRange = false;
      switch (selectedDistance.value) {
        case '1': // น้อยกว่า 1 กม.
          inDistanceRange = dorm.distance < 1;
          break;
        case '2': // 1 -> 2 กม.
          inDistanceRange = dorm.distance >= 1 && dorm.distance < 2;
          break;
        case '3': // 2 -> 3 กม.
          inDistanceRange = dorm.distance >= 2 && dorm.distance < 3;
          break;
        case '4': // 3 -> 4 กม.
          inDistanceRange = dorm.distance >= 3 && dorm.distance < 4;
          break;
        case '5': // 4 -> 5 กม.
          inDistanceRange = dorm.distance >= 4 && dorm.distance < 5;
          break;
        case '6': // 5 กม. ขึ้นไป
          inDistanceRange = dorm.distance >= 5;
          break;
        case '0': // ไม่จำกัด
        default:
          inDistanceRange = true;
          break;
      }

      return inPriceRange && typeMatches && inDistanceRange;
    });
  }

  // หากมี searchInput กรองตามชื่อหอพักหรือที่อยู่
  const searchTerm = searchInput.value.toLowerCase();
  return dormitories.value.filter(dorm => {
    // กรองตามช่วงราคา
    const inPriceRange = dorm.min_price >= minPrice.value && dorm.max_price <= maxPrice.value;

    // กรองตามประเภทหอพัก
    const typeMatches = dorm.type === selectTypes.value || selectTypes.value === '';

    // กรองตามระยะทาง
    let inDistanceRange = false;
    switch (selectedDistance.value) {
      case '1': // น้อยกว่า 1 กม.
        inDistanceRange = dorm.distance < 1;
        break;
      case '2': // 1 -> 2 กม.
        inDistanceRange = dorm.distance >= 1 && dorm.distance < 2;
        break;
      case '3': // 2 -> 3 กม.
        inDistanceRange = dorm.distance >= 2 && dorm.distance < 3;
        break;
      case '4': // 3 -> 4 กม.
        inDistanceRange = dorm.distance >= 3 && dorm.distance < 4;
        break;
      case '5': // 4 -> 5 กม.
        inDistanceRange = dorm.distance >= 4 && dorm.distance < 5;
        break;
      case '6': // 5 กม. ขึ้นไป
        inDistanceRange = dorm.distance >= 5;
        break;
      case '0': // ไม่จำกัด
      default:
        inDistanceRange = true;
        break;
    }

    // กรองตามชื่อหอพักหรือที่อยู่
    const nameMatches = dorm.dormName.toLowerCase().includes(searchTerm);
    const addressMatches =
      dorm.address.street.toLowerCase().includes(searchTerm) ||
      dorm.address.subdistrict.toLowerCase().includes(searchTerm) ||
      dorm.address.district.toLowerCase().includes(searchTerm) ||
      dorm.address.province.toLowerCase().includes(searchTerm);

    return inPriceRange && typeMatches && inDistanceRange && (nameMatches || addressMatches);
  });
});




// ---------------------------------- เปรียบเทียบหอพัก ----------------------------------
import { useDormitoryStore } from '@/stores/useDormitoryStore';

// เข้าถึง store
const dormitoryStore = useDormitoryStore();

// ดึง computed properties จาก store
const mainDormitoryData = computed(() => dormitoryStore.mainDormitoryData);
const secondaryDormitoryData = computed(() => dormitoryStore.secondaryDormitoryData);



// ฟังก์ชันสำหรับแปลง address ให้เป็น string
const formatAddress = (address) => {
  if (typeof address === 'object' && address !== null) {
    // จัดรูปแบบ address ให้เป็น string
    return `${address.dormNumber} ${address.street}, ${address.subdistrict}, ${address.district}, ${address.province}, ${address.postalCode}`;
  }
  return address || 'ยังไม่มีที่อยู่';
}

// ฟังก์ชันเปรียบเทียบและคืนค่าความแตกต่าง
const getCheckMark = (mainValue, secondaryValue, category) => {

  if (mainValue === null || secondaryValue === null) {
    return '';
  }

  if (category === 'minprice') {
    // ระยะทางและราคาน้อยสุดดีกว่า
    if (mainValue < secondaryValue) {
      return '   ❤️️' // หอพักหลักดีกว่า
    } else if (mainValue > secondaryValue) {
      return ' ' // หอพักรองดีกว่า
    }
  } else if (category === 'maxprice') {
    // ขนาดห้องใหญ่สุดดีกว่า
    if (mainValue < secondaryValue) {
      return '   ❤️️' // หอพักหลักดีกว่า
    } else if (mainValue > secondaryValue) {
      return '' // หอพักรองดีกว่า
    }
  } else if (category === 'size') {
    // ขนาดห้องใหญ่สุดดีกว่า
    if (mainValue > secondaryValue) {
      return '   ❤️️' // หอพักหลักดีกว่า
    } else if (mainValue < secondaryValue) {
      return '' // หอพักรองดีกว่า
    }
  } else if (category === 'distance') {
    // ขนาดห้องใหญ่สุดดีกว่า
    if (mainValue < secondaryValue) {
      return '  ❤️️' // หอพักหลักดีกว่า
    } else if (mainValue > secondaryValue) {
      return '' // หอพักรองดีกว่า
    }
  }
  
  return ''
}


</script>

<template>


    <!-- Hero Section -->
    <header class="hero">
      <div class="background">
        <img src="@/components/photos/dorm.jpg" alt="Dorm Hero" class="hero-image">
      </div>
      <div class="hero-content">
        <!-- ส่วนหัวเรื่อง -->
        <div class="text-center py-5 mt-5 text-4xl font-semibold">
          <!-- ตรวจสอบว่า mainDormitory และ secondaryDormitory มีค่า -->
          <h2 v-if="mainDormitoryData && secondaryDormitoryData">ผลลัพธ์การเปรียบเทียบ</h2>
          <h2 v-else>เลือกเพื่อเปรียบเทียบ</h2>
        </div>
      </div>
    </header>



    <div class="w-full h-full flex flex-col justify-center items-center">


<!------------------------------- CARD Dormitories -------------------------------> 
<div class="w-8/12 flex flex-col items-center justify-center">
  <div class="w-full flex flex-row items-center justify-around mt-5 h-full space-x-4">
    <!-- หอพักหลัก -->
    <Card
      v-if="mainDormitoryData"
      title="หอพักหลัก"
      :dormitoryName="mainDormitoryData.dormName"
      :distance="mainDormitoryData.distance + ' กม.' + getCheckMark(mainDormitoryData.distance, secondaryDormitoryData?.distance, 'distance')"
      :address="formatAddress(mainDormitoryData.address)"
      :minprice="mainDormitoryData.min_price + getCheckMark(mainDormitoryData.min_price, secondaryDormitoryData?.min_price, 'minprice')"
      :maxprice="mainDormitoryData.max_price + getCheckMark(mainDormitoryData.max_price, secondaryDormitoryData?.max_price, 'maxprice')"
      :size="mainDormitoryData.size + ' ตร.ม.' + getCheckMark(mainDormitoryData.size, secondaryDormitoryData?.size, 'size')"
      :roomFacilities="mainDormitoryData.room_facility"
      :buildingFacilities="mainDormitoryData.building_facility"
      :imageUrl="mainDormitoryData.image[0]"
    />
    <div v-else class="w-full flex flex-col items-center justify-center bg-gray-200 h-80 rounded-lg shadow-md">
      <span class="text-3xl font-semibold text-center text-gray-600">ยังไม่ได้เลือกหอพักหลัก</span>
    </div>

    <!-- หอพักรอง -->
    <Card
      v-if="secondaryDormitoryData"
      title="หอพักรอง"
      :dormitoryName="secondaryDormitoryData.dormName"
      :distance="secondaryDormitoryData.distance + ' กม.' + getCheckMark(secondaryDormitoryData.distance, mainDormitoryData?.distance, 'distance')"
      :address="formatAddress(secondaryDormitoryData.address)"
      :minprice="secondaryDormitoryData.min_price + getCheckMark(secondaryDormitoryData.min_price, mainDormitoryData?.min_price, 'minprice')"
      :maxprice="secondaryDormitoryData.max_price + getCheckMark(secondaryDormitoryData.max_price, mainDormitoryData?.max_price, 'maxprice')"
      :size="secondaryDormitoryData.size + ' ตร.ม.' + getCheckMark(secondaryDormitoryData.size, mainDormitoryData?.size, 'size')"
      :roomFacilities="secondaryDormitoryData.room_facility"
      :buildingFacilities="secondaryDormitoryData.building_facility"
      :imageUrl="secondaryDormitoryData.image[0]"
    />
  <div v-else class="w-full flex flex-col items-center justify-center bg-gray-200 h-80 rounded-lg shadow-md">
    <span class="text-3xl font-semibold text-center text-gray-600">ยังไม่ได้เลือกหอพักรอง</span>
  </div>
</div>

</div>







<!--------------------------- Search Button & Filter -------------------------------------->
   
      <div class="flex flex-row w-8/12 justify-center items-center mt-5 space-x-2">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input v-model="searchInput" type="search" id="default-search" class="block w-full p-2 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ค้นหาหอพัก..." required />
          </div>
       
          <SortComponent :dormitories="dormitories" />

      </div>   



<div class="w-8/12  flex flex-col items-center mt-5">

  <div class="flex flex-row items-stretch gap-6 w-full pb-4">

<!-- ราคา (ชิดซ้าย) -->
<div class="flex flex-col space-y-4 flex-1 min-w-[250px] border border-gray-300 rounded-lg shadow-md p-4">
  <h2 class="text-lg font-semibold text-gray-800 text-center">ราคา</h2>
  <div class="flex flex-row justify-between space-x-4">
    <div class="flex flex-col space-y-2 w-1/2">
      <div class="flex items-center space-x-2">
        <label for="minPrice" class="text-sm font-medium text-gray-600">ราคาเริ่มต้น:</label>
        <input
          type="number"
          v-model="minPrice"
          min="0"
          max="20000"
          step="100"
          class="w-24 text-sm border border-gray-300 rounded-md p-1 text-center"
        />
      </div>
      <input
        id="minPrice"
        type="range"
        v-model="minPrice"
        min="0"
        max="20000"
        step="100"
        class="w-full rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="flex flex-col space-y-2 w-1/2">
      <div class="flex items-center space-x-2">
        <label for="maxPrice" class="text-sm font-medium text-gray-600">ราคาสูงสุด:</label>
        <input
          type="number"
          v-model="maxPrice"
          min="0"
          max="20000"
          step="100"
          class="w-24 text-sm border border-gray-300 rounded-md p-1 text-center"
        />
      </div>
      <input
        id="maxPrice"
        type="range"
        v-model="maxPrice"
        min="0"
        max="20000"
        step="100"
        class="w-full rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</div>


<!-- ประเภทหอพัก (กึ่งกลาง) -->
<div class="flex flex-col space-y-4 flex-1 min-w-[250px] border border-gray-300 rounded-lg shadow-md p-4">
  <h2 class="text-lg font-semibold mb-4 text-gray-800">ประเภทหอพัก</h2>
  <div class="flex flex-row justify-around mt-3">
    <label class="flex items-center space-x-2">
      <input
        v-model="selectTypes"
        name="default-radio"
        type="radio"
        value=""
        class="form-radio w-5 h-5 text-blue-500 focus:ring-blue-500"
      />
      <span class="text-lg">ทั้งหมด</span>
    </label>
    <label class="flex items-center space-x-2">
      <input
        v-model="selectTypes"
        name="default-radio"
        type="radio"
        value="m"
        class="form-radio w-5 h-5 text-blue-500 focus:ring-blue-500"
      />
      <span class="text-lg">ชาย</span>
    </label>
    <label class="flex items-center space-x-2">
      <input
        v-model="selectTypes"
        name="default-radio"
        type="radio"
        value="f"
        class="form-radio w-5 h-5 text-blue-500 focus:ring-blue-500"
      />
      <span class="text-lg">หญิง</span>
    </label>
    <label class="flex items-center space-x-2">
      <input
        v-model="selectTypes"
        name="default-radio"
        type="radio"
        value="all"
        class="form-radio w-5 h-5 text-blue-500 focus:ring-blue-500"
      />
      <span class="text-lg">รวม</span>
    </label>
  </div>
</div>

<!-- ระยะทาง (ชิดขวา) -->
<div class="flex flex-col space-y-4 flex-1 min-w-[250px] border border-gray-300 rounded-lg shadow-md p-4">
  <h2 class="text-lg font-semibold text-gray-800">ระยะทาง</h2>
  <select
    id="distanceSelect"
    v-model="selectedDistance"
    class="text-lg block w-full p-3 mt-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
  >
    <option value="0">ไม่จำกัด</option>
    <option value="1">น้อยกว่า 1 กม.</option>
    <option value="2">1 -> 2 กม.</option>
    <option value="3">2 -> 3 กม.</option>
    <option value="4">3 -> 4 กม.</option>
    <option value="5">4 -> 5 กม.</option>
    <option value="6">5 กม. ขึ้นไป</option>
  </select>
</div>

</div>




<!-------------------------------- Items --------------------------------->
    <div v-if="filteredDormitories !== null && filteredDormitories.length !== 0" class="container">
      <div v-for="dorm in filteredDormitories" :key="dorm.dormId" class="holding-items">
        
        
        <div class="items rounded-lg border-2">
          
          <div class="w-8/12 flex h-64 justify-center items-center">
            <div class="w-full h-full bg-cover bg-center rounded-lg" :style="{ backgroundImage: `url(${dorm.image[0] || '/images/no_image.jpg'})` }" alt="Dormitory Image"></div>
          </div>

          <div class="flex flex-col w-full h-full p-3 justify-center">
            <div class="flex w-full">
              <div class="item w-full">
                <div class="flex flex-row w-full justify-between">
                  <h1 @click="showDetail(dorm.dormId)" class="dormname cursor-pointer">{{ dorm.dormName }}</h1>

                  <div v-if="userRole !== 'guest'">
                    <!-- ปุ่ม Favorite -->
                    <button 
                      @click="handleToggleFavorite(dorm.dormId)" 
                      class="p-2 rounded-full border border-gray-300 hover:bg-red-100 transition-colors"
                    >
                      <span :class="isFavorite(dorm.dormId) ? 'text-red-500' : 'text-gray-500'">
                        {{ isFavorite(dorm.dormId) ? '❤️' : '🤍' }}
                      </span>
                    </button>
                  </div>
                </div>
                <h2><span style="color: green; font-size: larger;">{{ formatPrice(dorm.min_price) }} - {{ formatPrice(dorm.max_price) }}</span> บาท/เดือน</h2>
                <h2>ระยะทาง <span>{{ dorm.distance }} กม.</span></h2>
                <h2>
                  ประเภทหอพัก:
                  <span v-if="dorm.type === 'all'">รวม</span>
                  <span v-else-if="dorm.type === 'f'">หญิง</span>
                  <span v-else-if="dorm.type === 'm'">ชาย</span>
                  <span v-else>{{ dorm.type }}</span>
                </h2>
                <p class="text-sm">ที่อยู่: {{ dorm.address.street }}, {{ dorm.address.subdistrict }}, {{ dorm.address.district }}, {{ dorm.address.province }} {{ dorm.address.postalCode }}</p>      
              </div>
            </div>
              <!-- Button -->
            <div class="flex justify-around space-x-2 mt-2 items-center">
              <BlackButton @click="dormitoryStore.setMainDormitory(dorm.dormId)" context="ตั้งเป็นหอพักหลัก"/>
              <WhiteButton @click="dormitoryStore.setSecondaryDormitory(dorm.dormId)" context="ตั้งเป็นหอพักรอง"/>
            </div>
          </div>
            
        </div>

            
        
      </div>
    </div>
    <div v-if="dormitories.length === 0" class="text-2xl text-red-600 text-center">No Dormitory</div>
    

</div>




</div>


  

    
 

  
</template>

<style scoped>
  input[type="radio"] {
    appearance: none; /* ลบสไตล์ดีฟอลต์ของเบราว์เซอร์ */
    width: 1rem;
    height: 1rem;
    border: 2px solid #ccc; /* กำหนดเส้นขอบของวงกลม */
    border-radius: 50%; /* ทำให้เป็นวงกลม */
    outline: none;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
  }

  input[type="radio"]:checked {
    background-color: black; /* สีภายในวงกลมเมื่อถูกเลือก */
    border-color: black; /* เปลี่ยนสีเส้นขอบเมื่อถูกเลือก */
  }

.items{
  display: flex;
  flex-direction: row;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 10px;
  width: 100%; /* ให้เต็มพื้นที่ที่มีอยู่ */
  overflow-wrap: break-word; /* ตัดคำถ้าเกินพื้นที่ */
  
}

.holding-items {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0; /* ให้ขนาดลดลงตามพื้นที่ */
  max-width: 100%; /* ให้ไม่เกินพื้นที่ */
}

/* ภาพพื้นหลังด้านบน */
.background img {
  width: 100%;
  height: 1000px; 
  object-fit: cover; 
}

.item h1 {
  font-size: 1.5rem; /* ขนาดเริ่มต้นสำหรับหน้าจอขนาดเล็ก */
  color: #F4845F;
}

.item h2 {
  font-size: 1rem;
  color: rgb(0, 0, 0);
}

.item h2 span {
  font-size: 0.9rem;
  color: #5d5d5d;
}

.item h3 span {
  font-size: 0.9rem;
  color: #5d5d5d;
}

.item p {
  font-size: 0.9rem;
  color: #5D5D5D;
}

/* สำหรับหน้าจอขนาดกลาง (เช่น Tablet) */
@media (min-width: 640px) {
  .item h1 {
    font-size: 1.75rem;
  }
  
  .item h2 {
    font-size: 1.2rem;
  }
  
  .item h2 span {
    font-size: 1rem;
  }
  
  .item p {
    font-size: 0.8rem;
  }
}

/* สำหรับหน้าจอขนาดใหญ่ (เช่น Desktop) */
@media (min-width: 1024px) {
  .item h1 {
    font-size: 1.rem;
  }
  
  .item h2 {
    font-size: 1.2rem;
  }
  
  .item h2 span {
    font-size: 1.2rem;
  }
  
  .item p {
    font-size: 1rem;
  }
}


hr{
  width: 250px;
}

.filter h2{
  font-size: 1.2rem;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.filter {
  background: white;
  padding: 20px;
  padding-left: 40px;
  border-radius: 8px;
  width: 700px;
  max-width: 100%;
  height: 80%;
  position: relative;
}


@media screen and (max-width: 768px) {
  .filter {
    padding: 20px;
    width: 70%;
    height: 90%;
    font-size: 0.8rem;
  }

  .btn {
    width: 20%;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 คอลัมน์บนขนาดหน้าจอปกติ */
  gap: 16px;
}



.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
}



.table {
  border-collapse: separate; /* ใช้ border-collapse: separate เพื่อให้การโค้งมนทำงาน */
  border-spacing: 0; /* กำหนดระยะห่างระหว่างเซลล์ */
  border-radius: 1rem; /* กำหนดความโค้งมนของตาราง */
  overflow: hidden; /* ป้องกันไม่ให้มุมโค้งมนปรากฏ */
}

.table th, .table td {
  border: 1px solid #ccc; /* กำหนดขอบให้กับ th และ td */
  padding: 12px; /* เพิ่มการเว้นระยะภายใน */
}

/* ปรับปรุงสไตล์ของ th */
.table th {
  background-color: #f2f2f2; /* พื้นหลังสีของ header */
  font-weight: bold; /* ทำให้ตัวหนา */
}

/* ปรับปรุงสไตล์ของ td */
.table td {
  background-color: #fff; /* พื้นหลังสีของเซลล์ */
}

input[type="range"] {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s ease;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #ddd;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  transition: background 0.3s ease;
  /* เลื่อน thumb ขึ้นไปข้างบนเล็กน้อย */
  transform: translateY(-6px); /* ย้าย thumb ขึ้นจาก track */
}

input[type="range"]:hover::-webkit-slider-thumb {
  background: #3d3d3d;
}

input[type="range"]:focus {
  outline: none;
}


.dormname {
  font-size: 1.5rem; /* ขนาดเริ่มต้น */
  color: #F4845F;    /* สีเริ่มต้น */
  transition: transform 0.3s ease, color 0.3s ease; /* เพิ่มการเคลื่อนไหวอย่างนุ่มนวล */
}

.dormname:hover {
  color: #c45830; /* เปลี่ยนสีเมื่อ hover */
  transform: scale(1.02); /* ขยายขนาดข้อความเมื่อ hover */
}

/* ไอคอน*/
.icons img:hover  {
  transform: scale(1.02); /* ขยายขนาดเล็กน้อยเมื่อ hover */
  transition: transform 0.3s ease; /* เพิ่มการขยายขนาดอย่างนุ่มนวล */
}

.hero {
  position: relative;
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  color: #eeeeee;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.7); 
}


.hero .background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  z-index: -1;
}

.hero .hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7); /* Darken the image for better text contrast */
}

.hero-content {
  z-index: 1;
}
</style>
