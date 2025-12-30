<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
//@ts-ignore
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/stores/session'
import { useStatusStore } from '@/stores/status'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import StakeSelector from '../Shared/StakeSelector.vue'
import { usePlaceBet } from '@/game/composables/usePlaceBet'
import { DevicesEnum, useAppStore } from '@/stores/app'
import { useLotteryStore } from '@/stores/lottery'
import { GAME_TYPES_ENUM, MAX_SUBSCRIPTIONS } from '@/config/app.config'
import SlideSelector from '../SlideSelector.vue'
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import { useGameStore } from '@/stores/game'
import AppIcon from '../Shared/AppIcon.vue'
import Subscriptions from './bet/Subscriptions.vue'

//types
type BetComponent = {
  disabled: boolean
}

//props
const props = defineProps<BetComponent>()

//composables
const { t } = useI18n()
const { setSessionData } = useSessionStore()
const { setStatusData } = useStatusStore()
const { betLevels, betIndex } = storeToRefs(useSessionStore())
const { nextDraws } = storeToRefs(useGameStore())
const { activeGame } = storeToRefs(useLotteryStore())
const { betDisabled, placeBet, total } = usePlaceBet()

//models
const sidebarDisabled = ref<boolean>(false)
const betLoading = ref<boolean>(false)
const displaySubscriptions = ref<boolean>(false)

//methods
const updateBetIndex = (value: number) => {
  setSessionData({
    betIndex: betLevels.value.indexOf(value),
  })
  setStatusData({
    bet: value,
  })
}

const handlePlaceBet = async () => {
  betLoading.value = true
  await placeBet()
  betLoading.value = false
}

const { device } = storeToRefs(useAppStore())
const stakeSelectorLabel = computed(() => {
  return device.value === DevicesEnum.DESKTOP ? t('components.sidebar.betAmount') : null
})

watch(activeGame, () => {
  if (activeGame.value === GAME_TYPES_ENUM.JACKPOT) {
    sidebarDisabled.value = true
    updateBetIndex(2)
  } else {
    sidebarDisabled.value = false
  }
})
</script>
<template>
  <div class="keno-bet-options">
    <Subscriptions
      v-if="device !== DevicesEnum.DESKTOP"
      :disabled="props.disabled || betDisabled || betLoading"
      :class="{ show: displaySubscriptions }"
      @onClose="displaySubscriptions = false"
    />
    <StakeSelector
      :title="stakeSelectorLabel"
      :options="betLevels"
      @stake-selector:increase="updateBetIndex"
      @stake-selector:decrease="updateBetIndex"
      :selected-option="betIndex"
      :is-disabled="props.disabled"
    />
    <SlideSelector
      v-if="device === DevicesEnum.DESKTOP"
      :disabled="props.disabled || betDisabled || betLoading"
      :max-value="MAX_SUBSCRIPTIONS"
      :min-value="1"
      :label="t('components.sidebar.draws')"
      v-model="nextDraws"
      @valueChange="
        (val) => {
          nextDraws = val
        }
      "
    />
    <div class="place-bet-container">
      <button
        class="bet-btn"
        :disabled="props.disabled || betDisabled || betLoading"
        @click.prevent="handlePlaceBet"
      >
        {{ t('components.sidebar.placeBet') }}
        ({{ CurrencyConverter.Convert(total) }})
      </button>
      <button
        v-if="device !== DevicesEnum.DESKTOP"
        :disabled="props.disabled || betDisabled || betLoading"
        class="mobile-subscription-btn"
        @click.prevent="displaySubscriptions = true"
      >
        <AppIcon :icon="'ticket-subscription'" />
      </button>
    </div>
  </div>
</template>
