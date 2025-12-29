<script setup lang="ts">
import AppIcon from './AppIcon.vue'

type Props = {
  label: string
  icon: string
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  onClick: [value: boolean]
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <button class="checked-option" @click="emit('onClick', true)">
    <span class="indicator">
      <AppIcon :icon="props.icon" />
    </span>
    <span class="content">
      <span class="label">{{ props.label }}</span>
    </span>
  </button>
</template>

<style scoped>
.checked-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;
}

.checked-option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checked-option:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
}

.checked-option .indicator {
  border-color: var(--btn-green-bgcolor, #fff);
  background: rgba(28, 148, 100, 0.18);
  color: #fff;
}

.indicator {
  width: 22px;
  height: 22px;
  border: 1px solid currentColor;
  border-radius: 4px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.indicator svg {
  width: 16px;
  height: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.label {
  font-weight: 600;
}

.description {
  color: rgba(255, 255, 255, 0.7);
}
</style>
