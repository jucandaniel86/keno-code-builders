<script setup lang="ts">
import { MAX_RANDOM_BALL } from '@/config/app.config'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

const { selectedNumbers, analisis } = storeToRefs(useGameStore())

const onClickHandler = (ball: number) => {
  const findIndex = selectedNumbers.value.findIndex((_ball) => _ball === ball)

  if (findIndex !== -1) {
    selectedNumbers.value = selectedNumbers.value.filter((el, index) => index !== findIndex)
    return
  }

  selectedNumbers.value = [...selectedNumbers.value, ball]
}
</script>
<template>
  <div class="keno-paytable-numbers-container">
    <button
      v-for="n in MAX_RANDOM_BALL"
      :key="`Number${n}`"
      :class="{
        selected: selectedNumbers.indexOf(n + 1) !== -1,
        hot: analisis.hot.indexOf(n + 1) !== -1,
        cold: analisis.cold.indexOf(n + 1) !== -1,
      }"
      class="keno-number"
      @click.prevent="onClickHandler(n + 1)"
    >
      <span>{{ n + 1 }}</span>
    </button>
  </div>
</template>
