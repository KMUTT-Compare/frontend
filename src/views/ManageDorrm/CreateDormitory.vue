<script setup>
import Map from '@/components/Map.vue'
import { ref } from 'vue'
import router from '@/router';
const API_ROOT = import.meta.env.VITE_API_ROOT

const name = ref('');
const status = ref('ว่าง'); // เก็บค่าสถานะหอพัก (ว่าง, ไม่ว่าง)
const address = ref({});
const roomCount = ref(0);
const type = ref('รวม'); // เก็บค่าประเภทหอพัก (รวม, หญิง, ชาย)
const size = ref(0);
const min_price = ref();
const max_price = ref();
const selectedImages = ref([]);

const handleAddressUpdated = (updatedAddress) => {
  address.value = updatedAddress;
  console.log(address.value);
};

const handleFiles = (event) => {
  const files = event.target.files;
  const imagePreview = document.getElementById('imagePreview');
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
        imgContainer.remove();
        const index = selectedImages.indexOf(e.target.result);
        if (index > -1) {
          selectedImages.splice(index, 1);
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

const insideAmenities = ref([]);
const outsideAmenities = ref([]);

const newInsideAmenity = ref('');
const newOutsideAmenity = ref('');

const addInsideAmenity = () => {
  if (newInsideAmenity.value.trim() !== '') {
    insideAmenities.value.push(newInsideAmenity.value.trim());
    newInsideAmenity.value = '';
  }
};

const removeInsideAmenity = (index) => {
  insideAmenities.value.splice(index, 1);
};

const addOutsideAmenity = () => {
  if (newOutsideAmenity.value.trim() !== '') {
    outsideAmenities.value.push(newOutsideAmenity.value.trim());
    newOutsideAmenity.value = '';
  }
};

const removeOutsideAmenity = (index) => {
  outsideAmenities.value.splice(index, 1);
};

const addDormitory = async () => {
  if (!name.value || !min_price.value || !max_price.value || roomCount.value <= 0 || !address.value) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  const dormitoryData = {
    name: name.value,
    status: status.value,
    address: {
      dormNumber: address.value.dormNumber,
      street: address.value.street,
      subdistrict: address.value.subDistrict,
      district: address.value.district,
      province: address.value.province,
      postalCode: address.value.postalCode
    },
    roomCount: parseInt(roomCount.value),
    type: type.value,
    size: size.value, // ส่งเป็น number ได้โดยตรง
    min_price: min_price.value,
    max_price: max_price.value,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    distance: address.value.distance,
    image: selectedImages.value,
    building_facility: insideAmenities.value,
    room_facility: outsideAmenities.value,
    staffId: 3 // สมมติว่า staffId คือ 3
  };

  try {
    const response = await fetch(`${API_ROOT}/dormitories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dormitoryData),
    });

    if (!response.ok) {
      throw new Error('การเพิ่มหอพักไม่สำเร็จ');
    }

    const data = await response.json();

    if (data.success) {
      alert('เพิ่มหอพักสำเร็จ');
      router.push('/home');
    } else {
      alert('เกิดข้อผิดพลาด: ' + data.message);
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
    alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
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

      <Map @address-updated="handleAddressUpdated" />


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
      <select id="types" v-model="type" class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected>รวม</option>
        <option value="female">หญิง</option>
        <option value="male">ชาย</option>
      </select>
    </div>

    <div class="w-32">
        <label class="block mb-2 text-lg text-gray-900 dark:text-white ">สถานะหอพัก</label>
        <select id="status"  v-model="status" class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>ว่าง</option>
          <option value="busy">ไม่ว่าง</option>
        </select>
    </div>

    <div class="flex flex-row space-x-5">
              <!-- จำนวนห้องพักที่เหลือให้เช่า -->
              <div class="flex flex-row items-center space-x-3">
                <p for="room" class="w-42 text-lg">จำนวนห้องพักที่เหลือให้เช่า:</p>
                  <div class="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                    <div class="flex items-center gap-x-1.5">
                      <button @click="roomCount > 0 ? roomCount-- : null" :disabled="roomCount==0" type="button" class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>
                      <input class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" v-model="roomCount">
                      <button @click="roomCount++" type="button" class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
              </div>
          </div>


    <h2 class="pt-5">สิ่งอำนวยความสะดวกต่างๆ</h2>

     <!-- สิ่งอำนวยความสะดวกต่างๆ -->
    <div class="grid gap-6 md:grid-cols-2">
        <div class="room space-y-5">
          <h3>ภายในห้อง</h3>

             <!-- สิ่งอำนวยความสะดวกภายในห้อง -->
          <div class="room space-y-5">
            <div class="flex flex-col space-y-2">
              <!-- ช่องกรอกข้อมูลและปุ่มเพิ่มสำหรับภายในห้อง -->
              <div class="flex items-center ">
                <input v-model="newInsideAmenity" type="text" class="border border-gray-300 text-lg rounded-lg p-2 w-2/3" placeholder="เพิ่มสิ่งอำนวยความสะดวกภายในห้อง" 
                />
                <button 
                  @click="addInsideAmenity" 
                  class="ml-2 bg-blue-500 text-white rounded-lg p-2 px-8"
                >
                  เพิ่ม
                </button>
              </div>

              <!-- แสดงรายการสิ่งอำนวยความสะดวกภายในห้อง -->
              <div class="border-2 rouded-lg w-2/3">
                  <ul>
                    <li v-for="(amenity, index) in insideAmenities" :key="index" class="text-lg flex flex-row justify-between p-2">
                      <span>{{ amenity }}</span> 
                      <button @click="removeInsideAmenity(index)" class="text-red-500 hover:text-red-700">ลบ</button>
                    </li>
                  </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="outside space-y-5">
          <h3>ภายนอกอาคาร</h3>

                        <!-- สิ่งอำนวยความสะดวกภายนอกอาคาร -->
              <div class="outside space-y-5">
                <div class="flex flex-col space-y-2">
                  <!-- ช่องกรอกข้อมูลและปุ่มเพิ่มสำหรับภายนอกอาคาร -->
                  <div class="flex items-center">
                    <input 
                      v-model="newOutsideAmenity" 
                      type="text" 
                      class="border border-gray-300 text-lg rounded-lg p-2 w-2/3" 
                      placeholder="เพิ่มสิ่งอำนวยความสะดวกภายนอกอาคาร" 
                    />
                    <button 
                      @click="addOutsideAmenity" 
                      class="ml-2 bg-blue-500 text-white rounded-lg p-2 px-8"
                    >
                      เพิ่ม
                    </button>
                  </div>

                  <!-- แสดงรายการสิ่งอำนวยความสะดวกภายนอกอาคาร -->
                  <div class="border-2 w-2/3">
                      <ul>
                        <li v-for="(amenity, index) in outsideAmenities" :key="index" class="text-lg flex flex-row justify-between p-2">
                          <span>{{ amenity }}</span> 
                          <button @click="removeOutsideAmenity(index)" class="text-red-500 hover:text-red-700">ลบ</button>
                        </li>
                      </ul>
                  </div>
                </div>
              </div>
        </div>
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

    <div class="w-full flex items-center justify-end space-x-2 h-20">
    <button @click="addDormitory()" class="btn bg-orange-500 text-white w-28 hover:bg-orange-600">เพิ่มหอพัก</button>
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
