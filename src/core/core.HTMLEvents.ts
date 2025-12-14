import { DevicesEnum, useAppStore } from '@/stores/app'
import { useWindowSize, useDebounceFn, useEventListener } from '@vueuse/core'
import { onMounted } from 'vue'

const DEVICES = [
  { maxWidth: 480, minWidth: 0, device: DevicesEnum.MOBILE },
  { maxWidth: 950, minWidth: 481, device: DevicesEnum.TABLET },
  { maxWidth: 3000, minWidth: 951, device: DevicesEnum.DESKTOP },
]

export const useHTMLEvents = () => {
  const { setAppSize, setDevice } = useAppStore()

  const onResizeCallback = () => {
    const { width, height } = useWindowSize()

    setAppSize(width.value, height.value)

    DEVICES.forEach((device) => {
      if (device.minWidth < width.value && device.maxWidth > width.value) {
        return setDevice(device.device)
      }
    })
    const appEl = document.querySelector('#app')
    if (appEl) {
      appEl.classList.remove('resize')
    }
  }

  const onResize = useDebounceFn(() => onResizeCallback(), 1000)

  onMounted(() => {
    onResizeCallback()
    useEventListener(window, 'resize', () => {
      const appEl = document.querySelector('#app')
      if (appEl) {
        appEl.classList.add('resize')
      }
      onResize()
    })
  })
}
