<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
//@ts-ignore
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/stores/session'
import { useStatusStore } from '@/stores/status'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import StakeSelector from '../Shared/StakeSelector.vue'
import { usePlaceBet } from '@/game/composables/usePlaceBet'
import { DevicesEnum, useAppStore } from '@/stores/app'

//composables
const { t } = useI18n()
const { setSessionData } = useSessionStore()
const { setStatusData } = useStatusStore()
const { betLevels, betIndex } = storeToRefs(useSessionStore())
const { betDisabled, placeBet } = usePlaceBet()

//models
const sidebarDisabled = ref<boolean>(false)
const betLoading = ref<boolean>(false)

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
  console.log('on place bet')
  await placeBet()
  betLoading.value = false
}

const { device } = storeToRefs(useAppStore())
const stakeSelectorLabel = computed(() => {
  return device.value === DevicesEnum.DESKTOP ? t('components.sidebar.betAmount') : null
})
</script>
<template>
  <div class="keno-bet-options">
    <StakeSelector
      :title="stakeSelectorLabel"
      :options="betLevels"
      @stake-selector:increase="updateBetIndex"
      @stake-selector:decrease="updateBetIndex"
      :selected-option="betIndex"
      :is-disabled="sidebarDisabled"
    />

    <button class="bet-btn" :disabled="betDisabled || betLoading" @click.prevent="handlePlaceBet">
      PLACE BET
    </button>
  </div>
</template>
