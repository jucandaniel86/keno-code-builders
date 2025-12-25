<script setup lang="ts">
import { GAME_NAME } from '@/config/app.config'

// import Logo from '@/assets/imgs/logo.png'
</script>
<template>
  <div class="loading-screen__wrapper">
    <div class="loading-logo__wrapper">
      <!-- <img :src="Logo" class="logo" /> -->
      <h1>{{ GAME_NAME }}</h1>
      <div class="item">
        <i class="loader loader--3"></i>
      </div>
    </div>
  </div>
</template>
