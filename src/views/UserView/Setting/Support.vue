<script setup>
import Sidebar from '@/components/Sidebar.vue';
</script>

<template>
<div class="flex flex-row w-full justify-center p-20">
    <Sidebar />
    <div class="pl-2 w-1/2 h-full">
        <!-- Section for Support -->
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <h1 class="font-bold text-3xl mb-6">ยินดีต้อนรับสู่หน้าสนับสนุน</h1>
            <p class="text-lg mb-4">หากคุณพบปัญหาหรือมีคำถามเกี่ยวกับการใช้งานเว็บไซต์ของเรา ทีมงานยินดีที่จะช่วยเหลือคุณ</p>

            <!-- Section for Contact Information -->
            <h2 class="text-2xl font-semibold mb-4">วิธีการติดต่อเรา</h2>
            <p class="mb-4">คุณสามารถติดต่อเราผ่านช่องทางต่างๆ ดังนี้:</p>
            <ul class="list-disc pl-6 mb-6">
                <li><span class="font-medium">อีเมล:</span> <a href="mailto:support@example.com" class="text-blue-500">jipjip.kmutt.compare@gmail.com</a></li>
                <li><span class="font-medium">เบอร์โทรศัพท์:</span> 123-456-7890 (จันทร์ - ศุกร์, 9.00 - 18.00 น.)</li>
                <li><span class="font-medium">แชทออนไลน์:</span> คุณสามารถใช้ฟีเจอร์แชทของเราผ่านทางเว็บไซต์เพื่อพูดคุยกับตัวแทนฝ่ายสนับสนุนได้ทันที</li>
            </ul>

            <!-- Section for FAQs -->
            <h2 class="text-2xl font-semibold mb-4">คำถามที่พบบ่อย</h2>
            <p class="mb-4">หากคุณมีคำถามที่พบบ่อย, เราขอแนะนำให้คุณตรวจสอบคำถามที่พบบ่อยที่หน้า <a href="/faq" class="text-blue-500">คำถามที่พบบ่อย</a> ของเรา ซึ่งอาจช่วยให้คุณแก้ไขปัญหาหรือข้อสงสัยได้ทันที</p>

            <!-- Section for Issue Reporting -->
            <h2 class="text-2xl font-semibold mb-4">แจ้งปัญหาหรือข้อเสนอแนะ</h2>
            <p class="mb-4">หากคุณพบปัญหาในการใช้งานเว็บไซต์ หรือมีข้อเสนอแนะในการปรับปรุง, กรุณาส่งอีเมลมาที่ <a href="mailto:support@example.com" class="text-blue-500">jipjip.kmutt.compare@gmail.com</a>.</p>
            
        </div>
    </div>
</div>
</template>

<style scoped>
h1{
    font-size: 2rem;
    color: #2b2b2b;
}

h2{
    font-size: 1.5rem;
    color: #333;
}

p {
    font-size: 1rem;
    line-height: 1.6;
    color: #666;
}

span {
   font-size: 1rem;
   color: #333;
}

ul {
    list-style-type: disc;
    margin-left: 20px;
}

button {
    background-color: #007BFF;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}
</style>
