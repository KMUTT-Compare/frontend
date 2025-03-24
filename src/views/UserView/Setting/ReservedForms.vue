<script setup>
import { ref, onMounted, computed } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import { formatDate } from '@/composables/formatDate';
import { formatPhoneNumber } from '@/composables/formatPhoneNumber';
import { useRouter } from 'vue-router';  // Import vue-router for navigation
import { useSubmittedForms } from '@/composables/getSubmittedForms';

const { isLoading, fetchSubmittedForms, submittedForms } = useSubmittedForms();

// Create a router instance
const router = useRouter();

// Sort submitted forms by form_date
const sortedForms = computed(() => {
  return submittedForms.value.sort((a, b) => {
    const dateA = new Date(a.form_date);
    const dateB = new Date(b.form_date);
    return dateB - dateA;  // ถ้าคุณต้องการเรียงจากใหม่ไปเก่า
  });
});

// Function to navigate to the edit page
const goToEditPage = (formId) => {
  router.push({
    name : 'reservation',
    params : {id : formId, action: 'edit'}
  })
};


// Modify handleCancelBooking to accept formId and action
const handleCancelBooking = (id) => {
  router.push({ name: "reservation", params: { id: id, action: 'cancel' } });
};


onMounted(() => {
  fetchSubmittedForms();
});


const isShowDetail = ref(false); // เริ่มต้นคือไม่แสดงรายละเอียด

// ฟังก์ชั่นเพื่อสลับสถานะของ isShowDetail
const toggleDetail = () => {
  isShowDetail.value = !isShowDetail.value;
};




</script>

<template>
  <div class="flex flex-row w-full justify-center p-20">
    <Sidebar />
    <div class="pl-2 w-1/2 h-full">
      <div class="p-6 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <h1 class="font-bold text-3xl mb-8">ฟอร์มที่ส่งแล้ว</h1>

        <div v-if="isLoading" class="text-center text-gray-600">
          กำลังโหลดข้อมูล...
        </div>

        <ul v-else-if="sortedForms.length === 0" class="space-y-6">
          <div class="text-center text-gray-600">
            ยังไม่มีฟอร์มที่ส่ง
          </div>
        </ul>

        <ul v-else class="space-y-6">
          <li v-for="form in sortedForms" :key="form.id"
              :class="{'bg-gray-300': form.description.includes('ยกเลิกการจอง')}"
              class="p-6 rounded-lg shadow-md bg-white space-y-4">

            <div class="flex flex-row items-center justify-between">
              <h2 class="font-semibold text-lg">{{ form.dormName || 'ไม่มีชื่อหอพัก' }}</h2>
              <h2 class="text-sm text-gray-600">วันที่ส่ง: {{ formatDate(form.form_date) }}</h2>
            </div>

            <hr class="my-4">
              <!-- ข้อมูลผู้เข้าพัก -->
              <div class="rounded-lg">
                <div class="flex flex-row justify-between">
                  <div>
                    <p class="text-sm text-gray-600">ชื่อผู้จองหอพัก: {{ form.name || 'ไม่มีข้อมูล' }}</p>
                  </div>
                  <div class="text-xl text-gray-800 font-semibold cursor-pointer hover:text-black hover:scale-105" @click="toggleDetail">
                    {{ isShowDetail ? 'ซ่อนรายละเอียด' : 'รายละเอียดเพิ่มเติม' }}
                  </div>
                </div>
                
                <p class="text-sm text-gray-600">เบอร์ติดต่อ: {{ formatPhoneNumber(form.phone || 'ไม่มีข้อมูล') }}</p>
                <p class="text-sm text-gray-600">อีเมล: {{ form.email || 'ไม่มีข้อมูล' }}</p>
              </div>

              
              <!-- หาก isShowDetail เป็น true จะแสดงรายละเอียด -->
              <div v-if="isShowDetail" class="mt-4 p-4 bg-gray-100 rounded-lg">
                <p class="text-sm text-gray-600">ชื่อผู้จองหอพัก: {{ form.name || 'ไม่มีข้อมูล' }}</p>
                <p class="text-sm text-gray-600">เบอร์ติดต่อ: {{ form.phone || 'ไม่มีข้อมูล' }}</p>
                <p class="text-sm text-gray-600">อีเมล: {{ form.email || 'ไม่มีข้อมูล' }}</p>
                <p class="text-sm text-gray-600">รายละเอียดเพิ่มเติม: {{ form.description || 'ไม่มีข้อมูล' }}</p>
                <p class="text-sm text-gray-600">วันที่เข้าพัก: {{ formatDate(form.date_in || 'ไม่มีข้อมูล') }}</p>
                <p class="text-sm text-gray-600">วันที่ออก: {{ formatDate(form.date_out|| 'ไม่มีข้อมูล') }}</p>
              </div>

            <!-- ปุ่มแก้ไขและยกเลิกจะถูกซ่อนไปหาก description มีคำว่า 'ยกเลิกการจอง' -->
            <div v-if="!form.description.includes('ยกเลิกการจอง')" class="flex space-x-6 mt-6">
              <button class="btn p-3 bg-blue-500 text-white hover:bg-blue-600 w-32" @click="goToEditPage(form.formId)">
                แก้ไข
              </button>
              <button class="btn p-3 bg-red-500 text-white hover:bg-red-600 w-32" type="button" 
                @click="handleCancelBooking(form.formId)">
                ยกเลิกการจอง
              </button>
            </div>

            <!-- ข้อความแสดงเมื่อ description มีคำว่า 'ยกเลิกการจอง' -->
            <div v-if="form.description.includes('ยกเลิกการจอง')" class="text-right text-gray-500 mt-4 text-2xl">
              ยกเลิกการจองแล้ว
            </div>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>




<style scoped>
h1{
    font-size: 2rem;
    color: #2b2b2b; 
}

h2{
    font-size: 1.5rem;
    color: #333;
    font-weight: bold;
}

p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #666;
}

span {
   font-size: 1rem;
   color: #333;
}

ul {
    list-style-type: disc;
    margin-left: 20px;
}

/* เพิ่มคลาสให้ฟอร์มสีเทาเมื่อ description มีคำว่า 'ยกเลิกการจอง' */
.bg-gray-300 {
  background-color: #f3f3f3;
}

</style>
