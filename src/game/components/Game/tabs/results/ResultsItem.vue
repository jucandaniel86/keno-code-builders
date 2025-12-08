<script setup lang="ts">
import { useI18n } from 'vue-i18n'

export type ResultItemTicket = {
  drawID: string | number
  numbers: any[]
  whenDrawn: string
}

type ResultItemType = {
  item: ResultItemTicket
}

const props = defineProps<ResultItemType>()

const { t } = useI18n()
</script>
<template>
  <div class="keno-results-item">
    <div class="keno-results-item-header">
      <span>{{ t('tabs.drawID') }}</span>
      <span>{{ props.item.drawID }}</span>
    </div>
    <div class="keno-results-item-numbers">
      <span v-for="(ball, i) in props.item.numbers" :key="`Ball-${props.item.drawID}_${i}`">
        {{ ball.ball }}
      </span>
    </div>
  </div>
</template>
