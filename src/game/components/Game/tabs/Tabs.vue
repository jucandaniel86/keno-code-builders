<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

const { analisis, analisisLoading } = storeToRefs(useGameStore())
</script>
<template>
  <div>
    <div>TABS</div>
    <div>
      <p>
        <span v-if="analisisLoading">Loading...</span>
        <p v-else>Content active</p>
      </p>
    </div>
  </div>
</template>
