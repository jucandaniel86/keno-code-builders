<script setup lang="ts">
import { BETTING_WARNING_SECONDS, GAME_NAME } from '@/config/app.config'
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import Prizes from './Prizes.vue'
import { DevicesEnum, useAppStore } from '@/stores/app'

const { nextDrawSeconds, drawNumber, nextTimestamp, lastTimestamp, activeGame } =
  storeToRefs(useLotteryStore())
const { device } = storeToRefs(useAppStore())

const TOTAL_SECONDS = ref(
  (new Date(nextTimestamp.value).getTime() - new Date(lastTimestamp.value).getTime()) / 1000,
)
const interval = ref()
const warning = ref<boolean>(false)
const localTimer = ref(nextDrawSeconds.value)

//emitters
const emitters = defineEmits(['onTimerEnds'])

//methods
const init = () => {
  clearInterval(interval.value)
  interval.value = setInterval(() => {
    if (localTimer.value <= 0) {
      emitters('onTimerEnds')
      clearInterval(interval.value)
      return
    }
    localTimer.value = localTimer.value - 1

    if (localTimer.value <= BETTING_WARNING_SECONDS) {
      warning.value = true
    } else {
      warning.value = false
    }
  }, 1000)
}

onMounted(() => {
  init()
})

//computed
const progressBarWidth = computed(() => {
  return (localTimer.value / TOTAL_SECONDS.value) * 100
})

const timerSeconds = computed(() => {
  const minutes = Math.floor(localTimer.value / 60)
  const seconds = localTimer.value % 60

  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
})

watch(nextDrawSeconds, () => {
  localTimer.value = nextDrawSeconds.value
  init()
})
</script>
<template>
  <div class="timer-wrapper">
    <div class="timer-game-details">
      <div
        class="timer-draw-details"
        v-if="device === DevicesEnum.DESKTOP || device === DevicesEnum.TABLET"
      >
        <span>{{ GAME_NAME }}</span>
        <span>{{ activeGame }}</span>
        <span class="draw-number">#{{ drawNumber }}</span>
      </div>
      <Prizes />
    </div>

    <div class="timer-progress-wrapper" v-if="device === DevicesEnum.DESKTOP">
      <span class="timer-seconds" :class="{ betwarning: warning }">{{ timerSeconds }}</span>
      <span class="timer-status-text" :class="{ betwarning: warning }">Please place your bets</span>
    </div>
    <div class="progress-bar-wrapper" :style="{ opacity: localTimer === 0 ? 0 : 10 }">
      <div
        class="bar"
        :class="{ barwarning: warning }"
        :style="{ width: `${progressBarWidth}%` }"
      ></div>
    </div>
  </div>
</template>
