<script setup lang="ts">
import NumbersGrid from '../components/Game/NumbersGrid.vue'
import Bet from '../components/Game/Bet.vue'
import BottomActions from '../components/Game/BottomActions.vue'
import Timer from '../components/Game/Timer.vue'
import KenoTop from '../components/Game/KenoTop.vue'
import Tabs from '../components/Game/tabs/Tabs.vue'
import { storeToRefs } from 'pinia'
import { DevicesEnum, useAppStore } from '@/stores/app'
import { GAME_TYPES_ENUM, KenoGameTabsE, LotteryStatusTypes } from '@/config/app.config'
import MobileActions from '../components/Game/mobile/MobileActions.vue'
import RandomAction from '../components/Game/mobile/RandomAction.vue'
import { useLotteryStore } from '@/stores/lottery'
import HotComponent from '../components/Game/HotComponent.vue'
import { useGameStore } from '@/stores/game'
import Draw from '../components/Game/draw/Draw.vue'
import { useLottery } from '../composables/useLottery'
import { computed } from 'vue'
import Results from '../components/Game/results/Results.vue'
import { useUtils } from '@/core/core.Util'

const { isSet } = useUtils()
const { device } = storeToRefs(useAppStore())
const { activeGame, lotteryStatus, lastResult } = storeToRefs(useLotteryStore())
const { results, randomSelectionLoading } = storeToRefs(useGameStore())
const { closeCurrentDraw, onDrawAnimationClose } = useLottery()

//button states
const randomActionState = computed(() => {
  return lotteryStatus.value !== LotteryStatusTypes.BETTING_OPEN
})
const tabsState = computed(() => {
  return (
    [LotteryStatusTypes.BETTING_CLOSE, LotteryStatusTypes.BETTING_OPEN].indexOf(
      lotteryStatus.value,
    ) === -1 || randomSelectionLoading.value
  )
})
const betActions = computed(() => {
  return lotteryStatus.value !== LotteryStatusTypes.BETTING_OPEN
})

// const customDrawNumbers: number[] = [
//   1, 5, 12, 18, 22, 29, 33, 37, 42, 48, 11, 14, 19, 23, 27, 31, 36, 40, 44, 49,
// ]
</script>
<template>
  <div class="keno-container">
    <div class="keno-right-container">
      <KenoTop :disabled="tabsState" />
      <div class="keno-main-container">
        <div class="keno-paytable">
          <Timer
            v-if="
              device === DevicesEnum.DESKTOP ||
              (lotteryStatus !== LotteryStatusTypes.DRAW_START && device === DevicesEnum.MOBILE)
            "
          />
          <div class="keno-playtable-container">
            <Draw
              v-if="lotteryStatus === LotteryStatusTypes.DRAW_START && results"
              :results="results"
              @onAnimationEnds="onDrawAnimationClose"
            />

            <Results
              v-if="
                lotteryStatus === LotteryStatusTypes.DISPLAY_RESULTS &&
                isSet(lastResult) &&
                lastResult !== null
              "
              :win="lastResult"
              @onAnimationEnds="closeCurrentDraw"
            />
            <TransitionGroup
              v-if="
                [LotteryStatusTypes.BETTING_OPEN, LotteryStatusTypes.BETTING_CLOSE].indexOf(
                  lotteryStatus,
                ) !== -1
              "
              name="fade-group"
              class="slide-wrapper"
              tag="div"
            >
              <NumbersGrid v-show="activeGame !== GAME_TYPES_ENUM.HOT" :key="`NumbersGridTab`" />
              <HotComponent v-show="activeGame === GAME_TYPES_ENUM.HOT" :key="`HotComponentTab`" />
            </TransitionGroup>

            <RandomAction
              v-if="device !== DevicesEnum.DESKTOP && activeGame !== GAME_TYPES_ENUM.HOT"
              :disabled="randomActionState"
            />
          </div>
          <BottomActions
            v-if="device === DevicesEnum.DESKTOP && activeGame !== GAME_TYPES_ENUM.HOT"
            :disabled="randomActionState"
          />
          <MobileActions v-if="device !== DevicesEnum.DESKTOP" :disabled="betActions" />
        </div>
        <div v-if="device === DevicesEnum.DESKTOP" class="keno-play-actions">
          <Bet :disabled="betActions" />
          <Tabs :tabs="[KenoGameTabsE.BETS, KenoGameTabsE.DRAWS, KenoGameTabsE.FUTURE]" />
        </div>
      </div>
    </div>
  </div>
</template>
