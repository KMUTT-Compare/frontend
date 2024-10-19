<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
  initMap();
});

const searchQuery = ref(''); // ค่าที่ผู้ใช้ค้นหา
const houseNumber1 = ref(''); // เลขที่
const houseNumber2 = ref(''); // เลขที่
const dormNumber = ref(''); // เลขที่
const street = ref(''); // ถนน
const subDistrict = ref(''); // ตำบล/แขวง
const district = ref(''); // อำเภอ/เขต
const province = ref(''); // จังหวัด
const postalCode = ref(''); // รหัสไปรษณีย์
const distance = ref(''); // ค่าระยะทาง

let map;
let userSelectedMarker = null;
let autocomplete;
const directionsService = new google.maps.DirectionsService(); // สร้าง DirectionsService
const directionsRenderer = new google.maps.DirectionsRenderer(); // สร้าง DirectionsRenderer

function initMap() {
  const kmuttLocation = { lat: 13.651309958082942, lng: 100.49645730815111 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: kmuttLocation,
  });

  directionsRenderer.setMap(map); // เชื่อมต่อ directionsRenderer กับแผนที่

  const input = document.getElementById('place-input');
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setComponentRestrictions({ country: ['th'] });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (place.geometry) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);

      // ปักหมุด
      if (userSelectedMarker) {
        userSelectedMarker.setPosition(place.geometry.location);
      } else {
        userSelectedMarker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });
      }

      // คำนวณระยะทาง
      calculateDistance(place.geometry.location);

      // กำหนดค่าที่อยู่ที่เลือกให้กับฟิลด์ที่อยู่
      if (place.address_components) {
        // Reset address fields
        houseNumber1.value = '';
        houseNumber2.value = '';
        street.value = '';
        subDistrict.value = '';
        district.value = '';
        province.value = '';
        postalCode.value = '';

        // Clear existing value
        dormNumber.value = '';

        place.address_components.forEach(component => {
          const componentType = component.types[0];

          switch (componentType) {
            case 'subpremise':
              houseNumber1.value = component.long_name; // เลขที่ตัวหน้า 
              break;
            case 'street_number':
              houseNumber2.value = component.long_name; // เลขที่ตัวหลัง
              break;
            case 'route':
              street.value = component.long_name; // ถนน
              break;
            case 'sublocality_level_2':
              subDistrict.value = component.long_name; // ตำบล/แขวง
              break;
            case 'sublocality_level_1':
              district.value = component.long_name; // เขต/อำเภอ
              break;
            case 'administrative_area_level_1':
              province.value = component.long_name; // จังหวัด
              break;
            case 'postal_code':
              postalCode.value = component.long_name; // รหัสไปรษณีย์
              break;
            default:
              break;
          }
        });

        // Combine house number parts if both are available
        if (houseNumber1.value && houseNumber2.value) {
          dormNumber.value = `${houseNumber1.value}/${houseNumber2.value}`;
        } else {
          dormNumber.value = houseNumber1.value || houseNumber2.value;
        }

        // อัปเดต searchQuery ให้ตรงกับชื่อสถานที่
        searchQuery.value = place.name; // อัปเดต searchQuery
      } else {
        alert("No details available for input: '" + place.name + "'");
      }
    }
  });
}

function calculateDistance(destination) {
  const kmuttLocation = { lat: 13.6513, lng: 100.4964 };

  const request = {
    origin: destination,
    destination: kmuttLocation,
    travelMode: google.maps.TravelMode.DRIVING, // หรือเปลี่ยนเป็น BICYCLING, TRANSIT, WALKING ตามต้องการ
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      // ดึงข้อมูลระยะทาง
      const route = result.routes[0];
      distance.value = route.legs[0].distance.text; // เก็บค่าระยะทาง

      // ไม่แสดง popup อีกต่อไป
      // alert(`ระยะทาง: ${distance.value}, เวลา: ${duration.value}`); // ลบ alert ออก
    } else {
      alert('ไม่สามารถคำนวณระยะทางได้: ' + status);
    }
  });
}
</script>

<template>
  <div>
    <input
      id="place-input"
      type="text"
      placeholder="ค้นหาสถานที่"
      style="width: 100%; padding: 8px; margin-bottom: 10px;"
      v-model="searchQuery"
    />
    <div id="map" style="width: 100%; height: 300px;"></div>

    <div class="flex flex-col mt-5">
      <h3>กรอกข้อมูลที่อยู่</h3>

      <div class="grid gap-6 mb-6 md:grid-cols-2 mt-5">
        <div>
          <label for="dormNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลขที่</label>
          <input v-model="dormNumber" type="text" id="dormNumber" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="เลขที่" required />
        </div>
        <div>
          <label for="street" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ถนน ซอย</label>
          <input v-model="street" type="text" id="street" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ถนน ซอย" required />
        </div>
        <div>
          <label for="subDistrict" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ตำบล/แขวง</label>
          <input v-model="subDistrict" type="text" id="subDistrict" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ตำบล/แขวง" required />
        </div>
        <div>
          <label for="district" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อำเภอ/เขต</label>
          <input v-model="district" type="tel" id="district" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อำเภอ/เขต" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
        </div>
        <div>
          <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">จังหวัด</label>
          <input v-model="province" type="url" id="province" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="จังหวัด" required />
        </div>
        <div>
          <label for="postalCode" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รหัสไปรษณีย์</label>
          <input v-model="postalCode" type="url" id="postalCode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="รหัสไปรษณีย์" required />
        </div>
        <div>
          <label for="distance" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ระยะทาง</label>
          <input v-model="distance" type="text" id="distance" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ระยะทาง" readonly />
        </div>
      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-2 mt-5">

      </div>
    </div>
  </div>
</template>
