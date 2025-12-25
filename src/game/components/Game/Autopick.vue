<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppIcon from '../Shared/AppIcon.vue'
//@ts-ignore
import { useI18n } from 'vue-i18n'

//props
type AutopickType = {
  disabled: boolean
  numbers: number[]
  defaultOption?: number
}
const props = defineProps<AutopickType>()

//composables
const { t } = useI18n()

//emitters
const emitters = defineEmits(['onSelect'])

//models
const currentIndex = ref<number>(
  props.numbers.findIndex((_number: number) => _number === props.defaultOption),
)
console.log('current index', currentIndex.value, props.defaultOption)
//computed
const currentNumber = computed(() => {
  return props.numbers[currentIndex.value]
})

//methods
const next = () => {
  if (currentIndex.value + 1 >= props.numbers.length) return

  currentIndex.value = currentIndex.value + 1
}
const prev = () => {
  if (currentIndex.value - 1 < 0) return

  currentIndex.value = currentIndex.value - 1
}

watch(currentIndex, () => {
  emitters('onSelect', currentNumber.value)
})
</script>
<template>
  <div class="keno-autopick">
    <div class="keno-autopick-wrapper">
      <div>
        <button
          class="keno-autopick-btn keno-autopick-prev"
          :disabled="props.disabled"
          @click.prevent="prev"
        >
          <AppIcon icon="arrow" fill="#fff" />
        </button>
      </div>

      <span class="keno-autopick-number">{{ currentNumber }}</span>
      <div>
        <button
          class="keno-autopick-btn keno-autopick-next"
          :disabled="props.disabled"
          @click.prevent="next"
        >
          <AppIcon icon="arrow" fill="#fff" />
        </button>
      </div>
    </div>
    <p class="keno-autopick-label">{{ t('bottom.randomQuantity') }}</p>
  </div>
</template>
