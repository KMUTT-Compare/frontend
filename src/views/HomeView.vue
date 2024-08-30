<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSearchStore } from '@/stores/searchStore';
import { useRouter } from 'vue-router'
import WhiteButton from '@/components/WhiteButton.vue';
const router = useRouter()


// ใช้การตั้งค่า API_ROOT
const API_ROOT = import.meta.env.VITE_API_ROOT

const dormitories = ref([])
const store = useSearchStore();
const filteredDormitories = computed(() => store.filteredDormitories(dormitories.value));

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
          <img src="../components/photos/backgroud.svg" alt="">
        </div>
    </header>

    <section>
      <div class="container">

        <!-- ส่วนที่ 1 -->
        <div class="promotion">

          <!-- ส่วนหัวเรื่อง -->
          <div class="title">
            <h1>Promotion</h1>
            <WhiteButton context="SEE ALL"/>
          </div>

          <!-- ส่วนไอเทม -->
          <div v-if="dormitories !== null || dormitories.length !== 0" class="items">
            <div v-for="dorm in filteredDormitories" :key="dorm.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
             
              <div class="two-items">
              <div class="item-img">
                <img src="../components/photos/item.svg" alt="Dormitory Image" />
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

        <!-- ส่วนที่ 2 -->



      </div>
    </section>
    

    <div v-if="dormitories.length === 0" class="text-2xl text-red-600 text-center">No Dormitory</div>
 

  
</template>

<style scoped>

.items{
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-template-rows: auto;
  column-gap: 30px;
  row-gap: 20px;
  justify-items: center;
  
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


.background img {
  width: 100%;
}

.container{
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.promotion{
  width: 840px;
  margin-top: 50px;
}

.title{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title h1{
  font-size: 60px;
}
</style>
