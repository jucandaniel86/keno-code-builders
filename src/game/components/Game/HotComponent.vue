<script setup lang="ts">
import { HOT_BALL_ENUM, HOT_SELECTION_TYPES } from '@/config/app.config'
import { ref } from 'vue'
import AppIcon from '../Shared/AppIcon.vue'
import Trands from '../Shared/Trands.vue'
import { useI18n } from 'vue-i18n'
const selectedOption = ref<HOT_BALL_ENUM>(HOT_BALL_ENUM.HEADS)

const handleSelectedOption = (option: HOT_BALL_ENUM) => {
  selectedOption.value = option
}

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
        :class="`${option.class} ${selectedOption === option.type ? 'selected' : ''}`"
        @click.prevent="handleSelectedOption(option.type)"
      >
        <span class="hot-options-selected" v-if="selectedOption === option.type">
          <AppIcon icon="check" />
        </span>

        {{ option.label }}
        <span class="hot-options-label">Select</span>
      </button>
    </div>
    <Trands />
  </div>
</template>
