<script setup>
import Map from '@/components/Map.vue'
import { ref } from 'vue'
import router from '@/router';
const min_price = ref()
const max_price = ref()
const num_room = ref(0)
const num_bed = ref(0)
const num_bathroom = ref(0)
const name = ref('')
const detail = ref('')

const selectedImages = [];
const telephone = ref('')
const name_surname = ref('')

const handleFiles = (event) => {
  const files = event.target.files;
  const imagePreview = document.getElementById('imagePreview');
  // imagePreview.innerHTML = ''; // เคลียร์ภาพเก่า
  selectedImages.length = 0; // เคลียร์ array ก่อน

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'relative m-1';

      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'w-24 h-24 object-cover';

      const removeButton = document.createElement('button');
      removeButton.innerText = 'ลบ';
      removeButton.className = 'absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full';
      removeButton.onclick = () => {
        imgContainer.remove(); // ลบ container
        const index = selectedImages.indexOf(e.target.result);
        if (index > -1) {
          selectedImages.splice(index, 1); // ลบจาก array
        }
      };

      imgContainer.appendChild(img);
      imgContainer.appendChild(removeButton);
      imagePreview.appendChild(imgContainer);
      selectedImages.push(e.target.result); // เก็บข้อมูลไฟล์
    };
    
    reader.readAsDataURL(file);
  }
};
</script>



<template>
  <div class="w-full h-full flex justify-center mt-24">

    <div class="w-8/12 space-y-5">

      <h1>ลงประกาศที่พัก</h1>

      <!-- ชื่อ -->
      <div class="flex flex-row items-center w-full">
        <div class="w-28 text-lg font-medium"><p>ชื่อที่อยู่ที่พัก:</p></div>
        <input type="text" class="rounded-md ml-2 w-full text-lg" placeholder="ระบุชื่อที่พัก.." v-model="name"/>
      </div>

      <Map/>


      <h2>รายละเอียดที่พัก</h2>

      <!-- ราคา -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="flex flex-row items-center">
          <p for="min-price" class="w-32 text-lg">ราคาเริ่มต้น:</p>
          <input v-model="min_price" type="text" id="dormNumber" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="โปรดระบุเป็นตัวเลข" required />
        </div>
        <div class="flex flex-row items-center">
          <p for="max-price" class="w-32 text-lg">ราคาสูงสุด:</p>
          <input v-model="max_price" type="text" id="street" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="โปรดระบุเป็นตัวเลข" required />
        </div>
      </div>

      <!-- ประเภท -->

    <div class="w-32">
      <label class="block mb-2 text-lg text-gray-900 dark:text-white ">ประเภทหอพัก</label>
      <select id="types" class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected>รวม</option>
        <option value="US">หญิง</option>
        <option value="CA">ชาย</option>
      </select>
    </div>

    <!-- จำนวนห้องพักที่เหลือ -->
    <div class="flex flex-row items-center space-x-3">
      <p for="min-price" class="w-42 text-lg">จำนวนห้องพักที่เหลือให้เช่า:</p>
      <button class="btn bg-neutral-400 text-white text-xl" @click="num_room > 0 ? num_room-- : null" :disabled="num_room==0">-</button>
      <p class="text-lg font-medium">{{ num_room }}</p>
      <button class="btn bg-black text-white hover:bg-gray-800 text-xl" @click="num_room++">+</button>
    </div>



    <h2 class="pt-5">สิ่งอำนวยความสะดวกต่างๆ</h2>
    <div class="flex flex-row space-x-5">
              <!-- จำนวนเตียง -->
              <div class="flex flex-row items-center space-x-3">
                <p for="bed" class="w-42 text-lg">จำนวนเตียง:</p>
                
                  <!-- Input Number -->
                  <div class="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                    <div class="flex items-center gap-x-1.5">
                      <button @click="num_bed > 0 ? num_bed-- : null" :disabled="num_bed==0" type="button" class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>
                      <input class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" v-model="num_bed">
                      <button @click="num_bed++" type="button" class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <!-- End Input Number -->
              </div>

              <!-- จำนวนห้องน้ำ -->
              <div class="flex flex-row items-center space-x-3">
                  <p for="bathroom" class="w-42 text-lg">จำนวนห้องน้ำ:</p>
                  <!-- Input Number -->
                  <div class="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                    <div class="flex items-center gap-x-1.5">
                      <button @click="num_bathroom > 0 ? num_bathroom-- : null" :disabled="num_bathroom==0" type="button" class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>
                      <input class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" v-model="num_bathroom">
                      <button @click="num_bathroom++" type="button" class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <!-- End Input Number -->
              </div>   
          </div>
     <!-- สิ่งอำนวยความสะดวกต่างๆ -->
    <div class="grid gap-6 md:grid-cols-2">
        <div class="room space-y-5">
          <h3>ภายในห้อง</h3>
            <div class="grid gap-6 md:grid-cols-2">

              <div class="flex flex-row space-x-2">
                <input type="checkbox" class="checkbox" />
                <p class="text-lg">เครื่องทำน้ำอุ่น</p>
              </div>

              <div class="flex flex-row space-x-2">
                <input type="checkbox" class="checkbox" />
                <p class="text-lg">เครื่องซักผ้า</p>
              </div>

              <div class="flex flex-row space-x-2">
                <input type="checkbox" class="checkbox" />
                <p class="text-lg">ตู้เย็น</p>
              </div>

              <div class="flex flex-row space-x-2">
                <input type="checkbox" class="checkbox" />
                <p class="text-lg">เครื่องปรับอากาศ</p>
              </div>

              <div class="flex flex-row space-x-2">
                <input type="checkbox" class="checkbox" />
                <p class="text-lg">ไมโครเวฟ</p>
              </div>

              <div class="flex flex-row space-x-2">
                <input type="checkbox" class="checkbox" />
                <p class="text-lg">ทีวี</p>
              </div>

              <div class="flex flex-row space-x-2">
                <input type="checkbox" class="checkbox" />
                <p class="text-lg">Internet/wifi</p>
              </div>
            </div>
        </div>

        <div class="outside space-y-5">
          <h3>ภายนอกอาคาร</h3>
          <div class="grid gap-6 md:grid-cols-2">

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">Keycard</p>
          </div>

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">ผู้รักษาความปลอดภัย</p>
          </div>

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">ยิม</p>
          </div>

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">กล้องวงจรปิด</p>
          </div>

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">ลานจอดรถจักรยาน</p>
          </div>

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">ลานจอดรถ</p>
          </div>

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">สระว่ายน้ำ</p>
          </div>

          <div class="flex flex-row space-x-2">
            <input type="checkbox" class="checkbox" />
            <p class="text-lg">ลิฟท์</p>
          </div>

          </div>
        </div>
    </div>

    <div class="pt-2">
      <p class="text-lg pb-3">เพิ่มรายละเอียด หรือจุดเด่นของที่พักคุณ</p>
      <input v-model="detail" type="text" id="dormNumber" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ระบุรายละเอียดที่พักของคุณ" required />
    </div>





    <div class="pt-10 space-y-5">
      <h2>อัปโหลดรูปภาพ</h2>
      <div class="flex flex-col items-start">
        <label class="flex flex-col items-center cursor-pointer">
          <div class="file-input-container border-dashed border-2 border-gray-400 p-4 rounded-lg text-center">
            <span class="text-blue-600 font-semibold">คลิกเพื่อเลือกไฟล์</span>
          </div>
          <input type="file" class="hidden" multiple @change="handleFiles" />
        </label>
      </div>
      <div class="flex flex-wrap mt-4" id="imagePreview"></div>
    </div>

    <div class="space-y-5">
      <h2>ช่องทางการติดต่อ</h2>
      <!-- ราคา -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="flex flex-row items-center">
          <p for="min-price" class="w-36 text-lg">ชื่อ-นามสกุล:</p>
          <input v-model="name_surname" type="text" id="dormNumber" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อ-นามสกุล" required />
        </div>
        <div class="flex flex-row items-center">
          <p for="max-price" class="w-40 text-lg">เบอร์โทรศัพท์:</p>
          <input v-model="telephone" type="text" id="street" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="หมายเลขโทรศัพท์" required />
        </div>
      </div>
    </div>

    <div class="w-full flex items-center justify-end space-x-2 h-20">
      <button class="btn bg-orange-500 text-white w-28 hover:bg-orange-600">ADD</button>
      <button @click="router.push('home')" class="btn w-28">Cancel</button>
    </div>





    </div>
  </div>
</template>

<style scoped>
.file-input-container {
  transition: border 0.2s ease;
}

.file-input-container:hover {
  border-color: blue;
}
h1{
  font-size: 2rem;
  font-weight:500
}

h2{
  font-size: 1.5rem;
  font-weight:500
}

h3{
  font-size: 1.25rem;
  font-weight:500
}

#imagePreview img {
  border-radius: 5px; /* ทำให้มุมรูปภาพกลม */
  transition: transform 0.2s;
}

#imagePreview img:hover {
  transform: scale(1.05); /* ขยายเมื่อชี้เมาส์ */
}
</style>
