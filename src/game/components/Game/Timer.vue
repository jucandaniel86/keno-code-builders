<script setup lang="ts">
import { BETTING_WARNING_SECONDS } from '@/config/app.config'
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

const { nextDrawSeconds, drawNumber } = storeToRefs(useLotteryStore())
const TOTAL_SECONDS = 150
const interval = ref()
const warning = ref<boolean>(false)
const localTimer = ref(nextDrawSeconds.value)

onMounted(() => {
  interval.value = setInterval(() => {
    if (localTimer.value - 1 <= 0) {
      clearInterval(interval.value)
    }
    localTimer.value = localTimer.value - 1

    if (localTimer.value <= BETTING_WARNING_SECONDS) {
      warning.value = true
    }
  }, 1000)
})

//computed
const progressBarWidth = computed(() => {
  return (localTimer.value / TOTAL_SECONDS) * 100
})

const timerSeconds = computed(() => {
  const minutes = Math.floor(nextDrawSeconds.value / 60)
  const seconds = localTimer.value - minutes * 60

  const lMinutes = String(minutes).length === 1 ? `0${minutes}` : minutes
  const lSeconds = String(seconds).length === 1 ? `0${seconds}` : seconds

  return `${lMinutes}:${lSeconds}`
})
</script>
<template>
  <div class="timer-wrapper">
    <div class="timer-draw-details">
      <span>KENO</span>
      <span>CLASSIC</span>
      <span class="draw-number">#{{ drawNumber }}</span>
    </div>
    <div class="timer-progress-wrapper">
      <span class="timer-seconds" :class="{ betwarning: warning }">{{ timerSeconds }}</span>
      <span class="timer-status-text" :class="{ betwarning: warning }">Please place your bets</span>
    </div>
    <div class="progress-bar-wrapper">
      <div
        class="bar"
        :class="{ barwarning: warning }"
        :style="{ width: `${progressBarWidth}%` }"
      ></div>
    </div>
  </div>
</template>
