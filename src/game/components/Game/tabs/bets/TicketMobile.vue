<script setup lang="ts">
console.log('ticket')
import { GAME_TYPES } from '@/config/app.config'
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import type { NewBetType } from '@/stores/lottery'
import moment from 'moment'
import { computed } from 'vue'
interface TabsTicketType {
  ticket: NewBetType
  matches: number[]
}
const props = defineProps<TabsTicketType>()

//methods
const formatDate = (date: string) => moment(date).format('H:mm:ss')

const ticketTypeAlias = computed(() => {
  return GAME_TYPES.find((gameType) => gameType.value === props.ticket.kenoGameType)?.alias
})

const ticketNumberMatches = computed(() => {
  return props.ticket.balls.filter((ball) => props.matches.indexOf(ball) !== -1).length
})
</script>
<template>
  <tr class="keno-bet-mobile" :class="props.ticket.kenoGameType">
    <td class="match-column">
      <span class="keno-bet-matches" v-if="props.matches.length > 0">{{
        ticketNumberMatches
      }}</span>
      {{ ticketTypeAlias }}
    </td>
    <td>#{{ props.ticket.drawNumber }}</td>
    <td>#{{ props.ticket.ticketNumber }}</td>
    <td>{{ formatDate(props.ticket.dateTime) }}</td>

    <td>{{ CurrencyConverter.Convert(props.ticket.stake) }}</td>
  </tr>
</template>
