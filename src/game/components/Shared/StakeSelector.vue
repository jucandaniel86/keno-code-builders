<script setup lang="ts">
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import SoundManager from '@/core/core.Sounds'
import { defineProps, ref, watch } from 'vue'

type StakeSelectorType = {
  title?: string
  isDisabled?: boolean
  selectedOption?: number
  options: number[]
}

const props = withDefaults(defineProps<StakeSelectorType>(), {
  selectedOption: 0,
  isDisabled: false,
})

const currentOption = ref<number>(props.selectedOption || 0)
const isDisabled = ref<boolean>(props.isDisabled)
const emits = defineEmits(['stake-selector:increase', 'stake-selector:decrease'])

const increase = () => {
  if (currentOption.value + 1 >= props.options.length) return
  currentOption.value++
  SoundManager.Instance().play('CLICK')
  emits('stake-selector:increase', props.options[currentOption.value])
}

const decrease = () => {
  if (currentOption.value < 1) return
  currentOption.value--

  SoundManager.Instance().play('CLICK')
  emits('stake-selector:decrease', props.options[currentOption.value])
}

watch(props, () => {
  currentOption.value = props.selectedOption
  isDisabled.value = props.isDisabled
})
</script>
<template>
  <label class="stake-container">
    <span>{{ props.title }}</span>
    <div class="input-wrap">
      <button
        :disabled="isDisabled || currentOption === 0"
        class="default transition stake-btn"
        @click.prevent="decrease"
      >
        -
      </button>
      <div class="input-wrapper">
        <input
          type="text"
          readonly
          class="stake-value"
          :disabled="isDisabled"
          :value="CurrencyConverter.Convert(props.options[currentOption] as number, true, false)"
        />
        {{ CurrencyConverter.getCurrency() }}
      </div>
      <button
        :disabled="isDisabled || currentOption + 1 === options.length"
        class="default transition stake-btn up"
        @click.prevent="increase"
      >
        +
      </button>
    </div>
  </label>
</template>
<style scoped>
.stake-btn .dropdown-icon {
  width: 16px;
  height: 16px;
  display: block;
}
.stake-btn:hover .dropdown-icon {
  color: var(--text-color);
  background-color: var(--text-color);
}

.stake-btn.up .dropdown-icon {
  transform: rotate(180deg);
}

.stake-btn:disabled {
  opacity: 0.4;
  cursor: none;
}
.stake-value:-webkit-inner-spin-button {
  display: none;
}
</style>
