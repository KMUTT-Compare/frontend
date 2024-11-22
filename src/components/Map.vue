<script setup>
import { ref, watch, onMounted, defineEmits } from 'vue';

const emit = defineEmits();

// ค่าที่ใช้สำหรับที่อยู่
const searchQuery = ref('');
const houseNumber1 = ref('');
const houseNumber2 = ref('');
const dormNumber = ref('');
const street = ref('');
const subDistrict = ref('');
const district = ref('');
const province = ref('');
const postalCode = ref('');
const distance = ref('');

// ติดตามการเปลี่ยนแปลงในตัวแปรต่างๆ และส่งข้อมูลให้กับ parent ทุกครั้งที่ค่ามีการเปลี่ยนแปลง
watch(
  [dormNumber, street, subDistrict, district, province, postalCode, distance],
  () => {
    emit('address-updated', {
      dormNumber: dormNumber.value,
      street: street.value,
      subDistrict: subDistrict.value,
      district: district.value,
      province: province.value,
      postalCode: postalCode.value,
      distance: distance.value,
    });
  },
  { immediate: true } // ทำให้ข้อมูลถูกส่งออกไปตอนที่ component ถูก mount
);

let map;
let userSelectedMarker = null;
let autocomplete;
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();

onMounted(() => {
  initMap();
});

function initMap() {
  const kmuttLocation = { lat: 13.651309958082942, lng: 100.49645730815111 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: kmuttLocation,
  });

  directionsRenderer.setMap(map);

  const input = document.getElementById('place-input');
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setComponentRestrictions({ country: ['th'] });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);

      if (userSelectedMarker) {
        userSelectedMarker.setPosition(place.geometry.location);
      } else {
        userSelectedMarker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });
      }

      calculateDistance(place.geometry.location);

      if (place.address_components) {
        houseNumber1.value = '';
        houseNumber2.value = '';
        street.value = '';
        subDistrict.value = '';
        district.value = '';
        province.value = '';
        postalCode.value = '';
        dormNumber.value = '';

        place.address_components.forEach(component => {
          const componentType = component.types[0];
          switch (componentType) {
            case 'subpremise':
              houseNumber1.value = component.long_name;
              break;
            case 'street_number':
              houseNumber2.value = component.long_name;
              break;
            case 'route':
              street.value = component.long_name;
              break;
            case 'sublocality_level_2':
              subDistrict.value = component.long_name;
              break;
            case 'sublocality_level_1':
              district.value = component.long_name;
              break;
            case 'administrative_area_level_1':
              province.value = component.long_name;
              break;
            case 'postal_code':
              postalCode.value = component.long_name;
              break;
            default:
              break;
          }
        });

        if (houseNumber1.value && houseNumber2.value) {
          dormNumber.value = `${houseNumber1.value}/${houseNumber2.value}`;
        } else {
          dormNumber.value = houseNumber1.value || houseNumber2.value;
        }

        searchQuery.value = place.name;

        // Emit event to send data to parent
        emit('address-updated', {
          dormNumber: dormNumber.value,
          street: street.value,
          subDistrict: subDistrict.value,
          district: district.value,
          province: province.value,
          postalCode: postalCode.value,
          distance: distance.value,
        });
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
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      const route = result.routes[0];
      const distanceText = route.legs[0].distance.text;
      
      // เอาเฉพาะตัวเลขจากระยะทาง
      distance.value = distanceText.split(' ')[0];  // แยกตัวเลขออกจากหน่วย เช่น "5.2" จาก "5.2 km"

      // Emit the distance as well
      emit('address-updated', {
        dormNumber: dormNumber.value,
        street: street.value,
        subDistrict: subDistrict.value,
        district: district.value,
        province: province.value,
        postalCode: postalCode.value,
        distance: distance.value,
      });
    } else {
      alert('ไม่สามารถคำนวณระยะทางได้: ' + status);
    }
  });
}
</script>



<template>
  <div>
    <div class="flex flex-row items-center w-full mb-5">
      <div class="w-28"><p class="text-lg font-medium">ที่อยู่ที่พัก:</p></div>
      <input
      id="place-input"
      type="text"
      placeholder="ค้นหาสถานที่"
      class="rounded-md ml-2 w-full text-lg"
      v-model="searchQuery"
    />

    </div>
    
    <div id="map" style="width: 100%; height: 300px;"></div>

    <div class="flex flex-col mt-5">
      <h2>กรอกข้อมูลที่อยู่</h2>

      <div class="grid gap-6 mb-6 md:grid-cols-2 mt-5">
        <div>
          <label for="dormNumber" class="block mb-2 text-lg text-gray-900 dark:text-white">เลขที่</label>
          <input v-model="dormNumber" type="text" id="dormNumber" class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="เลขที่" required />
        </div>
        <div>
          <label for="street" class="block mb-2 text-lg text-gray-900 dark:text-white">ถนน ซอย</label>
          <input v-model="street" type="text" id="street" class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ถนน ซอย" required />
        </div>
        <div>
          <label for="subDistrict" class="block mb-2 text-lg text-gray-900 dark:text-white">ตำบล/แขวง</label>
          <input v-model="subDistrict" type="text" id="subDistrict" class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ตำบล/แขวง" required />
        </div>
        <div>
          <label for="district" class="block mb-2 text-lg text-gray-900 dark:text-white">อำเภอ/เขต</label>
          <input v-model="district" type="tel" id="district" class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อำเภอ/เขต" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
        </div>
        <div>
          <label for="province" class="block mb-2 text-lg text-gray-900 dark:text-white">จังหวัด</label>
          <input v-model="province" type="url" id="province" class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="จังหวัด" required />
        </div>
        <div>
          <label for="postalCode" class="block mb-2 text-lg text-gray-900 dark:text-white">รหัสไปรษณีย์</label>
          <input v-model="postalCode" type="url" id="postalCode" class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="รหัสไปรษณีย์" required />
        </div>
        <div>
          <label for="distance" class="block mb-2 text-lg text-gray-900 dark:text-white">ระยะทาง</label>
          <input v-model="distance" type="text" id="distance" class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ระยะทาง" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
h1{
  font-size: 2rem;
  font-weight:500
}

h2{
  font-size: 1.5rem;
  font-weight:500
}
</style>
