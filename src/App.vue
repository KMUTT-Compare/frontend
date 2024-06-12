<script setup>
import Navbar from './components/Navbar.vue';
import { RouterView } from 'vue-router';
import {webMode} from './stores/counter';

const mode = webMode()
console.log(mode.getMode())

const isDarkMode = () =>{
    // const mode = webMode.getMode()
    // mode.value =! mode.value
    console.log(webMode)
}

</script>
 
<template>
<div :class="mode?'w-screen h-screen bg-black text-white':'w-screen h-screen'">

<Navbar/>
<div class="w-full flex justify-end p-3">
<label class="flex cursor-pointer gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
    <input @click="isDarkMode" v-model="mode" type="checkbox" value="synthwave" class="toggle theme-controller"/>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
</label>
</div>

<router-view></router-view>
</div>
</template>
 
<style scoped>

</style>