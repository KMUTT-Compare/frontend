<script setup>
import { useUIStore } from '@/stores/uiStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {useAuthorize} from '@/stores/authorize'
const useAuthor = useAuthorize()
const {setRole} = useAuthor
const token = ref(null)
const refreshToken = ref(null)

const FETCH_API = import.meta.env.VITE_API_ROOT
const router = useRouter()
const username = ref('')
const password = ref('')
const statusCode = ref(0)
const errText = ref('')
const activeClass = ref(false)
const className = ref('')
const warning = ref(false)
const uiStore = useUIStore();
const email = ref('');

const switchPopup = () =>{
  uiStore.closeLoginPopup();
  uiStore.openRegisPopup()
}

const login = async () =>{
  let user = {
    username : username.value.trim(),
    password : password.value.trim()
  }
  try {
        const res = await fetch(FETCH_API + '/token',{
                    method : "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user)
                  })


         //เข้าสู่ระบบเสร็จสมบูรณ์         
        if(res.status === 200){
          statusCode.value = 200
          errText.value = 'Login Successfully'
          activeClass.value = true
          className.value = 'alert-success'

          const tokens = await res.json()

          token.value = tokens.token
          refreshToken.value = tokens.refreshToken
          
          localStorage.setItem("token",token.value)
          localStorage.setItem("refreshToken",refreshToken.value)

          setRole(token.value)

          router.push({name:'Home'})

        }else if(res.status === 404){
          statusCode.value = 404
          errText.value = 'A user with the specified username DOES NOT exist'
          activeClass.value = true
          className.value = 'alert-error'
        }else if(res.status === 401){
          statusCode.value = 401
          errText.value = 'Password Incorrect'
          activeClass.value = true
          className.value = 'alert-error'
        }
        warning.value = true   
    } catch (error) {
        console.log('error ',error)
        router.push('/login');
    }
}

</script>
 
<template>
<div id="login-popup" tabindex="-1"
    class="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
    <div class="relative p-4 w-full max-w-md h-full md:h-auto">

        <div class="relative bg-white rounded-lg shadow">
            
            <button type="button"
                @click="uiStore.closeLoginPopup();"
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
                        Login to your account
                    </p>
                    <p class="mt-2 text-sm leading-4 text-slate-600">
                        You must be logged in to perform this action.
                    </p>
                </div>


                <form class="w-full mt-7" @submit.prevent="login">
                    <label for="email" class="sr-only">Username/Email address</label>
                    <input v-model="email" name="email" type="email" autocomplete="email" required=""
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                        placeholder="Username/Email address" value="">
                    
                    <label for="password" class="sr-only">Password</label>
                    <input v-model="password" name="password" type="password" autocomplete="current-password" required=""
                        class="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                        placeholder="Password" value="">
                    
                        <p class="mb-3 mt-2 text-sm text-gray-500">
                        <a href="/forgot-password" class="text-blue-800 hover:text-blue-600">Reset your password?</a>
                    </p>
                    <button type="submit"
                        class="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400">
                        เข้าสู่ระบบ
                    </button>
                </form>

                <div class="flex justify-center">
                  <button @click="switchPopup" class="mt-3 text-sm text-slate-900 hover:text-slate-600">
                      Don't have an account?
                  </button>
                </div>
            </div>
        </div>
    </div>
</div>

</template>
 
<style scoped>

</style>