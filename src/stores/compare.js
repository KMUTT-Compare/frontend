import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompareStore = defineStore('compare', () => {
    const dormitoryDetail = ref('')
    const main = ref('')
    const sub = ref('')

      const loadDetail = async () => {

        try {
          const res = await fetch(`${API_ROOT}/dormitories/${params.id}`, {
            headers: {
              "Content-Type": "application/json",
            }
          });
              if(res.ok){
              dormitoryDetail.value = await res.json();
            }
      
            } catch (error) {
                console.log('error ',error)
            }
      };

})