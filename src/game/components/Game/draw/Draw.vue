<script setup lang="ts">
import { onMounted } from 'vue'
import { useDrawAnimation } from './Draw.animation'

type DrawComponent = {
  results: number[]
}
const props = defineProps<DrawComponent>()

const { startDraw, status, canvas, drawedBalls } = useDrawAnimation()

onMounted(async () => {
  await startDraw(props.results, {
    delayBetween: 1000,
  })
})
</script>
<template>
  <div class="draw-container">
    <div class="status">{{ status }}</div>
    <div class="current-ball"></div>
    <canvas :ref="canvas" id="canvas-draw-animation" width="400" height="320"></canvas>
    <div class="results">
      <div
        v-for="(result, i) in drawedBalls"
        :key="`Result${i}`"
        class="ball-small"
        :style="{ '--accent': result.color }"
      >
        {{ result.num }}
      </div>
    </div>
  </div>
</template>
