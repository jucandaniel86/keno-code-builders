<script setup lang="ts">
console.log('ticket')
import { GAME_TYPES } from '@/config/app.config'
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import type { NewBetType } from '@/stores/lottery'
import moment from 'moment'
import { computed } from 'vue'
interface TabsTicketType {
  ticket: NewBetType
}
const props = defineProps<TabsTicketType>()

//methods
const formatDate = (date: string) => moment(date).format('H:mm:ss')

const ticketTypeAlias = computed(() => {
  return GAME_TYPES.find((gameType) => gameType.value === props.ticket.kenoGameType)?.alias
})
</script>
<template>
  <tr class="keno-bet-mobile" :class="props.ticket.kenoGameType">
    <td>{{ ticketTypeAlias }}</td>
    <td>#{{ props.ticket.drawNumber }}</td>
    <td>#{{ props.ticket.ticketNumber }}</td>
    <td>{{ formatDate(props.ticket.dateTime) }}</td>

    <td>{{ CurrencyConverter.Convert(props.ticket.stake) }}</td>
  </tr>
</template>
