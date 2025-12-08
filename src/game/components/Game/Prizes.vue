<script setup lang="ts">
import { useUtils } from '@/core/core.Util'
import { usePrizes } from '@/game/composables/usePrizes'

import { computed } from 'vue'

const { currentPrizes } = usePrizes()
const { isSet } = useUtils()

const displayCurrentPrizes = computed(() => {
  return new Array(20).fill(null).map((el: any, index: number) => {
    if (isSet(currentPrizes.value[index])) {
      return currentPrizes.value[index]
    }
    return null
  })
})
</script>
<template>
  <div class="paytable-container">
    <h2>Paytable</h2>

    <table class="prizes-list">
      <thead>
        <tr>
          <th>Matches</th>
          <th>Prize</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(prize, i) in displayCurrentPrizes" :key="`Prize${i}`">
          <td>{{ prize && isSet(prize.match) ? prize.match : '' }}</td>
          <td>{{ prize && isSet(prize.multiplier) ? prize.multiplier : '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
