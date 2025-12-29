<script setup lang="ts">
import _ from 'lodash'
import { useUtils } from '@/core/core.Util'
import { usePrizes } from '@/game/composables/usePrizes'
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLotteryStore } from '@/stores/lottery'
import { DevicesEnum, useAppStore } from '@/stores/app'

const { currentPrizes } = usePrizes()
const { isSet } = useUtils()
const { nextDrawSeconds } = storeToRefs(useLotteryStore())
const { device } = storeToRefs(useAppStore())

const interval = ref()
const localTimer = ref(nextDrawSeconds.value)
const displayCurrentPrizes = computed(() => {
  return _.sortBy(currentPrizes.value, ['match'], 'asc').reverse().splice(0, 6)
})

const timerSeconds = computed(() => {
  const minutes = Math.floor(localTimer.value / 60)
  const seconds = localTimer.value % 60

  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
})

const init = () => {
  clearInterval(interval.value)
  interval.value = setInterval(() => {
    if (localTimer.value <= 0) {
      clearInterval(interval.value)
      return
    }
    localTimer.value = localTimer.value - 1
  }, 1000)
}

watch(nextDrawSeconds, () => {
  localTimer.value = nextDrawSeconds.value
  init()
})

onMounted(() => {
  init()
})
</script>
<template>
  <div class="paytable-container">
    <div class="prizes-timer" v-if="device === DevicesEnum.MOBILE || device === DevicesEnum.TABLET">
      {{ timerSeconds }}
    </div>
    <span v-if="displayCurrentPrizes.length === 0" class="pick-disclaimer"
      >Pick up to 40 numbers</span
    >
    <template v-else>
      <div class="paytable-headers">
        <span>Match</span>
        <span>Pay</span>
      </div>
      <div class="paytable-values">
        <div class="paytable-prize" v-for="(prize, i) in displayCurrentPrizes" :key="`Prize${i}`">
          <span class="paytable-prize-match">{{
            prize && isSet(prize.match) ? prize.match : ''
          }}</span>
          <span class="paytable-prize-value">{{
            prize && isSet(prize.multiplier) ? prize.multiplier : ''
          }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
