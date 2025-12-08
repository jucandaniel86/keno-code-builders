import { DevicesEnum, useAppStore } from '@/stores/app'
import { useWindowSize, useDebounceFn, useEventListener } from '@vueuse/core'
import { onMounted } from 'vue'

const DEVICES = [
  { maxWidth: 480, minWidth: 0, device: DevicesEnum.MOBILE },
  { maxWidth: 768, minWidth: 481, device: DevicesEnum.TABLET },
  { maxWidth: 3000, minWidth: 769, device: DevicesEnum.DESKTOP },
]

export const useHTMLEvents = () => {
  const { setAppSize, setDevice } = useAppStore()

  const onResize = useDebounceFn(() => {
    const { width, height } = useWindowSize()

    setAppSize(width.value, height.value)

    DEVICES.forEach((device) => {
      if (device.minWidth < width.value && device.maxWidth > width.value) {
        return setDevice(device.device)
      }
    })
  }, 1000)

  onMounted(() => {
    onResize()
    useEventListener(window, 'resize', onResize)
  })
}
