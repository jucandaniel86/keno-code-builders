<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
//@ts-ignore
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/stores/session'
import { useStatusStore } from '@/stores/status'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import StakeSelector from '../Shared/StakeSelector.vue'

//composables
const { t } = useI18n()
const { setSessionData } = useSessionStore()
const { setStatusData } = useStatusStore()
const { betLevels, betIndex } = storeToRefs(useSessionStore())

//models
const sidebarDisabled = ref<boolean>(false)

//methods
const updateBetIndex = (value: number) => {
  setSessionData({
    betIndex: betLevels.value.indexOf(value),
  })
  setStatusData({
    bet: value,
  })
}
</script>
<template>
  <div class="keno-bet-options">
    <h2>Bet OPTIONS</h2>
    <StakeSelector
      :title="t('components.sidebar.betAmount')"
      :options="betLevels"
      @stake-selector:increase="updateBetIndex"
      @stake-selector:decrease="updateBetIndex"
      :selected-option="betIndex"
      :is-disabled="sidebarDisabled"
    />

    <button>PLACE BET</button>

    <hr />
  </div>
</template>
