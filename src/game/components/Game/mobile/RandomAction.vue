<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useAutopick } from '@/game/composables/useAutopick'
import { ALLOWED_NUMBERS } from '@/config/app.config'
import AppIcon from '../../Shared/AppIcon.vue'
import Autopick from '../Autopick.vue'

//composables
const { generateNumbers } = useAutopick()
const { selectedNumbers } = storeToRefs(useGameStore())
const { setSelectedNumbers } = useGameStore()

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
</script>
<template>
  <div class="keno-bottom-actions-container">
    <button
      class="cancel-selection-btn"
      :disabled="selectedNumbers.length === 0 || disableAction"
      @click.prevent="clearNumbers"
    >
      <AppIcon icon="close" />
    </button>
    <Autopick
      :disabled="disableAction"
      :numbers="ALLOWED_NUMBERS"
      @onSelect="handleSelectedNumbers"
    />
    <button
      class="random-selection-btn"
      :disabled="numberOption === 0 || disableAction"
      @click.prevent="generateRandomNumbers"
    >
      <AppIcon icon="rotate" />
    </button>
  </div>
</template>
