<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import { useLotteryMachine } from './useLotteryMatchine'

//types
type DrawComponent = {
  results: number[]
}
//props
const props = defineProps<DrawComponent>()

//composables
const { setExtractedNumbers } = useLotteryStore()

const { run, targetRef } = useLotteryMachine({
  playSound: true,
  onBallDrawn: (ballNumber: number) => {
    console.log('Drawn ball:', ballNumber)
    setExtractedNumbers(ballNumber)
  },
})

//emitters
const emitters = defineEmits(['onAnimationEnds'])

//mounted
onMounted(async () => {
  await nextTick()
  await run(props.results)

  emitters('onAnimationEnds')
})
</script>
<template>
  <div class="draw-container">
    <div ref="targetRef" />
  </div>
</template>
