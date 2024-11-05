<script setup>
import Sidebar from '@/components/Sidebar.vue';
</script>
 
<template>
<div class="flex flex row w-full justify-center p-20">
    <Sidebar/>
    <div class="pl-2 w-1/2 h-full">
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700"></div> 
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