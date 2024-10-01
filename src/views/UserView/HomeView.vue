<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFavoriteItem } from '@/stores/favoriteItem'
import router from '@/router';

const API_ROOT = import.meta.env.VITE_API_ROOT
const dormitories = ref([])

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


// ดูรายละเอียดหอพัก
const showDetail = (dormitoryId) =>{
  router.push({
    name : 'dormitoryDetail',
    params : {id : dormitoryId}
  })
}



//---------------------------------- Filter ----------------------------------

const IsfilterShowing = ref(false)

const openCloseFilter=()=>{
  IsfilterShowing.value=!IsfilterShowing.value
}


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



// ---------------------------------- เปรียบเทียบหอพัก ----------------------------------
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



//---------------------------------- pagination ----------------------------------
const currentPage = ref(1);
const itemsPerPage = ref(5); // Adjust the number of items per page as needed

// Calculate total pages
const totalPages = computed(() => Math.ceil(filteredDormitories.value.length / itemsPerPage.value));

// Paginated dormitories
const paginatedDormitories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredDormitories.value.slice(start, end);
});

// Function to change pages
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};


</script>

<template>


    <header>
        <div class="background">
          <img src="@/components/photos/backgroud.svg" alt="">
        </div>
    </header>

    <div class="searchbar">
      <div class="itemsearch">
        <form class="search w-4/5">   
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
        <button @click="openCloseFilter" class="btn px-8 mx-2">การกรอง</button>
      </div>
    </div>

    <div class="flex flex-row w-full h-full">

<!----------------------------------------------------------------->
      <!-- ส่วนซ้าย filter -->
      <div v-show="IsfilterShowing" class="popup-overlay">
        <div class="filter">
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
            <!-- <div class="inside">
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
            </div> -->

            <div class="mt-10 max-w-72"><hr></div>
            <!-------------------------------- 4 --------------------------------->
            <!-- <div class="outside">
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
            </div> -->

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
            <div class="flex justify-end space-x-1 mt-4">
              <button class="btn bg-zinc-300 text-white hover:bg-zinc-400 px-8" @click="openCloseFilter">ยกเลิก</button>
              <button class="btn bg-orange-500 text-white hover:bg-orange-600 px-8" @click="openCloseFilter">ยืนยัน</button>
            </div>
      </div>

            
      </div>







          

<div class="holdingTwoItems">



<!--------------------------- ส่วนกลาง Items -------------------------------------->

    <div class="container">

     <!-- ส่วนไอเทม -->

        <div class="flex flex-row">
          <div v-if="dormitories !== null && dormitories.length !== 0" class="py-2 mx-8 p-2 space-y-3">
            <div v-for="dorm in paginatedDormitories" :key="dorm.id" class="bg-white shadow-lg rounded-lg overflow-hidden w-full shadow-3xl">
              <div class="flex flex-row w-full">
                <div class="bg-red-600 w-72 items-center flex">
                  <img src="@/components/photos/new.svg"  class="object-cover w-full h-full" alt="Dormitory Image" />
                </div> 
                <div class="flex flex-col w-full">
                      <div class="flex w-full items-center cursor-pointer" @click="showDetail(dorm.id)">
                        <div class="item pl-3">
                          <h1>{{ dorm.name }}</h1>
                          <h2>{{ dorm.min_price }} - {{ dorm.max_price }} <span>บาท/เดือน</span></h2>
                          <p>Location: {{ dorm.location }}</p>
                        </div>
                      </div>
              
                  <!-- Button -->
                      <div class="flex w-full justify-center items-center mt-2">
                        <button @click="setMainDormitory(dorm.id)" class="btn btn-sm bg-black text-white hover:bg-zinc-600 text-sm">
                          ตั้งเป็นหอพักหลัก
                        </button>
                        <button @click="setSecondaryDormitory(dorm.id)" class="btn btn-sm bg-white border-2 border-black hover:bg-zinc-300 hover:border-black">
                          ตั้งเป็นหอพักรอง
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
              <div v-if="dormitories.length === 0" class="text-2xl text-red-600 text-center">No Dormitory</div>
          </div>

                <!-- Pagination Controls -->
            <div class="pagination-controls flex justify-center mt-4 space-x-2">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
                Previous
              </button>

              <span>Page {{ currentPage }} of {{ totalPages }}</span>

              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
                Next
              </button>
            </div>

        </div>

  

<!----------------------------------------------------------------->
    <div class="right-area w-full h-full">
      
      <!-- ส่วนหัวเรื่อง -->
      <div class="text-center py-5 mt-5">
          <h2>เลือกเพื่อเปรียบเทียบ</h2>
      </div>

      <div class="flex flex-row justify-center py-5 space-x-10">
          <div class="main-item">หอพักหลัก: <div>{{ mainDormitory ? dormitories.find(dorm => dorm.id === mainDormitory).name : 'ยังไม่ได้เลือก' }}</div></div>
          <div class="main-item">หอพักรอง: <div>{{ secondaryDormitory ? dormitories.find(dorm => dorm.id === secondaryDormitory).name : 'ยังไม่ได้เลือก' }}</div></div>
      </div>

      <div class="flex flex-col items-center">
          <h2 class="m-5">ผลลัพธ์การเปรียบเทียบ</h2>
          <table class="w-full border-collapse">
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
</div>
</div>




</div>


  

    
 

  
</template>

<style scoped>

.searchbar{
padding-top: 1.2rem;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
}

.itemsearch{
  width: 70%;
  display: flex;
  flex-direction: row;
  /* background-color: #5D5D5D; */
  justify-content: center;
  align-items: center;

}

/* ภาพพื้นหลังด้านบน */
.background img {
  width: 100%;
  height: 400px; 
  object-fit: cover; 
}

.holdingTwoItems{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 15%;
  margin-right: 15%;
  /* background-color: #F4845F; */
}


/* กล่องของสองไอเทม */
.main-item{
  background-color: rgb(236, 181, 181);
  width: 15rem;
  height: 15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}

.item h1 {
  font-size: 20px;
  color:#F4845F
}

.item h2{
  font-size: 1.2rem;
  color: black;
}

.item h2 span{
  font-size: 1rem;
  color: #5D5D5D;
}
.item p{
  font-size: 1rem;
  color:#5D5D5D
}


.price-select {
  padding: 8px;
  border: 2px solid #ccc; 
  box-sizing: border-box; 
  cursor: pointer;
  width: 250px;
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
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
}

.container{
  padding-top: 1.2rem;
  display: flex;
  flex-direction: column;
  /* background-color: aqua; */
}

.right-area{
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: rgb(171, 255, 183); */
  padding-top: 1.2rem;
  font-size: 1rem;
}

.right-area h2{
  font-size: 1.2rem;
  font-weight: 500;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


</style>
