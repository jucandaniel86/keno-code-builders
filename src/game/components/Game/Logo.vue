<script setup lang="ts">
import ModalController from '@/core/core.ModalController'
import AppIcon from '../Shared/AppIcon.vue'

import * as Pk from '../../../../package.json'
</script>
<template>
  <div class="logo-container">
    <button class="menu-btn" @click.prevent="ModalController.Instance().settings()">
      <AppIcon :icon="'menu'" fill="#fff" />
    </button>
    <h1 class="logo-text">
      KENO <sup>v.{{ Pk.version }}</sup>
    </h1>
  </div>
</template>
