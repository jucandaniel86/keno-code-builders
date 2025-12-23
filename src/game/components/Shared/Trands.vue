<script setup lang="ts">
import { useTrands } from '@/game/composables/useTrands'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import Loading from './Loading.vue'

const { results, getClasses } = useTrands()
const { analisisLoading } = storeToRefs(useGameStore())
const { t } = useI18n()
</script>
<template>
  <div class="trends-container">
    <div className="trends-title">{{ t('components.trends.title') }}</div>

    <div className="trends-wrapper">
      <Loading v-if="analisisLoading" />
      <div
        class="trends-ball"
        v-for="(result, i) in results"
        :key="`Trends${i}`"
        :class="getClasses(result, i).join(' ')"
      >
        {{ result }}
      </div>
    </div>
  </div>
</template>
