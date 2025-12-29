<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNumberAnimation } from './useNumberAnimation'
import { computed, onMounted } from 'vue'
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import ConfettiBackground from './ConfettiBackground.vue'

const props = defineProps<{
  win: number
}>()

const emitters = defineEmits(['onAnimationEnds'])

//composables
const { t } = useI18n()
const { displayValue, play } = useNumberAnimation({
  duration: 2000,
  easing: 'easeOut',
})

//on mounted play animation
onMounted(async () => {
  await play(props.win)
  emitters('onAnimationEnds')
})

const isWin = computed(() => props.win > 0)
</script>
<template>
  <div class="results-container">
    <ConfettiBackground v-if="isWin" :is-win="isWin" />
    <div class="number-display">
      <div :class="{ 'win-label': isWin, 'lose-label': !isWin }">
        {{ props.win > 0 ? t('components.game.win') : t('components.game.lose') }}
      </div>
      <div class="amount-container">
        <span class="currency">{{ CurrencyConverter.CurrencyData.symbol }}</span>
        <span class="number">{{ displayValue }}</span>
      </div>
    </div>
    <span class="results-message">{{
      isWin ? t('components.game.winMessage') : t('components.game.lostMessageText')
    }}</span>
  </div>
</template>
