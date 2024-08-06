<script setup>
import Navbar from './components/Navbar.vue';
import { RouterView } from 'vue-router';


</script>
 
<template>
<div class="font-itim-regular">
    <Navbar/>
    <router-view></router-view>
</div>
</template>
 
<style scoped>

</style>