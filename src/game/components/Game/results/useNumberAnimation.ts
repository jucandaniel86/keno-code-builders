import { ref, computed } from 'vue'

export interface NumberAnimationConfig {
  duration?: number // ms
  delay?: number // ms
  easing?: 'linear' | 'easeOut' | 'easeIn' | 'easeInOut'
}

export function useNumberAnimation(config: NumberAnimationConfig = {}) {
  const { duration = 2000, delay = 0, easing = 'easeOut' } = config

  const targetValue = ref(0)
  const displayValue = ref(0)
  const isAnimating = ref(false)
  const startTime = ref(0)

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
  const easeIn = (t: number) => Math.pow(t, 3)
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  const easingFunctions: Record<string, (t: number) => number> = {
    linear: (t) => t,
    easeOut,
    easeIn,
    easeInOut,
  }

  const getEasedValue = (t: number) => {
    const easingFn = easingFunctions[easing] || easeOut
    return easingFn(Math.min(1, t))
  }

  const formatValue = (value: number): string => {
    return value.toFixed(2)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const animate = (currentTime: number) => {
    if (startTime.value === 0) {
      startTime.value = currentTime
    }

    const elapsed = currentTime - startTime.value - delay
    if (elapsed < 0) {
      requestAnimationFrame(animate)
      return
    }

    if (elapsed >= duration) {
      displayValue.value = targetValue.value
      isAnimating.value = false
      return
    }

    const progress = elapsed / duration
    const easedProgress = getEasedValue(progress)
    displayValue.value = targetValue.value * easedProgress
    requestAnimationFrame(animate)
  }

  const play = (value: number, customDuration?: number): Promise<number> => {
    return new Promise((resolve) => {
      targetValue.value = Math.abs(value)
      displayValue.value = 0
      isAnimating.value = true
      startTime.value = 0

      const animationDuration = customDuration ?? duration
      const animateWithDuration = (currentTime: number) => {
        if (startTime.value === 0) {
          startTime.value = currentTime
        }

        const elapsed = currentTime - startTime.value - delay
        if (elapsed < 0) {
          requestAnimationFrame(animateWithDuration)
          return
        }

        if (elapsed >= animationDuration) {
          displayValue.value = targetValue.value
          isAnimating.value = false
          resolve(targetValue.value)
          return
        }

        const progress = elapsed / animationDuration
        const easedProgress = getEasedValue(progress)
        displayValue.value = targetValue.value * easedProgress
        requestAnimationFrame(animateWithDuration)
      }

      requestAnimationFrame(animateWithDuration)
    })
  }

  const stop = () => {
    isAnimating.value = false
    startTime.value = 0
  }

  return {
    displayValue: computed(() => formatValue(displayValue.value)),
    targetValue: computed(() => targetValue.value),
    isAnimating: computed(() => isAnimating.value),
    play,
    stop,
  }
}
