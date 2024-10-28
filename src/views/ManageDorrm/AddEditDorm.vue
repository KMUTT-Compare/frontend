<script setup>
import Map from '@/components/Map.vue'
import { ref } from 'vue'
const min_price = ref()
const max_price = ref()
const num_room = ref(0)
</script>



<template>
  <div class="w-full h-full flex justify-center mt-24">

    <div class="w-8/12 space-y-4">

      <h1>ลงประกาศที่พัก</h1>

      <!-- ชื่อ -->
      <div class="flex flex-row items-center w-full">
        <div class="w-24"><h2>ชื่อที่อยู่ที่พัก:</h2></div>
        <input type="text" class="rounded-md ml-2 w-full" placeholder="ระบุชื่อที่พัก.." v-model="name"/>
      </div>

      <Map/>

      <!-- ราคา -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="flex flex-row items-center">
          <p for="min-price" class="w-28 font-medium text-sm">ราคาเริ่มต้น:</p>
          <input v-model="min_price" type="text" id="dormNumber" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="โปรดระบุเป็นตัวเลข" required />
        </div>
        <div class="flex flex-row items-center">
          <p for="max-price" class="w-28 font-medium text-sm">ราคาสูงสุด:</p>
          <input v-model="max_price" type="text" id="street" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="โปรดระบุเป็นตัวเลข" required />
        </div>
      </div>

      <!-- ประเภท -->

      <div class="w-32">
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ประเภทหอพัก</label>
      <select id="types" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected>รวม</option>
        <option value="US">หญิง</option>
        <option value="CA">ชาย</option>
      </select>
    </div>

    <!-- จำนวนห้องพักที่เหลือ -->
     <div class="flex flex-row items-center space-x-3">
      <p for="min-price" class="w-40 font-medium text-sm">จำนวนห้องพักที่เหลือให้เช่า:</p>
      <button class="btn bg-neutral-400 text-white text-xl" @click="num_room > 0 ? num_room-- : null" :disabled="num_room==0">-</button>
      <p>{{ num_room }}</p>
      <button class="btn bg-orange-500 text-white hover:bg-orange-600 text-xl" @click="num_room++">+</button>
     </div>






    </div>
  </div>
</template>

<style scoped>
h1{
  font-size: 1.5rem;
  font-weight:500
}
</style>
