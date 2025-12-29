<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useAutopick } from '@/game/composables/useAutopick'
import { ALLOWED_NUMBERS, DEFAULT_NUMBERS_LIMIT } from '@/config/app.config'
import AppIcon from '../../Shared/AppIcon.vue'
import Autopick from '../Autopick.vue'

//types
type RandomActionComponent = {
  disabled: boolean
}

//props
const props = defineProps<RandomActionComponent>()

//composables
const { generateNumbers } = useAutopick()
const { selectedNumbers } = storeToRefs(useGameStore())
const { setSelectedNumbers } = useGameStore()

//models
const numberOption = ref<number>(10)
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
  //@todo
  numberOption.value = DEFAULT_NUMBERS_LIMIT
  generateRandomNumbers()
})
</script>
<template>
  <div class="keno-bottom-actions-container">
    <button
      class="cancel-selection-btn"
      :disabled="props.disabled || selectedNumbers.length === 0 || disableAction"
      @click.prevent="clearNumbers"
    >
      <AppIcon icon="close" />
    </button>

    <Autopick
      :disabled="props.disabled || disableAction"
      :numbers="ALLOWED_NUMBERS"
      :defaultOption="DEFAULT_NUMBERS_LIMIT"
      @onSelect="handleSelectedNumbers"
    />
    <button
      class="random-selection-btn"
      :disabled="numberOption === 0 || disableAction || props.disabled"
      @click.prevent="generateRandomNumbers"
    >
      <AppIcon icon="rotate" />
    </button>
  </div>
</template>
