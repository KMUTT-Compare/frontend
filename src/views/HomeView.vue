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

  <div class="m-10 p-10">

      <div class="card w-96 bg-base-100 shadow-xl">
        <figure><img src="https://cdn.pixabay.com/photo/2019/05/06/23/35/vat-4184607_1280.jpg" alt="Shoes" /></figure>
        <div class="card-body">
          <h2 class="card-title">คำนวณ VAT</h2>
          <p>คำนวณภาษีหัก ณ ที่จ่าย และ ภาษีมูลค่าเพิ่ม (VAT)</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">เริ่มคำนวณ</button>
          </div>
        </div>
      </div>

  </div>

  
</div>
</template>
 
<style scoped>

</style>