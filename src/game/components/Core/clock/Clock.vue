<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

//models
const date = ref(new Date())

//composables
const { t } = useI18n()

onMounted(() => {
  setInterval(() => (date.value = new Date()), 1000)
})
</script>
<template>
  <span class="clock-wrapper">
    <span>{{ t('header.clock') }}:</span>
    <span>{{ date.toLocaleTimeString('en-GB') }}</span>
  </span>
</template>
