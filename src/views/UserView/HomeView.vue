<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFavoriteItem } from '@/stores/favoriteItem'
import router from '@/router';

// ใช้การตั้งค่า API_ROOT
const API_ROOT = import.meta.env.VITE_API_ROOT
const dormitories = ref([])

// สถานะของหอพักหลักและรอง
const mainDormitory = ref(null);
const secondaryDormitory = ref(null);

const setMainDormitory = (dormId) => {
  if (secondaryDormitory.value === dormId) {
    secondaryDormitory.value = null; // ลบหอพักรองถ้ามันตรงกับหอพักหลัก
  }
  mainDormitory.value = dormId;
};

const setSecondaryDormitory = (dormId) => {
  if (mainDormitory.value === dormId) {
    mainDormitory.value = null; // ลบหอพักหลักถ้ามันตรงกับหอพักรอง
  }
  secondaryDormitory.value = dormId;
};


// const compareDormitories = computed(() => {
//   const mainDorm = mainDormitory.value
//   const secondaryDorm = secondaryDormitory.value

//   if (!mainDorm || !secondaryDorm) return null;

//   return {
//     price: {
//       main: mainDorm.max_price,
//       secondary: secondaryDorm.max_price,
//       better: mainDorm.max_price < secondaryDorm.max_price ? mainDorm.max_price : secondaryDorm.max_price
//     }
//   };
// });

const getFacilitiesDisplay = (mainFacilities, secondaryFacilities) => {
  const allFacilities = new Set([...Object.keys(mainFacilities), ...Object.keys(secondaryFacilities)]);
  const display = {};

  allFacilities.forEach(facility => {
    display[facility] = {
      main: mainFacilities[facility] ? '✔️' : '❌',
      secondary: secondaryFacilities[facility] ? '✔️' : '❌'
    };
  });

  return display;
};

const compareDormitories = computed(() => {
  const mainDorm = dormitories.value.find(dorm => dorm.id === mainDormitory.value);
  const secondaryDorm = dormitories.value.find(dorm => dorm.id === secondaryDormitory.value);

  if (!mainDorm || !secondaryDorm) return null;

  const facilitiesDisplay = getFacilitiesDisplay(mainDorm.room_facilities || {}, secondaryDorm.room_facilities || {});

  return {
    price: {
      main: mainDorm.max_price,
      secondary: secondaryDorm.max_price,
      better: mainDorm.max_price < secondaryDorm.max_price ? mainDorm : secondaryDorm
    },
    size: {
      main: mainDorm.size || 'ไม่ระบุ',
      secondary: secondaryDorm.size || 'ไม่ระบุ'
    },
    facilities: facilitiesDisplay
  };
});



onMounted(async () => {
   await getDormitories();
})

// ฟังก์ชันสำหรับดึงข้อมูล
const getDormitories = async () => {
  try {
    const res = await fetch(`${API_ROOT}/dormitories`); // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง
    if (res.ok) {
      dormitories.value = await res.json();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}



//ตัวแปร Filter
const searchInput = ref('')

const selectTypes = ref('รวม')

const selectedRoom = ref({
  hotWater: false,
  washer: false,
  airConditioner: false,
  tv: false,
  fridge: false,
  wifi: false
});

const selectedBuilding = ref({
  keycard: false,
  security: false,
  cctv: false,
  bikeParking: false,
  carParking: false,
  pool: false,
  elevator: false
});

const selectedOther = ref({
  petsAllowed: false,
  smokingAllowed: false
});

const selectPriceRange = ref('');

const filteredDormitories = computed(() => {
  let minPrice = 0
  let maxPrice = Infinity

  switch (selectPriceRange.value) {
    case 'below-1000':
      maxPrice = 1000
      break
    case '1000-3000':
      minPrice = 1000
      maxPrice = 3000
      break
    case '3000-5000':
      minPrice = 3000
      maxPrice = 5000
      break
    case 'above-5000':
      minPrice = 5000
      break
  }

  return dormitories.value.filter(dorm => {
    // กรองตามช่วงราคา
    const inPriceRange = dorm.min_price >= minPrice && dorm.max_price <= maxPrice

    // กรองตามประเภทหอพัก
    const typeMatches = dorm.type === selectTypes.value

     const nameMatches = dorm.name.toLowerCase().includes(searchInput.value.toLowerCase())

    return inPriceRange && typeMatches && nameMatches
  })
})


const favorite = useFavoriteItem()
const switchFavorite = (id) =>{
  favorite.toggleFavorite(id)
}



const showDetail = (dormitoryId) =>{
  router.push({
    name : 'dormitoryDetail',
    params : {id : dormitoryId}
  })
}


</script>

<template>


    <header>
        <div class="background">
          <img src="@/components/photos/backgroud.svg" alt="">
        </div>
    </header>

    <div class="flex flex-row">

<!----------------------------------------------------------------->
      <!-- ส่วนซ้าย filter -->
      <div class="filter">
        <div class="pl-20">
            <!-------------------------------- 1 --------------------------------->
            <div class="price">
              <h2 class="my-4">ช่วงราคา</h2>
              <div class="relative">
                <select class="price-select" v-model="selectPriceRange">
                  <option value="">เลือกช่วงราคา</option>
                  <option value="below-1000">ต่ำกว่า 1,000 บาท</option>
                  <option value="1000-3000">1,000 - 3,000 บาท</option>
                  <option value="3000-5000">3,000 - 5,000 บาท</option>
                  <option value="above-5000">มากกว่า 5,000 บาท</option>
                </select>
              </div>
            </div>

            <div class="mt-10 max-w-72"><hr></div>
            <!-------------------------------- 2 --------------------------------->
            <div class="type">
              <h2 class="my-4">ประเภทหอพัก</h2>
              <div class="flex flex-col space-y-2">
                <!-- ตัวเลือก "ชาย" -->
                <div class="flex flex-row space-x-2">
                  <input v-model="selectTypes" name="default-radio" type="radio" value="ชาย" class="mt-1 w-4 h-4 dark:bg-gray-700 dark:border-gray-600">
                  <p>ชาย</p>
                </div>
                
                <!-- ตัวเลือก "หญิง" -->
                <div class="flex flex-row space-x-2">
                  <input v-model="selectTypes" name="default-radio" type="radio" value="หญิง" class="mt-1 w-4 h-4 dark:bg-gray-700 dark:border-gray-600">
                  <p>หญิง</p>
                </div>
                
                <!-- ตัวเลือก "รวม" -->
                <div class="flex flex-row space-x-2">
                  <input v-model="selectTypes" checked name="default-radio" type="radio" value="รวม" class="mt-1 w-4 h-4 dark:bg-gray-700 dark:border-gray-600">
                  <p>รวม</p>
                </div>
              </div>
            </div>



            <div class="mt-10 max-w-72"><hr></div>
            <!-------------------------------- 3 --------------------------------->
            <div class="inside">
              <h2 class="my-4">สิ่งอำนวยความสะดวก ภายในห้อง</h2>
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedRoom.hotWater" type="checkbox" class="checkbox"/>
                    <p>เครื่องทำน้ำอุ่น</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedRoom.washer" type="checkbox" class="checkbox"/>
                    <p>เครื่องซักผ้า</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedRoom.airConditioner" type="checkbox" class="checkbox"/>
                    <p>เครื่องปรับอากาศ</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedRoom.tv" type="checkbox" class="checkbox"/>
                    <p>ทีวี</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedRoom.fridge"  type="checkbox" class="checkbox"/>
                    <p>ตู้เย็น</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedRoom.wifi" type="checkbox" class="checkbox"/>
                    <p>อินเทอร์เน็ต/Wi-Fi ในห้อง</p>
                </div>
              </div>
            </div>

            <div class="mt-10 max-w-72"><hr></div>
            <!-------------------------------- 4 --------------------------------->
            <div class="outside">
              <h2 class="my-4">สิ่งอำนวยความสะดวก ในอาคาร</h2>
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedBuilding.keycard" type="checkbox" class="checkbox"/>
                    <p>มีประตูระบบ Keycard</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedBuilding.security" type="checkbox" class="checkbox"/>
                    <p>ยามรักษาความปลอดภัย</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedBuilding.cctv" type="checkbox" class="checkbox"/>
                    <p>กล้องวงจรปิด (CCTV)</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedBuilding.bikeParking" type="checkbox" class="checkbox"/>
                    <p>ที่จอดรถมอเตอร์ไซด์/จักรยาน</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedBuilding.carParking" type="checkbox" class="checkbox"/>
                    <p>ที่จอดรถยนต์</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedBuilding.pool" type="checkbox" class="checkbox"/>
                    <p>สระว่ายน้ำ</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedBuilding.elevator" type="checkbox" class="checkbox"/>
                    <p>ลิฟต์</p>
                </div>
            </div>
            </div>

            <div class="mt-10 max-w-72"><hr></div>
            <!-------------------------------- 5 --------------------------------->
            <div class="other">
              <h2 class="my-4">อื่นๆ</h2>
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedOther.petsAllowed" type="checkbox" class="checkbox"/>
                    <p>อนุญาตให้เลี้ยงสัตว์</p>
                </div>
                <div class="flex flex-row space-x-2">
                    <input v-model="selectedOther.smokingAllowed" type="checkbox" class="checkbox"/>
                    <p>อนุญาตให้สูบบุหรี่ในห้องพัก</p>
                </div>
              </div>
            </div>
      </div>
            
          </div>



<!----------------------------------------------------------------->

    <!-- ส่วนกลาง Items -->
      <div class="container">

          <!-- ส่วนหัวเรื่อง -->
          <div class="text-4xl text-center py-5 mt-5 font-semibold">
            <h1>เลือกเพื่อเปรียบเทียบ</h1>
          </div>

          <div class="compare py-5 space-x-32 text-2xl">
            <div class="main-item">หอพักหลัก: <div>{{ mainDormitory ? dormitories.find(dorm => dorm.id === mainDormitory).name : 'ยังไม่ได้เลือก' }}</div></div>
            <div class="main-item">หอพักรอง: <div>{{ secondaryDormitory ? dormitories.find(dorm => dorm.id === secondaryDormitory).name : 'ยังไม่ได้เลือก' }}</div></div>
          </div>

          <div class="comparison-results">
          <h2 class="text-2xl font-semibold m-5">ผลลัพธ์การเปรียบเทียบ</h2>
          <table class="w-full border-collapse text-xl">
            <thead>
              <tr class="bg-gray-200">
                <th class="border px-4 py-2">คุณสมบัติ</th>
                <th class="border px-4 py-2">หอพักหลัก</th>
                <th class="border px-4 py-2">หอพักรอง</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border px-4 py-2">ราคา</td>
                <td class="border px-4 py-2">{{ compareDormitories?.price.main || 'ยังไม่ได้เลือก' }}</td>
                <td class="border px-4 py-2">{{ compareDormitories?.price.secondary || 'ยังไม่ได้เลือก' }}</td>
              </tr>
              <tr>
                <td class="border px-4 py-2">ขนาดห้อง</td>
                <td class="border px-4 py-2">{{ compareDormitories?.size.main || 'ยังไม่ได้เลือก' }}</td>
                <td class="border px-4 py-2">{{ compareDormitories?.size.secondary || 'ยังไม่ได้เลือก' }}</td>
              </tr>
              <tr>
                <td class="border px-4 py-2">สิ่งอำนวยความสะดวก</td>
                <td class="border px-4 py-2">
                  <ul>
                    <li v-for="(status, key) in compareDormitories?.facilities" :key="key">
                      {{ key }}: {{ status.main }}
                    </li>
                  </ul>
                </td>
                <td class="border px-4 py-2">
                  <ul>
                    <li v-for="(status, key) in compareDormitories?.facilities" :key="key">
                      {{ key }}: {{ status.secondary }}
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
       </div>

          <!-- ส่วนที่ 1 -->

        </div>

  

<!----------------------------------------------------------------->
<div class="right-area w-full h-full">
  
  <form class="px-8 w-full py-3">   
      <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
         <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input v-model="searchInput" type="search" id="default-search" class="block w-full p-4 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ค้นหาหอพัก..." required />
         </div>
  </form>
  
     <!-- ส่วนไอเทม -->

     <div class="flex flex-row">
      <div v-if="dormitories !== null && dormitories.length !== 0" class="items py-2 mx-8">
        <div v-for="dorm in filteredDormitories" :key="dorm.id" class="bg-white shadow-lg rounded-lg overflow-hidden w-full shadow-3xl">

          <div class="flex flex-row w-full">
            <div class="bg-red-600 w-72 items-center flex">
              <img src="@/components/photos/new.svg"  class="object-cover w-full h-full" alt="Dormitory Image" />
            </div> 
            <div class="flex flex-col w-full">
                  <div class="flex w-full justify-center items-center">
                    <div class="item">
                      <h1>{{ dorm.name }}</h1>
                      <h2>{{ dorm.min_price }} - {{ dorm.max_price }} <span>บาท/เดือน</span></h2>
                      <p>Location: {{ dorm.location }}</p>
                    </div>
                  </div>
          
              <!-- Button -->
                  <div class="flex w-full justify-center items-center p-2">
                    <button @click="setMainDormitory(dorm.id)" class="btn bg-black text-white hover:bg-zinc-600">
                      ตั้งเป็นหอพักหลัก
                    </button>
                    <button @click="setSecondaryDormitory(dorm.id)" class="btn bg-white border-2 border-black hover:bg-zinc-300 hover:border-black">
                      ตั้งเป็นหอพักรอง
                    </button>
                </div>
          </div>
          </div>
          


        </div>
      </div>

      <div v-if="dormitories.length === 0" class="text-2xl text-red-600 text-center">No Dormitory</div>

     </div>

</div>


</div>


  

    
 

  
</template>

<style scoped>


/* ภาพพื้นหลังด้านบน */


.background img {
  width: 100%;
  height: 400px; 
  object-fit: cover; 
}


.compare{
  display: flex;
  flex-direction: row;
  /* background-color: #fd6e6e; */
  justify-content: center;
}

.comparison-results {
  padding-left: 8.2rem;
  padding-right: 8.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: rgb(171, 255, 183); */
}

.container{
  display: flex;
  flex-direction: column;
  width: 50%;
  /* background-color: aqua; */
}

.items {
  display: grid;
  grid-template-columns: repeat(1, minmax(200px, 1fr));
  grid-template-rows: auto;
  column-gap: 20px;
  row-gap: 10px;
  justify-items: center;
  width: 88%;
}

.item {
  flex: 1; /* Allow the item to take the remaining space */
  padding: 10px;
}

.main-item{
  background-color: rgb(230, 230, 230);
  width: 20rem;
  height: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
}


.searchButton{
  margin-left: 2rem; /* 32px */
  margin-right: 2rem; /* 32px */
}




.title h1 {
  font-size: 60px;
}


.title2{
  font-size: 60px;
  padding-left:7%;
}


/* Responsive adjustments */

@media (max-width: 1600px) {
  .items {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
  }

  .filter {
    padding-top: 1rem; /* ลดขนาดการเติมช่องว่าง */
  }

  .right-area {
    padding-right: 0.5rem; /* ลดการเติมช่องว่างด้านขวา */
  }
}

@media (max-width: 1500px) {
  .items {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
  .filter {
    font-size: 0.875rem; /* ลดขนาดฟอนต์ */
    padding-top: 0.75rem; /* ลดการเติมช่องว่างด้านบน */
  }

  .right-area {
    padding-right: 0.5rem;
  }
}

@media (max-width: 900px) {
  .items {
    grid-template-columns: 1fr;
  }
  .filter {
    font-size: 0.75rem; /* ลดขนาดฟอนต์อีกครั้งสำหรับหน้าจอที่เล็กมาก */
    padding-top: 0.5rem; /* ลดการเติมช่องว่างด้านบน */
    width: 100px;
    background-color: red;
  }

  .right-area {
    padding-right: 0.25rem; /* ลดการเติมช่องว่างด้านขวา */
    align-items: flex-start; /* ปรับการจัดตำแหน่งให้เหมาะสมกับหน้าจอเล็ก */
  }
}



/* ดาว */
.star:hover {
  transform: scale(1.08); /* ขยายขนาดเล็กน้อยเมื่อ hover */
  cursor: pointer;
}


.item h1{
  font-size: 20px;
  /* color:#F4845F */
}

.item h2{
  font-size: 20px;
  color: black;
}

.item h2 span{
  font-size: 14px;
  color: #5D5D5D;
}
.item p{
  font-size: 14px;
  color:#5D5D5D
}


.price-select {
  padding: 8px;
  border: 2px solid #ccc; /* Border ขนาดที่ต้องการ */
  box-sizing: border-box; /* ทำให้ padding และ border อยู่ในขนาดของ width */
  cursor: pointer;
  width: 250px;
}

hr{
  width: 250px;
}

.filter {
  color: rgb(54, 54, 54);
  /* background-color: #F4845F; */
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  width: 25%;
  align-items: center;
}

.filter h2{
  font-size: 1.4rem;
}

.right-area{
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: rgb(171, 255, 183); */
  padding-top: 1.5rem;
  width: 25%
}


</style>
