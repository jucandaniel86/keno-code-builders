<script setup lang="ts">
import { KenoGameTabsE } from '@/config/app.config'
import Bet from '../Bet.vue'
import Tabs from '../tabs/Tabs.vue'

//type
interface Props {
  disabled: boolean
}
const props = defineProps<Props>()
</script>
<template>
  <div class="mobile-actions-container">
    <Tabs :tabs="[KenoGameTabsE.BETS, KenoGameTabsE.FUTURE, KenoGameTabsE.DRAWS]" />
    <Bet :disabled="props.disabled" />
  </div>
</template>
<style lang="css" scoped>
@import url(./MobileActions.css);
</style>
