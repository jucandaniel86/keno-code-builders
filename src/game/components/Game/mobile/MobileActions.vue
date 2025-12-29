<script setup lang="ts">
import { KenoGameTabsE, LotteryStatusTypes } from '@/config/app.config'
import Bet from '../Bet.vue'
import Tabs from '../tabs/Tabs.vue'
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'

//type
interface Props {
  disabled: boolean
}
//props
const props = defineProps<Props>()

//stores
const { lotteryStatus } = storeToRefs(useLotteryStore())
</script>
<template>
  <div class="mobile-actions-container">
    <Tabs :tabs="[KenoGameTabsE.BETS, KenoGameTabsE.FUTURE, KenoGameTabsE.DRAWS]" />
    <Bet
      :disabled="props.disabled"
      v-if="
        [LotteryStatusTypes.DRAW_START, LotteryStatusTypes.DRAW_ENDS].indexOf(lotteryStatus) === -1
      "
    />
  </div>
</template>
<style lang="css" scoped>
@import url(./MobileActions.css);
</style>
