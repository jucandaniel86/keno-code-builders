<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { useAutopick } from '@/game/composables/useAutopick'
import Autopick from './Autopick.vue'
import { onMounted, ref } from 'vue'
import { ALLOWED_NUMBERS, DEFAULT_NUMBERS_LIMIT } from '@/config/app.config'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
//@ts-ignore
import { useI18n } from 'vue-i18n'
import AppIcon from '../Shared/AppIcon.vue'

//composables
const { generateNumbers } = useAutopick()
const { selectedNumbers } = storeToRefs(useGameStore())
const { setSelectedNumbers } = useGameStore()
const { t } = useI18n()

//models
const numberOption = ref<number>(1)
const disableAction = ref<boolean>(false)

//methods
const handleSelectedNumbers = async (numbers: number) => {
  numberOption.value = numbers
}

const generateRandomNumbers = async () => {
  if (numberOption.value < 1) return

  disableAction.value = true
  await generateNumbers(numberOption.value)
  disableAction.value = false
}

const clearNumbers = () => {
  setSelectedNumbers([])
}

onMounted(() => {
  numberOption.value = DEFAULT_NUMBERS_LIMIT
  if (selectedNumbers.value.length === 0) {
    generateNumbers(DEFAULT_NUMBERS_LIMIT, false)
  }
})
</script>

<template>
  <div class="keno-bottom-actions-container">
    <button
      class="cancel-selection-btn"
      :disabled="selectedNumbers.length === 0 || disableAction"
      @click.prevent="clearNumbers"
    >
      <AppIcon icon="close" />
      {{ t('bottom.cancel') }}
    </button>
    <Autopick
      :disabled="disableAction"
      :numbers="ALLOWED_NUMBERS"
      :defaultOption="DEFAULT_NUMBERS_LIMIT"
      @onSelect="handleSelectedNumbers"
    />
    <button
      class="random-selection-btn"
      :disabled="numberOption === 0 || disableAction"
      @click.prevent="generateRandomNumbers"
    >
      <AppIcon icon="rotate" />
      {{ t('bottom.random') }}
    </button>
  </div>
</template>
