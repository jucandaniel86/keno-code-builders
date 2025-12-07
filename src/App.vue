<script setup lang="ts">
import { onMounted } from 'vue'
import { useHTMLEvents } from './core/core.HTMLEvents'
import LoadingScreen from '@/game/screens/LoadingScreen.vue'
import GameScreen from '@/game/screens/GameScreen.vue'
import { ScreenEnum } from './core/enums/Screens'
import useAppState from './core/core'
import ModalWindow from './game/components/Core/modal/ModalWindow.vue'
import Icons from './game/components/Shared/Icons.vue'

import './game/assets/css/main.css'

const { __init, screen } = useAppState()

//composables
useHTMLEvents()

onMounted(async () => {
  try {
    await __init()
  } catch (err) {
    console.warn('[CORE]', err)
  }
})
</script>

<template>
  <ModalWindow />
  <Icons />
  <TransitionGroup name="fade">
    <LoadingScreen v-if="screen === ScreenEnum.LOADING" />
    <GameScreen v-if="screen === ScreenEnum.GAME" />
  </TransitionGroup>
</template>
