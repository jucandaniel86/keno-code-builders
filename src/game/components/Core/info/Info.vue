<template>
  <div class="wrapper wrapper-transition scrollX scrollY" style="max-width: 100%">
    <div class="modal-content game-info">
      <div v-html="t('info.content')" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
