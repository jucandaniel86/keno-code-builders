<script setup lang="ts">
import ModalController from '@/core/core.ModalController'
import AppIcon from '../Shared/AppIcon.vue'
</script>
<template>
  <div class="logo-container">
    <button class="menu-btn" @click.prevent="ModalController.Instance().settings()">
      <AppIcon :icon="'menu'" fill="#fff" />
    </button>
    <h1 class="logo-text">KENO <sup>v.1.0.0</sup></h1>
  </div>
</template>
