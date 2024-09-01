<script setup>

</script>
 
<template>
    <div class="footer">
        <div class="text-footer space-y-2">
            <h3>About Us</h3>
            <p>Dormitory in the university area</p>
        </div>
        <div class="text-footer space-y-2">
            <h3>Support</h3>
            <p>ORDER TRACKING</p>
            <p>PRIVACY POLICY</p>
            <p>FAQ</p>
            <p>CONTACT US</p>
        </div>
        <div class="text-footer space-y-2">
            <h3>Follow Us</h3>

        <div class="flex flex-row space-x-2">          
            <textarea id="chat" rows="1" class="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your email..."></textarea>
            <button class="btn bg-orange-600 border-orange-600 hover:bg-orange-700 hover:border-orange-700">SUBMIT</button>
        </div>  

        </div>
    </div>
</template>
 
<style scoped>
.footer{
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: auto;
    column-gap: 30px;
    row-gap: 20px;
    justify-items: center;
    height: 400px;
    width: 100%;
    color: white;
    background-color: black;
}

h3{
    font-size: 20px;
}

.text-footer{
    padding-top: 50px;
}

</style>