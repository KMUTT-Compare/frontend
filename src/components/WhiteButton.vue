<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  context:{
    type:String,
    required: true
  }
})
const { context } = props;
</script>
 
<template>
    <button class="btn">{{ context }}</button>
</template>
 
<style scoped>
button{
    background-color: white;
    border: 1px solid #888786;
    width: 180px;
    height: 60px;
}

button:hover{
    background-color: #e2e2e2;
    border-color: #888786; /* สีขอบเมื่อ hover */
    transform: scale(1.05); /* ขยายขนาดเล็กน้อยเมื่อ hover */
}

</style>