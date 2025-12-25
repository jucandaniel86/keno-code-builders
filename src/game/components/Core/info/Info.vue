<template>
  <div class="game-info-content" v-html="t('info.content')"></div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
