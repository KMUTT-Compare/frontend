<script setup>
import { useUIStore } from '@/stores/uiStore';
import { ref, watch } from 'vue';
const FETCH_API = import.meta.env.VITE_API_ROOT;
const uiStore = useUIStore();

const switchPopup = () => {
    uiStore.closeRegisPopup();
    uiStore.openLoginPopup();
};

const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const phone = ref('');
const isAccept = ref(false);

const errors = ref({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    isAccept: ''
});

const validateName = () => {
    errors.value.name = name.value.trim() ? '' : 'กรุณากรอกชื่อ-นามสกุล';
};

const validateUsername = () => {
    errors.value.username = username.value.trim() ? '' : 'กรุณากรอกชื่อผู้ใช้';
};

const validateEmail = () => {
    errors.value.email = /^\S+@\S+\.\S+$/.test(email.value) ? '' : 'กรุณากรอกอีเมลที่ถูกต้อง';
};

const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/;
    errors.value.password = passwordRegex.test(password.value)
        ? ''
        : 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว และประกอบด้วย ตัวพิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ (@$!%*?&_-)';
};

const validateConfirmPassword = () => {
    errors.value.confirmPassword = confirmPassword.value === password.value ? '' : 'รหัสผ่านไม่ตรงกัน';
};

const validatePhone = () => {
    errors.value.phone = /^\d{10}$/.test(phone.value) ? '' : 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)';
};

const validateIsAccept = () => {
    errors.value.isAccept = isAccept.value ? '' : 'กรุณายอมรับเงื่อนไขก่อนสมัครสมาชิก';
};

// 🔹 ใช้ watch() เพื่อทำ Real-time Validation
watch(name, validateName);
watch(username, validateUsername);
watch(email, validateEmail);
watch(password, validatePassword);
watch(confirmPassword, validateConfirmPassword);
watch(phone, validatePhone);
watch(isAccept, validateIsAccept);



const register = async () => {
    // ตรวจสอบ validation ก่อน
    validateName();
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    validatePhone();
    validateIsAccept();

    // ถ้ามี error ในฟอร์ม ให้ return ออกก่อน
    if (Object.values(errors.value).some(error => error)) return;

    try {
        const response = await fetch(`${FETCH_API}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.value,
                username: username.value,
                email: email.value,
                password: password.value,
                phone: phone.value
            })
        });

        if(response.ok){
            alert('สมัครสมาชิกสำเร็จ!');
        }

        else{
            alert('สมัครสมาชิกไม่สำเร็จ');
        }

        // ปิด popup และเปิดหน้า login
        switchPopup();

    } catch (error) {
        console.error('Error:', error.message);
    }
};

</script>

<template>
<div  id="login-popup" tabindex="-1"
    class="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
    <div class="relative w-full max-w-sm md:max-w-md max-h-[90vh] h-auto md:h-auto">

        <div class="relative bg-white rounded-lg shadow">
            <button type="button"
                @click="uiStore.closeRegisPopup()"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close">
                <svg aria-hidden="true" class="w-5 h-5" fill="#c6c7c7" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                </svg>
            </button>

            <div class="p-4">
                <div class="text-center">
                    <p class="mb-2 text-2xl font-semibold leading-5 text-slate-900">
                        สร้างบัญชี
                    </p>
                    <p class="mt-2 text-sm leading-4 text-slate-600">
                        KMUTT Compare - JIP.
                    </p>
                </div>

                <form class="w-full mt-2" @submit.prevent="register">
                    <label class="pl-1">ชื่อผู้ใช้</label>
                    <input v-model="username" type="text" class="input" placeholder="Username">
                    <p v-if="errors.username" class="error">{{ errors.username }}</p>

                    <label class="pl-1">ชื่อ-นามสกุล</label>
                    <input v-model="name" type="text" class="input" placeholder="Name">
                    <p v-if="errors.name" class="error">{{ errors.name }}</p>

                    <label class="pl-1">อีเมล</label>
                    <input v-model="email" type="email" class="input" placeholder="Email Address">
                    <p v-if="errors.email" class="error">{{ errors.email }}</p>

                    <label class="pl-1">รหัสผ่าน</label>
                    <input v-model="password" type="password" class="input" placeholder="Password">
                    <p v-if="errors.password" class="error">{{ errors.password }}</p>

                    <label class="pl-1">ยืนยันรหัสผ่าน</label>
                    <input v-model="confirmPassword" type="password" class="input" placeholder="Confirm Password">
                    <p v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</p>

                    <label class="pl-1">เบอร์โทรศัพท์</label>
                    <input v-model="phone" type="text" class="input" placeholder="Phone">
                    <p v-if="errors.phone" class="error">{{ errors.phone }}</p>

                    <div class="flex items-center mt-2 mb-2">
                        <input v-model="isAccept" type="checkbox" class="w-4 h-4">
                        <label class="ml-2 text-sm">
                            ยอมรับ <a href="#" class="text-blue-600">ข้อตกลงการใช้งาน</a> และ 
                            <a href="#" class="text-blue-600">นโยบายความเป็นส่วนตัว</a>
                        </label>
                    </div>
                    <p v-if="errors.isAccept" class="error">{{ errors.isAccept }}</p>

                    <button type="submit" class="btn">
                        สมัคร
                    </button>
                </form>

                <div class="mt-6 text-center text-sm text-slate-600">
                    คุณมีบัญชีอยู่แล้วใช่ไหม?
                    <button @click="switchPopup" class="text-blue-600">
                        เข้าสู่ระบบ
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    outline: none;
    margin-bottom: 0.5rem;
}

.error {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.btn {
    width: 100%;
    background-color: black;
    color: white;
    padding: 0.75rem;
    border-radius: 5px;
}


</style>
