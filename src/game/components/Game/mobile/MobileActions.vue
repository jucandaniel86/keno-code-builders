<script setup lang="ts">
import { KenoGameTabsE } from '@/config/app.config'
import Bet from '../Bet.vue'
import Tabs from '../tabs/Tabs.vue'
</script>
<template>
  <div class="mobile-actions-container">
    <Tabs :tabs="[KenoGameTabsE.BETS, KenoGameTabsE.FUTURE, KenoGameTabsE.DRAWS]" />
    <Bet />
  </div>
</template>
<style lang="css" scoped>
@import url(./MobileActions.css);
</style>
