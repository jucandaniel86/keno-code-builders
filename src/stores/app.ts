import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  //models
  const width = ref(0)
  const height = ref(0)

  const setAppSize = (_width: number, _height: number) => {
    width.value = _width
    height.value = _height
  }

  return { width, height, setAppSize }
})
