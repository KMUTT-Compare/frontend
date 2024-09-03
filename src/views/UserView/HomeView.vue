<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// ใช้การตั้งค่า API_ROOT
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


   
            <form class="searchButton mx-auto">   
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input v-model="searchInput" type="search" id="default-search" class="block w-full p-4 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ค้นหาด้วยชื่อ..." required />
                </div>
            </form>


      <section class="w-full h-full flex justify-center">
        <!-- ส่วนที่ 1 -->
          
        <div class="promotion">

          <!-- ส่วนหัวเรื่อง -->
          <div class="title">
            <h1>Promotion</h1>
          </div>

          <!-- ส่วนไอเทม -->
          <div v-if="dormitories !== null || dormitories.length !== 0" class="items">
            <div v-for="dorm in filteredDormitories" :key="dorm.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
             
              <div class="two-items">
              <div class="item-img">
                <img src="@/components/photos/item.svg" alt="Dormitory Image" />
              </div>

                <div class="item" @click="showDetail(dorm.id)">
                    <h1>{{ dorm.name }}</h1>
                    <h2>{{ dorm.min_price }} - {{ dorm.max_price }} <span>บาท/เดือน</span></h2>
                    <p>Location: {{ dorm.location }}</p>
                </div>
              </div>

            </div>
          </div> 
        </div>

        <div v-if="dormitories.length === 0" class="text-2xl text-red-600 text-center">No Dormitory</div>

        <!-- ส่วนที่ 2 -->

      </section>
  

    
 

  
</template>

<style scoped>
.background img {
  width: 100%;
  height: 400px; 
  object-fit: cover; 
}

.container{
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.searchButton{
  margin-top: 20px;
  width: 900px;
}

.promotion {
  width: 900px;
  margin-top: 10px;
}


.title{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title h1 {
  font-size: 60px;
}


.items{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));;
  grid-template-rows: auto;
  column-gap: 30px;
  row-gap: 20px;
  justify-items: center;
  
}

.item-img {
  width: 100%;
  height: 200px; /* ปรับความสูง */
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-img img {
  max-width: 100%;
  height: auto;
}

.two-items:hover {
  transform: scale(1.05); /* ขยายขนาดเล็กน้อยเมื่อ hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
  background-color: #f0f0f0;
  cursor: pointer;
}

.item{
  width: 200px;
  height: 150px;
  padding: 6px;
  
}

.item h1{
  font-size: 20px;
  color:#F4845F
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


.item-img{
  display: flex;
  width: 100%;
  height: 248px;
  justify-content: center;
}

.item-img img{
  display: flex;
  width: fit-content;
  height: fit-content;
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
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 40px;
  padding: 10px; /* เพิ่ม padding ถ้าต้องการ */
  font-size:medium;
  color: rgb(54, 54, 54);
  width: 100%;
  padding: 20px 50px;
  margin: 30px;
  background-color: rgb(255, 255, 255);
  width: 350px;
}

.filter h2{
  font-size: larger;
}


</style>
