import { useAppStore } from '@/stores/app'
import { useWindowSize, useDebounceFn, useEventListener } from '@vueuse/core'
import { onMounted } from 'vue'

export const useHTMLEvents = () => {
  const { setAppSize } = useAppStore()

  const onResize = useDebounceFn(() => {
    const { width, height } = useWindowSize()
    setAppSize(width.value, height.value)
  }, 1000)

  onMounted(() => {
    onResize()
    useEventListener(window, 'resize', onResize)
  })
}
