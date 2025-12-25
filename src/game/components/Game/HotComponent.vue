<script setup lang="ts">
import { HOT_SELECTION_TYPES } from '@/config/app.config'

import AppIcon from '../Shared/AppIcon.vue'
import Trands from '../Shared/Trands.vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useLotteryStore } from '@/stores/lottery'

const { hotBetOption } = storeToRefs(useLotteryStore())
const { setHOTBetOption } = useLotteryStore()
const { t } = useI18n()
</script>
<template>
  <div class="hot-component-container">
    <h2 class="hot-component-title">{{ t('components.hot.title') }}</h2>
    <div class="hot-component-wrapper">
      <button
        v-for="option in HOT_SELECTION_TYPES"
        :key="option.type"
        class="hot-options-btn"
        :class="`${option.class} ${hotBetOption === option.value ? 'selected' : ''}`"
        @click.prevent="setHOTBetOption(option.value)"
      >
        <span class="hot-options-selected" v-if="hotBetOption === option.value">
          <AppIcon icon="check" />
        </span>

        {{ option.label }}
        <span class="hot-options-label">{{ t('components.hot.select') }}</span>
      </button>
    </div>
    <Trands />
  </div>
</template>
