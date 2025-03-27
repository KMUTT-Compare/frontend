<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import { clearToken } from '@/composables/Authentication/clearToken';
import SuccessModal from '@/components/modals/SuccessModal.vue';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const isSuccessModelOpen = ref(false)

const showPopup = ref(false);
const username = ref('');
const password = ref('');
const confirmText = ref('');
const requiredText = 'ต้องการลบบัญชีนี้';

const confirmDelete = async () => {
    if (confirmText.value !== requiredText) {
        alert('กรุณาพิมพ์ข้อความให้ถูกต้อง');
        return;
    }
    if (!username.value || !password.value) {
        alert('กรุณากรอก Username และ Password');
        return;
    }

    try {
        // ตรวจสอบ Username และ Password
        const response = await fetch(`${API_ROOT}/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('token')
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            }),
        });

        if (!response.ok) {
            alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            return;
        }

        // ลบบัญชี
        const deleteResponse = await fetch(`${API_ROOT}/user/me`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        });

        const resText = await deleteResponse.text(); // ใช้ .text() แทน .json()

        if (deleteResponse.ok) {
            isSuccessModelOpen.value =true
            showPopup.value = false;
            clearToken(); // ลบ Token
            
            
              
        } else {
            alert(resText || 'เกิดข้อผิดพลาดในการลบบัญชี');
        }
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        console.error(error);
    }
};
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
            
            <!-- Delete Account -->
            <h2 class="text-2xl font-semibold mb-4">การเป็นเจ้าของและการควบคุมบัญชี</h2>
            <p class="mb-4">การลบโปรไฟล์ หรือบัญชีของคุณ จะมีผลถาวร เมื่อคุณลบโปรไฟล์ คุณจะไม่สามารถดึงเนื้อหาหรือข้อมูลที่คุณเคยแชร์บน Kmutt Compare โดยใช้โปรไฟล์นี้ได้ หอพัก และฟอร์มต่างๆ ทั้งหมดของคุณก็จะถูกลบด้วยเช่นกัน</p>
            <button @click="showPopup=!showPopup">ลบบัญชี</button>
        </div>
    </div>

         <!-- Popup Confirm Delete -->
        <div v-if="showPopup" class="popup-overlay">
            <div class="popup-content">
                <h2>ยืนยันการลบบัญชี</h2>
                <p>กรุณากรอกข้อมูลเพื่อยืนยันการลบบัญชี</p>
                
                <input v-model="username" placeholder="Username" />
                <input v-model="password" type="password" placeholder="Password" />
                <p>กรุณาป้อนข้อความด้านล่างเพื่อยืนยันการลบบัญชี</p>
                <input v-model="confirmText" placeholder="พิมพ์ 'ต้องการลบบัญชีนี้'" />

                <div class="popup-buttons">
                    <button @click="confirmDelete" class="confirm">ยืนยัน</button>
                    <button @click="showPopup = false" class="cancel">ยกเลิก</button>
                </div>
            </div>
        </div>
        <div v-if="isSuccessModelOpen">
            <SuccessModal title="บัญชีของคุณได้ถูกลบเรียบร้อยแล้ว"/>
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
    background-color: #ea2300;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #c71e01;
}

/* Popup Style */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    text-align: center;
}

.popup-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
}

input {
    display: block;
    width: 100%;
    margin: 8px 0;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.confirm {
    background-color: #ea2300;
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.cancel {
    background-color: gray;
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}
</style>
