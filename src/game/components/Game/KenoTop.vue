<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Clock from '../Core/clock/Clock.vue'
import { useStatusStore } from '@/stores/status'
import { DevicesEnum, useAppStore } from '@/stores/app'
import Logo from './Logo.vue'
import { GAME_TYPES, GAME_TYPES_ENUM } from '@/config/app.config'
import { useLotteryStore } from '@/stores/lottery'
import { useI18n } from 'vue-i18n'

//types
type KenoTopComponent = {
  disabled: boolean
}
const props = defineProps<KenoTopComponent>()

//stores
const { balance } = storeToRefs(useStatusStore())
const { device } = storeToRefs(useAppStore())
const { activeGame } = storeToRefs(useLotteryStore())

//composables
const { setActiveGame } = useLotteryStore()
const { t } = useI18n()

//methods
const handleGameChange = (_payload: GAME_TYPES_ENUM) => {
  if (props.disabled) return

  setActiveGame(_payload)
}
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
          :disabled="props.disabled"
          :class="{ active: game.value === activeGame }"
          @click.prevent="handleGameChange(game.value)"
        >
          {{ game.label }}
        </button>
      </div>
      <Logo v-else />
      <div class="draw-info-details">
        <span>{{ t('header.balance') }}: {{ balance }}</span>
        <Clock />
      </div>
    </div>
    <div v-if="device !== DevicesEnum.DESKTOP" class="keno-game-types-mobile">
      <button
        v-for="game in GAME_TYPES"
        :key="game.id"
        class="keno-type-btn"
        :disabled="props.disabled"
        :class="{ active: game.value === activeGame }"
        @click.prevent="handleGameChange(game.value)"
      >
        {{ game.label }}
      </button>
    </div>
  </div>
</template>
