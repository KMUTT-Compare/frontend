<script setup>
import {ref} from 'vue'
const counter = ref(1)
const footer = "<i>Schoo of Information Technology, KMUTT</i>"
const isOn = ref(true)
function onOff(){
  isOn.value = !isOn.value
}


</script>
 
<template>
<div class="w-screen h-screen">

  <div class="flex-col justify-center m-2">
    
  <div class="w-full">
    <!-- v-html แสดงค่าตัวแปรเป็น html-->
    <p v-html="footer"></p>
    <!-- v-text แสดงค่าตัวแปรเป็น text ธรรมดา-->
    <p v-text="footer"></p>
  </div>

  <div class="w-full flex space-x-5 items-center justify-center">
    <!-- v-bind ทำให้ attribute เป็นแบบ dynamic สามารถเปลี่ยนแปลงค่าได้-->
    <button :disabled="counter<1" @click="counter--" class="btn bg-red-500 text-white text-xl">-</button>
    <h1>Counter: {{ counter }}</h1>
    <button :disabled="counter>9" @click="counter++" class="btn bg-green-500 text-white text-xl">+</button>
  </div>

  <div>
    <button class="btn" @click="onOff">ทักทาย</button>
    <p v-show="isOn">สวัสดีจ้าา</p>
  </div>



  </div>
  
  
</div>
</template>
 
<style scoped>

</style>