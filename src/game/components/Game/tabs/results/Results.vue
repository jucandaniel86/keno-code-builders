<script setup lang="ts">
import ResultsItem, { type ResultItemTicket } from './ResultsItem.vue'

type ResultsTabT = {
  results: ResultItemTicket[]
}
const props = defineProps<ResultsTabT>()
</script>
<template>
  <div class="results-items-container">
    <ResultsItem
      v-for="(ticket, index) in props.results"
      :key="`${ticket.drawID}-${index}`"
      :item="ticket"
    />
  </div>
</template>
