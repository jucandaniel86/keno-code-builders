<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        class="game-modal"
        @click.self="closeModal"
        v-if="trigger && state.modalState?.component"
        aria-modal="true"
        role="dialog"
        tabindex="-1"
      >
        <div class="game-modal-overlay overlay-transition" :style="{ opacity: overlayOpacity }" />

        <component :is="state.modalState?.component" v-bind="state.modalState?.props" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import useModalStore from '@/stores/modal'

const { state, open, closeModal, $subscribe } = useModalStore()
const trigger = ref<boolean>(open)
const overlayOpacity = ref<number>(0)

$subscribe((event, state) => {
  trigger.value = state.open

  setTimeout(() => {
    overlayOpacity.value = state.open ? 0.6 : 0
  }, 10)
})

// Make a function that will trigger on keydown
function keydownListener(event: KeyboardEvent) {
  // Assert the key is escape
  if (event.key === 'Escape') closeModal()
}

// Attach event listener on mount
onMounted(() => {
  document.addEventListener('keydown', keydownListener)
})

// Clean up on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', keydownListener)
})
</script>
