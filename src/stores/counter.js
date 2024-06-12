import { ref } from 'vue'
import { defineStore,acceptHMRUpdate } from 'pinia'

export const webMode = defineStore('webMode', () => {
  const mode = ref(false)
  const setMode = () => mode.value = !mode.value
  const getMode = () => mode.value

  return { getMode, setMode}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(webMode, import.meta.hot))
}
