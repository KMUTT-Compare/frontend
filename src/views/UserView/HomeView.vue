<script setup>
import { ref, onMounted, computed } from 'vue'
import router from '@/router';
import WhiteButton from '@/components/WhiteButton.vue';
import BlackButton from '@/components/BlackButton.vue';
import Card from '@/components/Card.vue';
import { getDormitories } from '@/composables/getDormitories';

const dormitories = ref([])

onMounted(async () => {
  dormitories.value = await getDormitories();
  console.log(dormitories.length)
  console.log(dormitories.value)
})


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
const itemsPerPage = ref(6); // Adjust the number of items per page as needed

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



    <div class="w-full h-full flex flex-col justify-center items-center">

 <!-- filter -->
<div v-show="IsfilterShowing" class="popup-overlay">
  <div class="filter">
    <!-------------------------------- 1 --------------------------------->
    <div class="price">
      <h2 class="my-2">ช่วงราคา</h2>
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

    <div class="mt-4 max-w-72"><hr></div>
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

    <div class="mt-4 max-w-72"><hr></div>

    <!-- แบ่งเป็น Grid (2 คอลัมน์) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-------------------------------- 3 --------------------------------->
      <div class="inside">
        <h2 class="my-4">สิ่งอำนวยความสะดวก ภายในห้อง</h2>
        <div class="flex flex-col space-y-2">
          <div class="flex flex-row space-x-2">
            <input v-model="selectedRoom.hotWater" type="checkbox" class="checkbox" />
            <p>เครื่องทำน้ำอุ่น</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedRoom.washer" type="checkbox" class="checkbox" />
            <p>เครื่องซักผ้า</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedRoom.airConditioner" type="checkbox" class="checkbox" />
            <p>เครื่องปรับอากาศ</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedRoom.tv" type="checkbox" class="checkbox" />
            <p>ทีวี</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedRoom.fridge" type="checkbox" class="checkbox" />
            <p>ตู้เย็น</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedRoom.wifi" type="checkbox" class="checkbox" />
            <p>อินเทอร์เน็ต/Wi-Fi ในห้อง</p>
          </div>
        </div>
      </div>

      <!-------------------------------- 4 --------------------------------->
      <div class="outside">
        <h2 class="my-4">สิ่งอำนวยความสะดวก ในอาคาร</h2>
        <div class="flex flex-col space-y-2">
          <div class="flex flex-row space-x-2">
            <input v-model="selectedBuilding.keycard" type="checkbox" class="checkbox" />
            <p>มีประตูระบบ Keycard</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedBuilding.security" type="checkbox" class="checkbox" />
            <p>ยามรักษาความปลอดภัย</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedBuilding.cctv" type="checkbox" class="checkbox" />
            <p>กล้องวงจรปิด (CCTV)</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedBuilding.bikeParking" type="checkbox" class="checkbox" />
            <p>ที่จอดรถมอเตอร์ไซด์/จักรยาน</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedBuilding.carParking" type="checkbox" class="checkbox" />
            <p>ที่จอดรถยนต์</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedBuilding.pool" type="checkbox" class="checkbox" />
            <p>สระว่ายน้ำ</p>
          </div>
          <div class="flex flex-row space-x-2">
            <input v-model="selectedBuilding.elevator" type="checkbox" class="checkbox" />
            <p>ลิฟต์</p>
          </div>
        </div>
      </div>

    </div>

    <div class="mt-4 max-w-72"><hr></div>

    <!-------------------------------- 5 --------------------------------->
    <div class="other">
      <h2 class="my-4">อื่นๆ</h2>
      <div class="flex flex-col space-y-2">
        <div class="flex flex-row space-x-2">
          <input v-model="selectedOther.petsAllowed" type="checkbox" class="checkbox" />
          <p>อนุญาตให้เลี้ยงสัตว์</p>
        </div>
        <div class="flex flex-row space-x-2">
          <input v-model="selectedOther.smokingAllowed" type="checkbox" class="checkbox" />
          <p>อนุญาตให้สูบบุหรี่ในห้องพัก</p>
        </div>
      </div>
          <div class="flex justify-end items-end space-x-1 mt-4">
        <button class="btn bg-orange-500 text-white hover:bg-orange-600 px-8" @click="openCloseFilter">ยืนยัน</button>
        <button class="btn bg-zinc-300 text-white hover:bg-zinc-400 px-8" @click="openCloseFilter">ยกเลิก</button>
    </div>
    </div>


  </div>
</div>


   

<div class="w-8/12 flex flex-row justify-between">

<!----------------------------------------------------------------->
    <div class="w-8/12 flex flex-col items-center justify-center">
      <!-- ส่วนหัวเรื่อง -->
      <div class="text-center py-5 mt-5 text-2xl font-semibold">
          <h2>เลือกเพื่อเปรียบเทียบ</h2>
      </div>

      <div class="flex flex-row items-center w-full justify-around mt-5 h-full pr-2 space-x-2">
        <Card title="หอพักหลัก:" :dormitoryName="mainDormitory ? dormitories.find(dorm => dorm.id === mainDormitory).name : ''" />
        <Card title="หอพักรอง:" :dormitoryName="secondaryDormitory ? dormitories.find(dorm => dorm.id === secondaryDormitory).name : ''" />
      </div>

    </div>



    <div class="w-8/12 flex flex-col items-center">
  <div class="text-center py-5 mt-5 text-2xl font-semibold">
    <h2>ตารางเปรียบเทียบ</h2>
  </div>

  <table class="table w-full mt-5 h-full">
    <thead>
      <tr>
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





<!--------------------------- Search Button -------------------------------------->
   
      <div class="flex flex-row w-8/12 justify-center items-center mt-5">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input v-model="searchInput" type="search" id="default-search" class="block w-full p-4 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ค้นหาหอพัก..." required />
          </div>
          <div @click="openCloseFilter" class="cursor-pointer p-2"><img src="../../components/icons/filter.png" alt=""></div>
       
            <div class="max-w-sm mx-auto">
              <select id="countries" class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>เรียงโดย: ราคาต่ำสุด</option>
                <option value="US">ราคาสูงสุด</option>
                <option value="CA">ระยะทาง</option>
              </select>
            </div>

      </div>   



<div class="w-8/12  flex flex-col items-center mt-5">

  <!-- ส่วนไอเทม -->
    <div v-if="dormitories !== null && dormitories.length !== 0" class="container">
      <div v-for="dorm in dormitories" :key="dorm.dormId" class="holding-items">
        
        
        <div class="items rounded-lg border-2">
          
          <div class="w-8/12">
            <img src="@/components/photos/new.svg" class="object-cover h-full rounded-2xl" alt="Dormitory Image" />
          </div>



          <div class="flex flex-col w-full h-full p-3 justify-center">

            <div class="flex w-full cursor-pointer" @click="showDetail(dorm.dormId)">
              <div class="item">
                <h1>{{ dorm.name }}</h1>
                <h2>{{ dorm.min_price }} - {{ dorm.max_price }} <span>บาท/เดือน</span></h2>
                <p>ที่อยู่: {{ dorm.address.street }}, {{ dorm.address.subdistrict }}, {{ dorm.address.district }}, {{ dorm.address.province }} {{ dorm.address.postalCode }}</p>      
              </div>
            </div>


            <!-- Button -->
          <div class="flex justify-around space-x-2 mt-2 items-center">
            <BlackButton @click="setMainDormitory(dorm.dormId)" context="ตั้งเป็นหอพักหลัก"/>
            <WhiteButton @click="setSecondaryDormitory(dorm.dormId)" context="ตั้งเป็นหอพักรอง"/>
          </div>



          </div>
            
          </div>

            
        
      </div>
    </div>
    <div v-if="dormitories.length === 0" class="text-2xl text-red-600 text-center">No Dormitory</div>

  <!-- Pagination Controls -->
  <div class="pagination-controls flex justify-center mt-10 space-x-2">
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
      Previous
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
      Next
    </button>
  </div>

</div>




</div>


  

    
 

  
</template>

<style scoped>
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
  height: 400px; 
  object-fit: cover; 
}

.item h1 {
  font-size: 1.5rem; /* ขนาดเริ่มต้นสำหรับหน้าจอขนาดเล็ก */
  color: #F4845F;
}

.item h2 {
  font-size: 1rem;
  color: black;
}

.item h2 span {
  font-size: 0.9rem;
  color: #5D5D5D;
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
  padding-left: 40px;
  border-radius: 8px;
  width: 700px;
  max-width: 100%;
  height: 95%;
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

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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


</style>
