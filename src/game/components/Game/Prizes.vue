<script setup lang="ts">
import _ from 'lodash'
import { useUtils } from '@/core/core.Util'
import { usePrizes } from '@/game/composables/usePrizes'
import { computed } from 'vue'

const { currentPrizes } = usePrizes()
const { isSet } = useUtils()

const displayCurrentPrizes = computed(() => {
  return _.sortBy(currentPrizes.value, ['match'], 'asc').reverse().splice(0, 6)
})
</script>
<template>
  <div class="paytable-container">
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
