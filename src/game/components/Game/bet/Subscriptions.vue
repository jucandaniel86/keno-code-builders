<script setup lang="ts">
import { MAX_SUBSCRIPTIONS } from '@/config/app.config'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import SlideSelector from '../../SlideSelector.vue'
import AppIcon from '../../Shared/AppIcon.vue'
import { computed } from 'vue'

interface SubscriptionsComponent {
  disabled: boolean
}
const props = defineProps<SubscriptionsComponent>()

//composables
const { nextDraws } = storeToRefs(useGameStore())
const { t } = useI18n()

//emitters
const emits = defineEmits(['onClose'])

//computed
const bottomPosition = computed(() => {
  const placeBetContainer = document.querySelector('.place-bet-container')
  if (placeBetContainer) {
    console.log('placeBetContainer', placeBetContainer.clientHeight)
    return `${Number(placeBetContainer.clientHeight) + 5}px`
  }
  return '70px'
})
</script>
<template>
  <div class="subscriptions-wrapper" :style="{ bottom: bottomPosition }">
    <button @click.prevent="emits('onClose')" class="close-btn-subscriptions">
      <AppIcon icon="close" />
    </button>
    <SlideSelector
      :disabled="props.disabled"
      :max-value="MAX_SUBSCRIPTIONS"
      :min-value="1"
      :label="t('components.sidebar.draws')"
      v-model="nextDraws"
    />
  </div>
</template>
