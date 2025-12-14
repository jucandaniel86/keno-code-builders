<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Clock from '../Core/clock/Clock.vue'
import { useStatusStore } from '@/stores/status'
import { DevicesEnum, useAppStore } from '@/stores/app'
import Logo from './Logo.vue'

const { balance } = storeToRefs(useStatusStore())
const { device } = storeToRefs(useAppStore())
</script>
<template>
  <div>
    <div class="draw-info-container">
      <div class="draw-keno-type" v-if="device === DevicesEnum.DESKTOP">
        <button class="keno-type-btn active">Keno Classic</button>
        <button class="keno-type-btn">Jackpot</button>
        <button class="keno-type-btn">Heads or Tails</button>
      </div>
      <Logo v-else />
      <div class="draw-info-details">
        <span>Balance: {{ balance }}</span>
        <Clock />
      </div>
    </div>
    <div v-if="device !== DevicesEnum.DESKTOP" class="keno-game-types-mobile">
      <button class="keno-type-btn active">Keno Classic</button>
      <button class="keno-type-btn">Jackpot</button>
      <button class="keno-type-btn">Heads or Tails</button>
    </div>
  </div>
</template>
