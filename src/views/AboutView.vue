<script setup>

</script>
 
<template>
<div class="box">
    <p class="bg-red-600">1</p>
    <p class="bg-green-600">2</p>
    <p class="bg-blue-600">3</p>
    <div class="item">
        <p class="bg-pink-600">4</p>
    </div>
   
</div>
</template>
 
<style scoped>
.box{
    margin-top: 5%;
    display: flex;
    flex-direction: row;
    background-color: rgb(255, 239, 99);
    justify-content:space-evenly;
    align-items: flex-start;
    height: 50px;
}

.item{
    width: 200px;
    text-align: center;
    display: flex;
    justify-content: center;
    
}
</style>