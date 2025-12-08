import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum DevicesEnum {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile',
}

export const useAppStore = defineStore('app', () => {
  //models
  const width = ref(0)
  const height = ref(0)
  const device = ref<DevicesEnum>(DevicesEnum.DESKTOP)

  const setAppSize = (_width: number, _height: number) => {
    width.value = _width
    height.value = _height
  }

  const setDevice = (_device: DevicesEnum) => {
    device.value = _device
  }

  return { width, height, device, setDevice, setAppSize }
})
