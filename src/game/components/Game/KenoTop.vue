<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Clock from '../Core/clock/Clock.vue'
import { useStatusStore } from '@/stores/status'
import { DevicesEnum, useAppStore } from '@/stores/app'
import Logo from './Logo.vue'
import { GAME_TYPES } from '@/config/app.config'
import { useLotteryStore } from '@/stores/lottery'

//stores
const { balance } = storeToRefs(useStatusStore())
const { device } = storeToRefs(useAppStore())
const { activeGame } = storeToRefs(useLotteryStore())

//methods
const { setActiveGame } = useLotteryStore()
</script>
<template>
  <div>
    <div class="draw-info-container">
      <Logo v-if="device === DevicesEnum.DESKTOP" />
      <div class="draw-keno-type" v-if="device === DevicesEnum.DESKTOP">
        <button
          v-for="game in GAME_TYPES"
          :key="game.id"
          class="keno-type-btn"
          :class="{ active: game.value === activeGame }"
          @click.prevent="setActiveGame(game.value)"
        >
          {{ game.label }}
        </button>
      </div>
      <Logo v-else />
      <div class="draw-info-details">
        <span>Balance: {{ balance }}</span>
        <Clock />
      </div>
    </div>
    <div v-if="device !== DevicesEnum.DESKTOP" class="keno-game-types-mobile">
      <button
        v-for="game in GAME_TYPES"
        :key="game.id"
        class="keno-type-btn"
        :class="{ active: game.value === activeGame }"
        @click.prevent="setActiveGame(game.value)"
      >
        {{ game.label }}
      </button>
    </div>
  </div>
</template>
