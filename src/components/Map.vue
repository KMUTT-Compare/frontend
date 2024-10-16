<script setup>
  import { ref, onMounted } from 'vue';
  
  onMounted(() => {
    initMap();
  });

  const searchQuery = ref(''); // ค่าที่ผู้ใช้ค้นหา
  const houseNumber1 = ref(''); // บ้านเลขที่
  const houseNumber2 = ref(''); // บ้านเลขที่
  const houseNumber = ref(''); // บ้านเลขที่
  const street = ref(''); // ถนน
  const alley = ref(''); // ซอย
  const subDistrict = ref(''); // ตำบล/แขวง
  const district = ref(''); // อำเภอ/เขต
  const province = ref(''); // จังหวัด
  const postalCode = ref(''); // รหัสไปรษณีย์
  let map;
  let userSelectedMarker = null;
  let autocomplete;
  
  function initMap() {
    const kmuttLocation = { lat: 13.651309958082942, lng: 100.49645730815111 };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: kmuttLocation,
    });
  
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
// กำหนดค่าที่อยู่ที่เลือกให้กับฟิลด์ที่อยู่
// กำหนดค่าที่อยู่ที่เลือกให้กับฟิลด์ที่อยู่
if (place.address_components) {
  console.log(place.address_components);
  
  // Reset address fields
  houseNumber1.value = '';
  houseNumber2.value = '';
  street.value = '';
  alley.value = '';
  subDistrict.value = '';
  district.value = '';
  province.value = '';
  postalCode.value = '';

  // Clear existing value
  houseNumber.value = '';

  place.address_components.forEach(component => {
    const componentType = component.types[0];
    
    switch (componentType) {
      case 'subpremise':
        houseNumber1.value = component.long_name; // Store sub-premise
        break;
      case 'street_number':
        houseNumber2.value = component.long_name; // Store street number
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
    houseNumber.value = `${houseNumber1.value}/${houseNumber2.value}`;
  } else {
    // If only one part is available, set that
    houseNumber.value = houseNumber1.value || houseNumber2.value;
  }

  // อัปเดต searchQuery ให้ตรงกับชื่อสถานที่
  searchQuery.value = place.name; // อัปเดต searchQuery

} else {
  alert("No details available for input: '" + place.name + "'");
}

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
      <div id="map" style="width: 100%; height: 200px;"></div>
  
      <div class="flex flex-col mt-5">
        <h3>กรอกข้อมูลที่อยู่</h3>

            <div class="grid gap-6 mb-6 md:grid-cols-2 mt-5">
                <div>
                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">บ้านเลขที่</label>
                    <input v-model="houseNumber" type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="บ้านเลขที่" required />
                </div>
                <div>
                    <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ถนน ซอย</label>
                    <input v-model="street" type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ถนน ซอย" required />
                </div>
                <div>
                    <label for="company" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ตำบล/แขวง</label>
                    <input v-model="subDistrict" type="text" id="company" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ตำบล/แขวง" required />
                </div>  
                <div>
                    <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อำเภอ/เขต</label>
                    <input v-model="district" type="tel" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อำเภอ/เขต" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
                </div>
                <div>
                    <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">จังหวัด</label>
                    <input v-model="province" type="url" id="website" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="จังหวัด" required />
                </div>
                <div>
                    <label for="visitors" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รหัสไปรษณีย์</label>
                    <input v-model="postalCode" type="number" id="visitors" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="รหัสไปรษณีย์" required />
                </div>
            </div>



      </div>
    </div>
  </template>
  
  <style scoped>

  </style>
  