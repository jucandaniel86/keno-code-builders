<script setup lang="ts">
import ModalController from '@/core/core.ModalController'
import AppIcon from '../Shared/AppIcon.vue'

import * as Pk from '../../../../package.json'
import SoundManager from '@/core/core.Sounds'

const handleMenuClick = () => {
  ModalController.Instance().settings()
  SoundManager.Instance().play('CLICK')
}
</script>
<template>
  <div class="logo-container">
    <button class="menu-btn" @click.prevent="handleMenuClick">
      <AppIcon :icon="'keno-menu'" />
    </button>
    <h1 class="logo-text">
      KENO <sup>v.{{ Pk.version }}</sup>
    </h1>
  </div>
</template>
