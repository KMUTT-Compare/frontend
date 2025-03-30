<script setup>
import Sidebar from '@/components/Sidebar.vue';
import { getUserDorm } from '@/composables/GetDormitories/getUserDorm';
import { onMounted, ref, computed } from 'vue';
import router from '@/router';
import DeleteModal from '@/components/modals/ConfirmModal.vue';
import SuccessModal from '@/components/modals/SuccessModal.vue';
import { formatPrice } from '@/composables/formatPrice';
import SortComponent from '@/components/filters/SortComponent.vue';
import SearchComponent from '@/components/filters/SearchComponent.vue';
import BorderButton from '@/components/buttons/BorderButton.vue';



const API_ROOT = import.meta.env.VITE_API_ROOT;
const dormitories = ref([]);
const isModalVisible = ref(false);
const dormIdToDelete = ref(null);

onMounted(async () => {
  dormitories.value = await getUserDorm();
});

const showDetail = (dormitoryId) => {
  router.push({
    name: 'dormitoryDetail',
    params: { id: dormitoryId }
  });
};


//---------------------------------- Search ----------------------------------
const searchInput = ref('');

const filteredDormitories = computed(() => {
  if (!searchInput.value) return dormitories.value;

  const searchTerm = searchInput.value.toLowerCase();
  return dormitories.value.filter(dorm =>
    dorm.dormName.toLowerCase().includes(searchTerm) ||
    dorm.address.street.toLowerCase().includes(searchTerm) ||
    dorm.address.subdistrict.toLowerCase().includes(searchTerm) ||
    dorm.address.district.toLowerCase().includes(searchTerm) ||
    dorm.address.province.toLowerCase().includes(searchTerm)
  );
});


//---------------------------------- Manage ----------------------------------

const editDormitory = (dormitoryId) => {
  router.push({
    name: 'addEditDormitory',
    params: { id: dormitoryId }
  });
};

const showDeleteModal = (dormId) => {
  dormIdToDelete.value = dormId;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalOpen.value = false
  isModalVisible.value = false;
  dormIdToDelete.value = null;
};

const isModalOpen = ref(false);
const modalData = ref({ title: '', message: '', context: '' });

const deleteDormitory = async () => {

  if (dormIdToDelete.value) {
    try {
      const res = await fetch(`${API_ROOT}/dormitories/${dormIdToDelete.value}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'DELETE'
      });

      if (res.ok) {
        dormitories.value = await getUserDorm();  // ดึงข้อมูลใหม่หลังการลบ
        closeModal(); 
        modalData.value = {
          title: 'ลบหอพักสำเร็จ',
          message: 'ข้อมูลหอพักถูกลบเรียบร้อยแล้ว.',
          context: 'delete'
        };
          isModalOpen.value = true;
          dormitories.value = await getUserDorm();
      } else {
        alert(`There are no dormitory with id = ${dormIdToDelete.value}`);
        throw new Error('Cannot delete data!');
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  }
};

// Reactive state
const isInputEmailPopup = ref(false)
const email = ref('')
const isAgreed = ref(false)

// Function to show the popup
const transferDorm = () => {
  isInputEmailPopup.value = true
}

// Function to close the popup
const closePopup = () => {
  isInputEmailPopup.value = false
}

// Function to handle the form submission
const submitTransfer = async () => {
  if (email.value && isAgreed.value) {

    try {
      // Send data to backend using fetch
      const response = await fetch(`${API_ROOT}/user/dormitory/change-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: email.value })
      })

      if(response.ok){
        closePopup()
        modalData.value = {
          title: 'โอนย้ายหอพักสำเร็จ',
          message: `หอพักถูกโอนย้ายไปยัง ${email.value} เรียบร้อยแล้ว`,
          context: 'transfer'
        };
        isModalOpen.value = true;
        dormitories.value = getUserDorm()
      }

      else if(!response.ok) {
      if (response.status === 403) {
        alert('ไม่มีผู้ใช้ Email นี้อยู่ในระบบ');
      } else {
        throw new Error('การส่งข้อมูลไม่สำเร็จ');
      }
    }


    } catch (error) {
      // Handle errors
      // console.error('Error:', error)
    }
  } else {
    alert('กรุณากรอกอีเมลและยอมรับข้อตกลง')
  }
}


</script>

<template>
  <div class="flex flex-row w-full justify-center p-20">
    <Sidebar />

    <div class="pl-2 w-1/2 h-full flex rounded-xl">
      <div class="w-full flex flex-col items-center justify-center">

        <div class="flex flex-row items-center w-full space-x-2 mb-2">
          
          <SearchComponent v-model="searchInput"/>
          <div class="w-40">
            <SortComponent :dormitories="dormitories" />
          </div>
        </div>
        <div v-if="filteredDormitories?.length > 0" class="container">
          <div v-for="dorm in filteredDormitories" :key="dorm.dormId" class="holding-items">
            <div class="items rounded-lg border-2">
              <div class="w-8/12 h-62 flex h-full justify-center items-center">
                <img :src="dorm.image[0] || '/images/no_image.jpg'" class="h-full bg-cover bg-center rounded-lg" alt="Dormitory Image" />
              </div>

              <div class="flex flex-col w-full h-full p-3 justify-center">
                <div class="item">
                  <div class="icons flex flex-row justify-between items-center">
                    <!-- ชื่อหอพัก -->
                    <div class="flex justify-start w-full">
                      <h1 class="cursor-pointer" @click="showDetail(dorm.dormId)">{{ dorm.dormName }}</h1>
                    </div>

                    <!-- ไอคอน Edit -->
                    <div  @click="editDormitory(dorm.dormId)" class="flex-shrink-0 cursor-pointer">
                      <img src="../../../components/icons/edit.png" alt="Edit Icon" />
                    </div>
                    
                    <!-- ไอคอน Trash -->
                    <div @click="showDeleteModal(dorm.dormId)" class="flex-shrink-0 cursor-pointer">
                      <img src="../../../components/icons/trash.png" alt="Trash Icon" />
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
                  <p>ที่อยู่: {{ dorm.address.street }}, {{ dorm.address.subdistrict }}, {{ dorm.address.district }}, {{ dorm.address.province }} {{ dorm.address.postalCode }}</p>
                  <BorderButton @click="transferDorm(dorm.dormId)" class="mt-4" context="โอนย้ายหอพัก"/>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <div v-if="dormitories.length === 0" class="text-center text-gray-600 mt-5">ยังไม่มีหอพักที่ประกาศไว้</div>
      </div>
    </div>
  </div>

  <!-- Modal for deletion -->
    <!-- DeleteModal for deletion -->
    <DeleteModal 
    :isVisible="isModalVisible" 
    :dormId="dormIdToDelete" 
    @close="closeModal" 
    @delete="deleteDormitory" 
    context="delete" 
  />

  <SuccessModal 
    v-if="isModalOpen" 
    :title="modalData.title" 
    :message="modalData.message" 
    :context="modalData.context" 
    @close="closeModal"
/>


  <!-- Popup for email input -->
  <div v-if="isInputEmailPopup" class="popup-overlay">
  <div class="popup space-y-3">
    <!-- Header Section -->
    <h3 class="text-lg font-semibold">โปรดระบุอีเมลผู้รับโอนเพื่อโอนย้ายเจ้าของหอพัก</h3>
    
    <!-- Email Input Section -->
    <div>
      <input class="w-full my-2 rounded-sm" v-model="email" type="email" placeholder="กรอกอีเมล" />
    </div>


<!-- Agreement Section with scrollable content -->
<div class="agreement-container space-y-2" style="max-height: 400px; overflow-y: auto; padding: 10px; border: 1px solid #ddd;">
  <p><strong>รายละเอียดข้อตกลง:</strong></p>
  <p>1.ผู้โอนสามารถดำเนินการโอนย้ายเจ้าของหอพักได้โดยไม่ต้องได้รับความยินยอมจากผู้รับโอน</p>
  <p>2.ผู้โอนต้องตรวจสอบและยืนยันข้อมูลให้ถูกต้องก่อนโอนย้าย</p>
  <p>3.เมื่อโอนย้ายเสร็จสมบูรณ์ ผู้โอนต้องรับผิดชอบหากเกิดปัญหาหรือข้อผิดพลาดจากการโอนย้าย</p>
  <!-- เพิ่มเนื้อหาต่อได้ตามต้องการ -->
</div>


    <!-- Agreement Checkbox Section -->
    <div>
      <input v-model="isAgreed" type="checkbox" id="agreement" />
      <label for="agreement" class="pl-2">ยอมรับข้อตกลง</label>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-row justify-between">
      <button class="btn px-10 bg-orange-500 text-white hover:bg-orange-600 cursor-pointer" @click="submitTransfer">ยืนยัน</button>
      <button class="btn px-10 bg-gray-200 cursor-pointer hover:bg-gray-300" @click="isInputEmailPopup=false">ยกเลิก</button>
    </div>
  </div>
</div>

  
</template>

 
<style scoped>
.items{
  display: flex;
  flex-direction: row;
  width: 100%;
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

.item h1:hover {
  color: #dd5c2d; /* เปลี่ยนสีเมื่อ hover */
  transform: scale(1.02); /* ขยายขนาดเล็กน้อยเมื่อ hover */
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

.icons{
    display: flex;
    flex-direction: row;
    width: 100%;
  
}

.icons img{
    width: 40px;
    margin-left: 5px;
}


/* ไอคอน*/
.icons div:hover img {
  transform: scale(1.1); /* ขยายขนาดเล็กน้อยเมื่อ hover */
  transition: transform 0.3s ease; /* เพิ่มการขยายขนาดอย่างนุ่มนวล */
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}


</style>