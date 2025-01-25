<script setup>
import Sidebar from '@/components/Sidebar.vue';
import { getDormitories } from '@/composables/getDormitories';
import { onMounted, ref, computed } from 'vue';
import router from '@/router';
import DeleteModal from '@/components/modals/ConfirmModal.vue';
import SuccessModal from '@/components/modals/SuccessModal.vue';
import { formatPrice } from '@/composables/formatPrice';
import SortComponent from '@/components/SortComponent.vue';
import SearchComponent from '@/components/SearchComponent.vue';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const dormitories = ref([]);
const isModalVisible = ref(false);
const dormIdToDelete = ref(null);
const isSuccessModalVisible = ref(false)

onMounted(async () => {
  dormitories.value = await getDormitories();
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

const closeSuccessModal = () => {
  isSuccessModalVisible.value = false; // ปิด Modal เมื่อได้รับเหตุการณ์ close
};

const closeModal = () => {
  isModalVisible.value = false;
  dormIdToDelete.value = null;
};

const deleteDormitory = async () => {
  if (dormIdToDelete.value) {
    try {
      const res = await fetch(`${API_ROOT}/dormitories/${dormIdToDelete.value}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'DELETE'
      });

      if (res.ok) {
        dormitories.value = await getDormitories();  // ดึงข้อมูลใหม่หลังการลบ
        closeModal();  // ปิด Modal หลังจากการลบสำเร็จ
        isSuccessModalVisible.value = true;
      } else {
        alert(`There are no dormitory with id = ${dormIdToDelete.value}`);
        throw new Error('Cannot delete data!');
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  }
};
</script>

<template>
  <div class="flex flex-row w-full justify-center p-20">
    <Sidebar />

    <div class="pl-2 w-1/2 h-full flex rounded-xl">
      <div class="w-full flex flex-col items-center justify-center">

        <div class="flex flex-row items-center w-full space-x-2 mb-2">
          
          <SearchComponent v-model:search="searchInput" />
          <SortComponent :dormitories="dormitories" />

        </div>
        <div v-if="filteredDormitories.length > 0" class="container">
          <div v-for="dorm in filteredDormitories" :key="dorm.dormId" class="holding-items">
            <div class="items rounded-lg border-2">
              <div class="w-8/12 flex h-64 justify-center items-center">
                <img :src="dorm.image[0] || '/images/no_image.jpg'" class="h-full bg-cover bg-center rounded-2xl" alt="Dormitory Image" />
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
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <div v-if="dormitories.length === 0" class="text-2xl text-red-600 text-center">No Dormitory</div>
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
  <SuccessModal v-if="isSuccessModalVisible" @close="closeSuccessModal"/>
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


</style>