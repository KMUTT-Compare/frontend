<script setup>
import { storeToRefs } from 'pinia';
import { useCompareStore } from '@/stores/compareStore';
import CompareButton from '@/components/buttons/CompareButton.vue';
import { computed } from 'vue';
const compareStore = useCompareStore();
const { compareItems } = storeToRefs(compareStore);

// ฟังก์ชันแปลงที่อยู่ให้เป็นข้อความ
const formatAddress = (address) => {
  return `${address.dormNumber} ${address.street}, ${address.subdistrict}, ${address.district}, ${address.province}, ${address.postalCode}`;
};

// ฟังก์ชันเปรียบเทียบสิ่งอำนวยความสะดวก
const getFacilityStatus = (facility, dormFacilities) => {
  return dormFacilities.includes(facility) ? '✅' : '❌';
};

// ฟังก์ชันที่ใช้เปรียบเทียบค่าระหว่างสองหอพัก
const compareDorms = (dorm1, dorm2) => {
  return {
    min_price: dorm1.min_price < dorm2.min_price,  // ถ้าราคาเริ่มต้นของหอพัก 1 ต่ำกว่าหอพัก 2
    max_price: dorm1.max_price < dorm2.max_price,  // ถ้าราคาสูงสุดของหอพัก 1 สูงกว่าหอพัก 2
    size: dorm1.size > dorm2.size,                // ถ้าขนาดห้องของหอพัก 1 ใหญ่กว่าหอพัก 2
    distance: dorm1.distance < dorm2.distance      // ถ้าระยะทางของหอพัก 1 ใกล้กว่าหอพัก 2
  };
};

// เปรียบเทียบหอพักทั้งสอง
const dorm1Comparison = computed(() => compareDorms(compareItems.value[0], compareItems.value[1]));
const dorm2Comparison = computed(() => compareDorms(compareItems.value[1], compareItems.value[0]));

</script>

<template>
  <div class="w-full min-h-screen flex flex-col bg-gray-50 py-6">
    
    <div class="container mx-auto grid grid-cols-2 gap-6">
      <!-- หอพักซ้าย -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src="../../components/photos/dorm.jpg" alt="Dorm 1 Image" class="w-full h-52 object-cover mb-4 rounded-lg" />
        <h2 class="text-xl font-bold text-gray-800 text-center">{{ compareItems[0]?.dormName }}</h2>
        <ul class="mt-4 space-y-2">
          <li><strong>ที่อยู่:</strong> {{ formatAddress(compareItems[0]?.address) }}</li>
          <li>
            <span v-if="dorm1Comparison.min_price">✅</span>
            <strong>ราคาเริ่มต้น:</strong> 
            {{ compareItems[0]?.min_price }} บาท
          </li>
        <li>
          <span v-if="dorm1Comparison.max_price">✅</span>
          <strong>ราคาสูงสุด:</strong> 
          {{ compareItems[0]?.max_price }} บาท
        </li>
        <li>
          <span v-if="dorm1Comparison.size">✅</span>
          <strong>ขนาดห้อง:</strong> 
          {{ compareItems[0]?.size }} ตร.ม.
        </li>
        <li>
          <span v-if="dorm1Comparison.distance">✅</span>
          <strong>ระยะทาง:</strong> 
          {{ compareItems[0]?.distance }} กม.
        </li>
        </ul>
      </div>

      <!-- หอพักขวา -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src="../../components/photos/new.svg" alt="Dorm 2 Image" class="w-full h-52 object-cover mb-4 rounded-lg" />
        <h2 class="text-xl font-bold text-gray-800 text-center">{{ compareItems[1]?.dormName }}</h2>
        <ul class="mt-4 space-y-2">
          <li><strong>ที่อยู่:</strong> {{ formatAddress(compareItems[1]?.address) }}</li>
          <li>
            <span v-if="dorm2Comparison.min_price">✅</span>
            <strong>ราคาเริ่มต้น:</strong> 
            {{ compareItems[1]?.min_price }} บาท
        </li>
        <li>
          <span v-if="dorm2Comparison.max_price">✅</span>
          <strong>ราคาสูงสุด:</strong> 
          {{ compareItems[1]?.max_price }} บาท
        </li>
        <li>
          <span v-if="dorm2Comparison.size">✅</span>
          <strong>ขนาดห้อง:</strong> 
          {{ compareItems[1]?.size }} ตร.ม.
        </li>
        <li>
          <span v-if="dorm2Comparison.distance">✅</span>
          <strong>ระยะทาง:</strong> 
          {{ compareItems[1]?.distance }} กม.
        </li>
        </ul>
      </div>
    </div>

    <!-- ตารางเปรียบเทียบสิ่งอำนวยความสะดวก -->
    <div class="container mx-auto mt-8">
      <h3 class="text-lg font-bold text-center mb-4">เปรียบเทียบสิ่งอำนวยความสะดวก</h3>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 border">สิ่งอำนวยความสะดวกภายในห้องพัก</th>
              <th class="p-3 border text-center">{{ compareItems[0]?.dormName }}</th>
              <th class="p-3 border text-center">{{ compareItems[1]?.dormName }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="facility in [...new Set([...compareItems[0]?.room_facility, ...compareItems[1]?.room_facility])]" :key="facility">
              <td class="p-3 border">{{ facility }}</td>
              <td class="p-3 border text-center">{{ getFacilityStatus(facility, compareItems[0]?.room_facility) }}</td>
              <td class="p-3 border text-center">{{ getFacilityStatus(facility, compareItems[1]?.room_facility) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 border">สิ่งอำนวยความสะดวกภายนอกห้องพัก</th>
              <th class="p-3 border text-center">{{ compareItems[0]?.dormName }}</th>
              <th class="p-3 border text-center">{{ compareItems[1]?.dormName }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="facility in [...new Set([...compareItems[0]?.building_facility, ...compareItems[1]?.building_facility])]" :key="facility">
              <td class="p-3 border">{{ facility }}</td>
              <td class="p-3 border text-center">{{ getFacilityStatus(facility, compareItems[0]?.building_facility) }}</td>
              <td class="p-3 border text-center">{{ getFacilityStatus(facility, compareItems[1]?.building_facility) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

          <!-- แสดงปุ่มการเปรียบเทียบ -->
          <div v-if="compareItems.length > 0" class="fixed bottom-4 right-4">
            <CompareButton/>
          </div>

  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

strong{
  padding-left: 5px;
}
</style>