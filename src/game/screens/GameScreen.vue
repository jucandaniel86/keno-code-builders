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
import { GAME_TYPES_ENUM, KenoGameTabsE } from '@/config/app.config'
import MobileActions from '../components/Game/mobile/MobileActions.vue'
import RandomAction from '../components/Game/mobile/RandomAction.vue'
import { useLotteryStore } from '@/stores/lottery'
import HotComponent from '../components/Game/HotComponent.vue'

const { device } = storeToRefs(useAppStore())
const { activeGame } = storeToRefs(useLotteryStore())
</script>
<template>
  <div class="keno-container">
    <div class="keno-left-container" v-if="device === DevicesEnum.DESKTOP">
      <Logo />
      <Prizes />
      <div class="draws-history">
        <Tabs :tabs="[KenoGameTabsE.BETS]" />
      </div>
    </div>
    <div class="keno-right-container">
      <KenoTop />
      <div class="keno-main-container">
        <div class="keno-paytable">
          <Timer />
          <div class="keno-playtable-container">
            <TransitionGroup name="slide" class="slide-wrapper" tag="div">
              <NumbersGrid v-show="activeGame !== GAME_TYPES_ENUM.HOT" />
              <HotComponent v-show="activeGame === GAME_TYPES_ENUM.HOT" />
            </TransitionGroup>

            <RandomAction
              v-if="device !== DevicesEnum.DESKTOP && activeGame !== GAME_TYPES_ENUM.HOT"
            />
          </div>
          <BottomActions v-if="device === DevicesEnum.DESKTOP" />
          <MobileActions v-if="device !== DevicesEnum.DESKTOP" />
        </div>
        <div v-if="device === DevicesEnum.DESKTOP" class="keno-play-actions">
          <Bet />
          <Tabs />
        </div>
      </div>
    </div>
  </div>
</template>
