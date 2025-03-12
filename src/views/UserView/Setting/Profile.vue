<script setup>
import Sidebar from '@/components/Sidebar.vue';
import { onMounted } from 'vue';
import { useAuthorize } from '@/stores/authorize';
import { storeToRefs } from 'pinia';
const myRole = useAuthorize()
const {userRole} = storeToRefs(myRole)
import { useRouter } from 'vue-router';  // Import vue-router for navigation
const router = useRouter();

onMounted(async () => {
  if(userRole.value === 'guest'){
    alert('Access Deny')
    router.back()
  }
});
</script>
 
<template>
<div class="flex flex row w-full justify-center p-20">
    <Sidebar/>
    <div class="pl-2 w-1/2 h-full">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div class="flex flex-col space-y-6">
            <h1>แก้ไขข้อมูลสมาชิก</h1>
            <h2>ข้อมูลสมาชิก</h2>

            <div class="flex flex-row items-center">
            <p for="min-price" class="w-32 text-lg">ชื่อ-นามสกุล:</p>
            <input v-model="name_surname" type="text" id="dormNumber" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-7/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อ-นามสกุล" required />
            </div>
            <div class="flex flex-row items-center">
            <p for="max-price" class="w-32 text-lg">อีเมล:</p>
            <input v-model="telephone" type="email" id="street" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-7/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อีเมล" required />
            </div>
            <div class="flex flex-row items-center">
            <p for="max-price" class="w-32 text-lg">เบอร์โทรศัพท์:</p>
            <input v-model="telephone" type="tel" id="street" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-7/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="หมายเลขโทรศัพท์" required />
            </div>
            <button class="ml-32 btn bg-orange-500 text-white hover:bg-orange-600 w-7/12">บันทึกข้อมูล</button>

            <h2>เปลี่ยนรหัสผ่าน</h2>
            <div class="flex flex-row items-center">
            <p for="min-price" class="w-32 text-lg">รหัสผ่านปัจจุบัน:</p>
            <input v-model="name_surname" type="password" id="dormNumber" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-7/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="รหัสผ่านปัจจุบัน" required />
            </div>
            <div class="flex flex-row items-center">
            <p for="max-price" class="w-32 text-lg">รหัสผ่านใหม่:</p>
            <input v-model="telephone" type="password" id="street" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-7/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="รหัสผ่านใหม่" required />
            </div>
            <div class="flex flex-row items-center">
            <p for="max-price" class="w-32 text-lg">ยืนยันรหัสผ่าน:</p>
            <input v-model="telephone" type="password" id="street" class="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-7/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ยืนยันรหัสผ่าน" required />
            </div>
            <button class="ml-32 btn bg-orange-500 text-white hover:bg-orange-600 w-7/12">เปลี่ยนรหัสผ่าน</button>

        
        </div>
    </div>
    </div>
</div>
</template>
 
<style scoped>
h1{
    font-size: 1.8rem;
}
h2{
    font-size: 1.4rem;
}
span{
   font-size: 1.2rem;
}
</style>