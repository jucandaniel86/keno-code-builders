<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
//@ts-ignore
const props = defineProps<{ title: string; content: string; buttons?: any[] }>()
</script>
<template>
  <div class="wrapper wrapper-transition scrollX scrollY" style="transform: translateY(0)">
    <div class="modal-header">
      <h2>{{ props.title || 'Warning' }}</h2>
    </div>

    <div class="modal-content">
      <p>{{ props.content }}</p>
    </div>

    <div class="modal-actions" v-if="buttons && buttons.length">
      <button
        v-for="(button, i) in buttons"
        :key="`Btn__${i}`"
        @click.prevent="button.onClick"
        class="classic transition"
      >
        {{ button.text }}
      </button>
    </div>
  </div>
</template>
