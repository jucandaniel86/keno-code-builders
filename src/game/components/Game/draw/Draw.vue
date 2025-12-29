<script setup lang="ts">
import { nextTick, onMounted, ref, onUnmounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import { useLotteryMachine } from './useLotteryMatchine'
import { MAX_DAWED_BALLS } from '@/config/app.config'
import SoundManager from '@/core/core.Sounds'

//types
type DrawComponent = {
  results: number[]
}
//props
const props = defineProps<DrawComponent>()

//models
const currentDrawNunber = ref<number>(0)

//composables
const { setExtractedNumbers } = useLotteryStore()

const { run, targetRef } = useLotteryMachine({
  playSound: true,
  onBallDrawn: (ballNumber: number) => {
    SoundManager.Instance().play('REVEALED')
    currentDrawNunber.value += 1
    setExtractedNumbers(ballNumber)
  },
})

//emitters
const emitters = defineEmits(['onAnimationEnds'])

//mounted
onMounted(async () => {
  console.log('DRAW ANIMATION STARTS', props.results)
  await nextTick()
  await run(props.results)
  console.log('DRAW ANIMATION ENDS')
  emitters('onAnimationEnds')
})

onUnmounted(() => {
  currentDrawNunber.value = 0
})
</script>
<template>
  <div class="draw-container">
    <span class="draw-status">{{ currentDrawNunber }} / {{ MAX_DAWED_BALLS }}</span>
    <div ref="targetRef" />
  </div>
</template>
