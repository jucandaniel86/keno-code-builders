<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Clock from '../Core/clock/Clock.vue'
import { useStatusStore } from '@/stores/status'

const { balance } = storeToRefs(useStatusStore())
</script>
<template>
  <div class="draw-info-container">
    <div class="draw-keno-type">
      <button class="keno-type-btn active">Keno Classic</button>
      <button class="keno-type-btn">Jackpot</button>
      <button class="keno-type-btn">Heads or Tails</button>
    </div>
    <div class="draw-info-details">
      <span>Balance: {{ balance }}</span>
      <Clock />
    </div>
  </div>
</template>
