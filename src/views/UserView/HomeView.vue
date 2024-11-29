<script setup>
import { ref, onMounted, computed } from 'vue'
import router from '@/router';
import WhiteButton from '@/components/buttons/WhiteButton.vue';
import BlackButton from '@/components/buttons/BlackButton.vue';
import Card from '@/components/Card.vue';
import { getDormitories } from '@/composables/getDormitories';

const dormitories = ref([])

onMounted(async () => {
  dormitories.value = await getDormitories();
  
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

const selectTypes = ref('')


// ตัวแปรที่เก็บค่าที่ผู้ใช้กรอก
const minPrice = ref(0);  // ราคาต่ำสุดเริ่มต้น
const maxPrice = ref(30000);  // ราคาสูงสุดเริ่มต้น

const selectedDistance = ref(0) // เก็บระยะทางที่ผู้ใช้เลือก

const filteredDormitories = computed(() => {
  return dormitories.value.filter(dorm => {
    // กรองตามช่วงราคา
    const inPriceRange = dorm.min_price >= minPrice.value && dorm.max_price <= maxPrice.value;

    // กรองตามประเภทหอพัก
    const typeMatches = dorm.type === selectTypes.value || selectTypes.value === '';

    // กรองตามชื่อหอพัก
    const nameMatches = dorm.name.toLowerCase().includes(searchInput.value.toLowerCase());

    // กรองตามระยะทาง
    let inDistanceRange = false;
    switch (selectedDistance.value) {
      case '1': // น้อยกว่า 1 กม.
        inDistanceRange = dorm.distance < 1;
        break;
      case '2': // 2 -> 3 กม.
        inDistanceRange = dorm.distance >= 2 && dorm.distance < 3;
        break;
      case '3': // 3 -> 4 กม.
        inDistanceRange = dorm.distance >= 3 && dorm.distance < 4;
        break;
      case '4': // 4 -> 5 กม.
        inDistanceRange = dorm.distance >= 4 && dorm.distance < 5;
        break;
      case '5': // 5 กม. ขึ้นไป
        inDistanceRange = dorm.distance >= 5;
        break;
      case '0': // ไม่จำกัด
      default:
        inDistanceRange = true;
        break;
    }

    return inPriceRange && nameMatches && typeMatches && inDistanceRange;
  });
});
// ---------------------------------- เปรียบเทียบหอพัก ----------------------------------
const mainDormitory = ref(null);
const secondaryDormitory = ref(null);

const setMainDormitory = (dormId) => {
  if (secondaryDormitory.value === dormId) {
    secondaryDormitory.value = null; // ลบหอพักรองถ้ามันตรงกับหอพักหลัก
  }
  mainDormitory.value = dormId;
  console.log(mainDormitory.value)
};

const setSecondaryDormitory = (dormId) => {
  if (mainDormitory.value === dormId) {
    mainDormitory.value = null; // ลบหอพักหลักถ้ามันตรงกับหอพักรอง
  }
  secondaryDormitory.value = dormId;
  console.log(secondaryDormitory.value)
};


const compareDormitories = computed(() => {
  const mainDorm = dormitories.value.find(dorm => dorm.dormId === mainDormitory.value);
  const secondaryDorm = dormitories.value.find(dorm => dorm.dormId === secondaryDormitory.value);

  if (!mainDorm || !secondaryDorm) return null;

  const minPrice = mainDorm.min_price !== undefined && secondaryDorm.min_price !== undefined
    ? Math.min(mainDorm.min_price, secondaryDorm.min_price)
    : 'ไม่ระบุ';

  const maxPrice = mainDorm.max_price !== undefined && secondaryDorm.max_price !== undefined
    ? Math.max(mainDorm.max_price, secondaryDorm.max_price)
    : 'ไม่ระบุ';

  const minSize = mainDorm.size !== undefined && secondaryDorm.size !== undefined
    ? Math.min(mainDorm.size, secondaryDorm.size)
    : 'ไม่ระบุ';

  return {
    minprice: {
      main: mainDorm.min_price || 'ไม่ระบุ',
      secondary: secondaryDorm.min_price || 'ไม่ระบุ',
      minPrice: minPrice
    },
    maxprice: {
      main: mainDorm.max_price || 'ไม่ระบุ',
      secondary: secondaryDorm.max_price || 'ไม่ระบุ',
      maxPrice: maxPrice
    },
    size: {
      main: mainDorm.size || 'ไม่ระบุ',
      secondary: secondaryDorm.size || 'ไม่ระบุ',
      minSize: minSize,  // ขนาดห้องน้อยที่สุด
    },
    distance: {
      main: mainDorm.distance || 'ยังไม่มีข้อมูล',
      secondary: secondaryDorm.distance || 'ยังไม่มีข้อมูล',
      better: mainDorm.distance < secondaryDorm.distance ? mainDorm : secondaryDorm
    },
    mainDormRoomFacilities: mainDorm.room_facility || [],
    secondaryDormRoomFacilities: secondaryDorm.room_facility || [],
    mainDormBuildingFacilities: mainDorm.building_facility || [],
    secondaryDormBuildingFacilities: secondaryDorm.building_facility || []
  };
});

// ฟังก์ชันสำหรับแปลง address ให้เป็น string
const formatAddress = (address) => {
  if (typeof address === 'object' && address !== null) {
    // จัดรูปแบบ address ให้เป็น string
    return `${address.dormNumber} ${address.street}, ${address.subdistrict}, ${address.district}, ${address.province}, ${address.postalCode}`;
  }
  return address || 'ยังไม่มีที่อยู่';
}
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
    <div class="w-80">
      <label for="minPrice">ราคาเริ่มต้น: {{ minPrice }} ฿</label>
      <input id="minPrice" type="range" v-model="minPrice" min="0" max="30000" step="100" />

      <label for="maxPrice">ราคาสูงสุด: {{ maxPrice }} ฿</label>
      <input id="maxPrice" type="range" v-model="maxPrice" min="0" max="30000" step="100" />
    </div>

    <div class="mt-4 max-w-72"><hr></div>
    <!-------------------------------- 2 --------------------------------->
    <div class="type">
      <h2 class="my-4">ประเภทหอพัก</h2>
      <div class="flex flex-col space-y-2">
        <!-- ตัวเลือก "ทั้งหมด" -->
          <div class="flex flex-row space-x-2">
          <input v-model="selectTypes" name="default-radio" type="radio" value="" class="mt-1 w-4 h-4 dark:bg-gray-700 dark:border-gray-600">
          <p>ทั้งหมด</p>
        </div>
        <!-- ตัวเลือก "ชาย" -->
        <div class="flex flex-row space-x-2">
          <input v-model="selectTypes" name="default-radio" type="radio" value="m" class="mt-1 w-4 h-4 dark:bg-gray-700 dark:border-gray-600">
          <p>ชาย</p>
        </div>

        <!-- ตัวเลือก "หญิง" -->
        <div class="flex flex-row space-x-2">
          <input v-model="selectTypes" name="default-radio" type="radio" value="f" class="mt-1 w-4 h-4 dark:bg-gray-700 dark:border-gray-600">
          <p>หญิง</p>
        </div>

        <!-- ตัวเลือก "รวม" -->
        <div class="flex flex-row space-x-2">
          <input v-model="selectTypes" checked name="default-radio" type="radio" value="all" class="mt-1 w-4 h-4 dark:bg-gray-700 dark:border-gray-600">
          <p>ไม่แยกชายหญิง</p>
        </div>
      </div>
    </div>

    <div class="mt-4 max-w-72"><hr></div>
      <!-- ตัวกรองระยะทาง -->
      <div class="mt-4">
        <h2 class="my-4">ระยะทาง</h2>
        <label for="distanceSelect">เลือกระยะทาง</label>
        <select id="distanceSelect" v-model="selectedDistance" class="block w-full p-2 mt-2 border rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="0">ไม่จำกัด</option>
          <option value="1">น้อยกว่า 1 กม.</option>
          <option value="2">2 -> 3 กม.</option>
          <option value="3">3 -> 4 กม.</option>
          <option value="4">4 -> 5 กม.</option>
          <option value="5">5 กม. ขึ้นไป</option>
        </select>
      </div>

    <!-------------------------------- 5 --------------------------------->

      <div class="flex justify-end items-end space-x-1 mt-10">
        <button class="btn bg-orange-500 text-white hover:bg-orange-600 px-8" @click="openCloseFilter">ยืนยัน</button>
        <button class="btn bg-zinc-300 text-white hover:bg-zinc-400 px-8" @click="openCloseFilter">ยกเลิก</button>
      </div>

  </div>
</div>


   
<!------------------------------- COMPARE Dormitories ------------------------------->
<div class="w-8/12 flex flex-row justify-between">

<!------------------------------- CARD Dormitories ---------------------------------->
    <div class="w-8/12 flex flex-col items-center justify-center">
      <!-- ส่วนหัวเรื่อง -->
      <div class="text-center py-5 mt-5 text-2xl font-semibold">
          <h2>เลือกเพื่อเปรียบเทียบ</h2>
      </div>

      <div class="flex flex-row items-center w-full justify-around mt-5 h-full pr-2 space-x-2">
        <Card
        title="หอพักหลัก"
        :dormitoryName="mainDormitory ? dormitories.find(dorm => dorm.dormId === mainDormitory).name : 'ยังไม่ได้เลือก'"
        :distance="mainDormitory ? dormitories.find(dorm => dorm.dormId === mainDormitory).distance : 0"
        :address="mainDormitory ? formatAddress(dormitories.find(dorm => dorm.dormId === mainDormitory).address) : ''"
        
      />
      <Card
        title="หอพักรอง"
        :dormitoryName="secondaryDormitory ? dormitories.find(dorm => dorm.dormId === secondaryDormitory).name : 'ยังไม่ได้เลือก'"
        :distance="secondaryDormitory ? dormitories.find(dorm => dorm.dormId === secondaryDormitory).distance : 0"
        :address="secondaryDormitory ? formatAddress(dormitories.find(dorm => dorm.dormId === secondaryDormitory).address) : ''"
      />
      </div>

    </div>


<!--------------------------------- ตารางเปรียบเทียบ --------------------------------->
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
            <td class="border px-4 py-2">ราคาต่ำสุด</td>
            <td class="border px-4 py-2">
              {{ compareDormitories?.minprice.main === Math.min(compareDormitories?.minprice.main, compareDormitories?.minprice.secondary) ? '✔️' : '' }}
              {{ compareDormitories?.minprice.main || 'ยังไม่ได้เลือก' }}
            </td>
            <td class="border px-4 py-2">
              {{ compareDormitories?.minprice.secondary === Math.min(compareDormitories?.minprice.main, compareDormitories?.minprice.secondary) ? '✔️' : '' }}
              {{ compareDormitories?.minprice.secondary || 'ยังไม่ได้เลือก' }}
            </td>
          </tr>

          <tr>
            <td class="border px-4 py-2">ราคาสูงสุด</td>
            <td class="border px-4 py-2">
              {{ compareDormitories?.maxprice.main === Math.min(compareDormitories?.maxprice.main, compareDormitories?.maxprice.secondary) ? '✔️' : '' }}
              {{ compareDormitories?.maxprice.main || 'ยังไม่ได้เลือก' }}
            </td>
            <td class="border px-4 py-2">
              {{ compareDormitories?.maxprice.secondary === Math.min(compareDormitories?.maxprice.main, compareDormitories?.maxprice.secondary) ? '✔️' : '' }}
              {{ compareDormitories?.maxprice.secondary || 'ยังไม่ได้เลือก' }}
            </td>
          </tr>

          <tr>
            <td class="border px-4 py-2">ขนาดห้อง</td>
            <td class="border px-4 py-2">
              {{ compareDormitories?.size.main === Math.max(compareDormitories?.size.main, compareDormitories?.size.secondary) ? '✔️' : '' }}
              {{ compareDormitories?.size.main ? compareDormitories?.size.main + ' ตร.ม.' : 'ยังไม่ได้เลือก' }}
            </td>
            <td class="border px-4 py-2">
              {{ compareDormitories?.size.secondary === Math.max(compareDormitories?.size.main, compareDormitories?.size.secondary) ? '✔️' : '' }}
              {{ compareDormitories?.size.secondary ? compareDormitories?.size.secondary + ' ตร.ม.' : 'ยังไม่ได้เลือก' }} 
            </td>
          </tr>


          
          <tr>
            <td class="border px-4 py-2">สิ่งอำนวยความสะดวกภายในห้อง</td>
            <td class="border px-4 py-2">
            <ul>
              <li v-if="compareDormitories?.mainDormRoomFacilities && compareDormitories.mainDormRoomFacilities.length" 
                  v-for="facility in compareDormitories.mainDormRoomFacilities" :key="facility">
                {{ facility }}
              </li>
              <li v-else>ยังไม่ได้เลือก</li>
            </ul>
          </td>

          <td class="border px-4 py-2">
            <ul>
              <li v-if="compareDormitories?.secondaryDormRoomFacilities && compareDormitories.secondaryDormRoomFacilities.length" 
                  v-for="facility in compareDormitories.secondaryDormRoomFacilities" :key="facility">
                {{ facility }}
              </li>
              <li v-else>ยังไม่ได้เลือก</li>
            </ul>
          </td>
        </tr>
        
        <tr>
          <td class="border px-4 py-2">สิ่งอำนวยความสะดวกภายนอกอาคาร</td>
          <td class="border px-4 py-2">
            <ul>
              <li v-if="compareDormitories?.mainDormBuildingFacilities && compareDormitories.mainDormBuildingFacilities.length"  
                  v-for="facility in compareDormitories?.mainDormBuildingFacilities" :key="facility">
                {{ facility }}
              </li>
              <li v-else>ยังไม่ได้เลือก</li>
            </ul>
          </td>
          <td class="border px-4 py-2">
            <ul>
              <li v-if="compareDormitories?.secondaryDormBuildingFacilities && compareDormitories.secondaryDormBuildingFacilities.length"  
                  v-for="facility in compareDormitories?.secondaryDormBuildingFacilities" :key="facility">
                {{ facility }}
              </li>
              <li v-else>ยังไม่ได้เลือก</li>
            </ul>
          </td>
        </tr>

        </tbody>
      </table>
    </div>
    <!---------------------------------------------------------------------->

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

          <div @click="openCloseFilter" class="icons cursor-pointer px-2"><img src="../../components/icons/filter.png" alt=""></div>
       
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
      <div v-for="dorm in filteredDormitories" :key="dorm.dormId" class="holding-items">
        
        
        <div class="items rounded-lg border-2">
          
          <div class="w-8/12 flex h-64 justify-center items-center">
            <div class="w-full h-full bg-cover bg-center rounded-2xl" :style="{ backgroundImage: `url(${dorm.image[0]})` }" alt="Dormitory Image"></div>
          </div>



          <div class="flex flex-col w-full h-full p-3 justify-center">

            <div class="flex w-full">
              <div class="item">
                <h1 @click="showDetail(dorm.dormId)" class="dormname cursor-pointer">{{ dorm.name }}</h1>
                <h2><span style="color: green; font-size: larger;">{{ dorm.min_price }} - {{ dorm.max_price }}</span> บาท/เดือน</h2>
                <h2>ระยะทาง <span>{{ dorm.distance }} กม.</span></h2>
                <h2>
                  ประเภทหอพัก:
                  <span v-if="dorm.type === 'all'">ไม่แยกชายหญิง</span>
                  <span v-else-if="dorm.type === 'f'">หญิง</span>
                  <span v-else-if="dorm.type === 'm'">ชาย</span>
                  <span v-else>{{ dorm.type }}</span>
                </h2>
                <p class="text-sm">ที่อยู่: {{ dorm.address.street }}, {{ dorm.address.subdistrict }}, {{ dorm.address.district }}, {{ dorm.address.province }} {{ dorm.address.postalCode }}</p>      
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
  height: 200px; 
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
  background: #ff9c4a;
  cursor: pointer;
  transition: background 0.3s ease;
  /* เลื่อน thumb ขึ้นไปข้างบนเล็กน้อย */
  transform: translateY(-6px); /* ย้าย thumb ขึ้นจาก track */
}

input[type="range"]:hover::-webkit-slider-thumb {
  background: #ff7b00;
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

</style>
