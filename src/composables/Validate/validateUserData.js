// src/composables/useValidation.js

// ฟังก์ชันการตรวจสอบอีเมล
export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // ฟังก์ชันการตรวจสอบเบอร์โทร
  export const validatePhone = (phone) => {
    return /^[0-9]{1,10}$/.test(phone);
  };
  
  // ฟังก์ชันการตรวจสอบชื่อ
  export const validateName = (name) => {
    return /^[A-Za-zก-๙\s]+$/.test(name) && name.length <= 50;
  };

  export const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^#&*()_+{}\[\]:;<>,.?/~\\|-])[\S]{8,}$/.test(password)
  }
  
  