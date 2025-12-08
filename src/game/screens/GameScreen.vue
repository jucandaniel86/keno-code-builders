<script setup lang="ts">
import NumbersGrid from '../components/Game/NumbersGrid.vue'
import Prizes from '../components/Game/Prizes.vue'
import Bet from '../components/Game/Bet.vue'
import Logo from '../components/Game/Logo.vue'
import BottomActions from '../components/Game/BottomActions.vue'
import Timer from '../components/Game/Timer.vue'
import KenoTop from '../components/Game/KenoTop.vue'
import Tabs from '../components/Game/tabs/Tabs.vue'
import { storeToRefs } from 'pinia'
import { DevicesEnum, useAppStore } from '@/stores/app'

const { device } = storeToRefs(useAppStore())
</script>
<template>
  <div class="keno-container">
    <div class="keno-left-container">
      <Logo />
      <Prizes />
      <div class="draws-history">
        <h2>Draws History</h2>
        <div>content....</div>
      </div>
    </div>
    <div class="keno-right-container">
      <KenoTop />
      <div class="keno-main-container">
        <div class="keno-paytable">
          <Timer />
          <NumbersGrid />
          <BottomActions />
        </div>
        <div v-if="device === DevicesEnum.DESKTOP" class="keno-play-actions">
          <Bet />
          <Tabs />
        </div>
      </div>
    </div>
  </div>
</template>
