<script setup>
import { useUIStore } from '@/stores/uiStore';
import {ref} from 'vue'

const uiStore = useUIStore();

const switchPopup = () =>{
    uiStore.closeRegisPopup()
    uiStore.openLoginPopup()
}

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')
const isAccept = ref(null)

const register = async() =>{

//    const response = await axios.post('users',{
//         name: name.value,
//         email: email.value,
//         password: password.value,
//         confirmPassword: confirmPassword.value,
//         phone: phone.value,
//         isAccept: isAccept.value
//     })
//     console.log(response)
//     this.$router.push('/login')
  
}

</script>
 
<template>
<div id="login-popup" tabindex="-1"
    class="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
    <div class="relative w-full max-w-md h-full md:h-auto">

        <div class="relative bg-white rounded-lg shadow">
            
            <button type="button"
                @click="uiStore.closeRegisPopup()"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close"><svg
                    aria-hidden="true" class="w-5 h-5" fill="#c6c7c7" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        cliprule="evenodd"></path>
                </svg>
                <span class="sr-only">Close popup</span>
            </button>

            <div class="p-5">
                <h3 class="text-2xl mb-0.5 font-medium"></h3>
                <p class="mb-4 text-sm font-normal text-gray-800"></p>

                <div class="text-center">
                    <p class="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                        Register
                    </p>
                    <p class="mt-2 text-sm leading-4 text-slate-600">
                        KMUTT Comfort - JIP.
                    </p>
                </div>


                <form class="w-full mt-7" @submit.prevent="register">

                    <label for="name" class="pl-1">ชื่อ-นามสกุล</label>
                    <input v-model="name" name="name" type="name" autocomplete="name" required=""
                        class="mt-2 mb-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                        placeholder="Name" value="">

                    <label for="email" class="pl-1">อีเมล</label>
                    <input v-model="email" name="email" type="email" autocomplete="email" required=""
                        class="mt-2 mb-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                        placeholder="Email Address" value="">

                    <label for="password" class="pl-1">รหัสผ่าน</label>
                    <input v-model="password" name="password" type="password" autocomplete="password" required=""
                        class="mt-2 mb-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                        placeholder="Password" value="">
                        

                    <label for="confirmPassword" class="pl-1">ยืนยัน Password</label>
                    <input v-model="confirmPassword" name="confirmPassword" type="password" autocomplete="current-password" required=""
                        class="mt-2 mb-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                        placeholder="Confirm Password" value="">

                    <label for="phone" class="pl-1">เบอร์โทรศัพท์</label>
                    <input v-model="phone" name="phone" type="phone" autocomplete="phone" required=""
                        class="mt-2 mb-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                        placeholder="Phone" value="">


                    <div class="flex items-center mt-6 mb-6">
                        <input v-model="isAccept" id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                        <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">ยอมรับเงื่อนไข<a href="#" class="text-blue-600 dark:text-blue-500 hover:underline"> ข้อตกลงการใช้งาน</a> และ <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline">นโยบายความเป็นส่วนตัว</a></label>
                    </div>

                    <button type="submit"
                        class="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400">
                        สมัคร
                    </button>
                </form>

                <div class="mt-6 text-center text-sm text-slate-600">
                    Already have an account?
                    <button @click="switchPopup" class="font-medium text-blue-600 hover:text-blue-400">
                        Sign in
                  </button>
                </div>
                
                 
                
            </div>
        </div>
    </div>
</div>

</template>
 
<style scoped>

</style>