<template>
  <div class="slide-selector" :class="{ disabled }">
    <div class="slider-track">
      <input
        type="range"
        v-model.number="value"
        :min="minValue"
        :max="maxValue"
        :step="props.step ?? 1"
        :disabled="disabled"
      />
      <div class="tooltip" :style="{ left: `calc(${percent}% )` }">
        {{ value }}
      </div>
    </div>
    <div class="slider-labels">
      <span>{{ minValue }}</span>
      <span v-if="label">{{ label }}</span>
      <span>{{ maxValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    minValue: number
    maxValue: number
    modelValue?: number
    disabled?: boolean
    label?: string
    step?: number
  }>(),
  {
    minValue: 0,
    maxValue: 100,
    disabled: false,
    label: '',
    step: 1,
  },
)

const emit = defineEmits<{
  (event: 'valueChange', value: number): void
}>()

const clamp = (val: number) => Math.min(Math.max(val, props.minValue), props.maxValue)

const value = ref(clamp(props.modelValue ?? props.minValue))

watch(
  () => props.modelValue,
  (newVal) => {
    if (typeof newVal === 'number') {
      value.value = clamp(newVal)
    }
  },
)

watch(
  value,
  (newVal, oldVal) => {
    const clamped = clamp(newVal)
    if (clamped !== oldVal) {
      value.value = clamped
      emit('valueChange', clamped)
    }
  },
  { immediate: true },
)

const percent = computed(() => {
  const range = props.maxValue - props.minValue || 1
  return ((value.value - props.minValue) / range) * 100
})
</script>

<style scoped>
.slide-selector {
  display: grid;
  gap: 8px;
}

.slider-heading {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.slider-track {
  position: relative;
  margin: 0 0.5rem;
}

.slider-track input[type='range'] {
  width: 100%;
  appearance: none;
  background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
  height: 6px;
  border-radius: 999px;
  outline: none;
}

.slider-track input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #111827;
  border: 2px solid #f9fafb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.slider-track input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #111827;
  border: 2px solid #f9fafb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.tooltip {
  position: absolute;
  top: -4px;
  transform: translate(-50%, -100%);
  padding: 4px 8px;
  background: #111827;
  color: #f9fafb;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  color: #fffafa;
  font-size: 12px;
  font-weight: 600;

  margin: 0 0.5rem 1rem 0.5rem;
}

.slide-selector.disabled {
  opacity: 0.7;
}

.slide-selector.disabled input[type='range'] {
  background: #d1d5db;
  cursor: not-allowed;
}

.slide-selector.disabled input[type='range']::-webkit-slider-thumb,
.slide-selector.disabled input[type='range']::-moz-range-thumb {
  background: #9ca3af;
  border-color: #e5e7eb;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
