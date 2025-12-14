<script setup lang="ts">
console.log('ticket')
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import type { NewBetType } from '@/stores/lottery'
import moment from 'moment'
interface TabsTicketType {
  ticket: NewBetType
}
const props = defineProps<TabsTicketType>()

//methods
const formatDate = (date: string) => moment(date).format('H:mm:ss')
</script>
<template>
  <tr class="keno-bet-mobile" :class="props.ticket.kenoGameType">
    <td>{{ props.ticket.kenoGameType }}</td>
    <td>#{{ props.ticket.drawNumber }}</td>
    <td>#{{ props.ticket.ticketNumber }}</td>
    <td>{{ formatDate(props.ticket.dateTime) }}</td>

    <td>{{ CurrencyConverter.Convert(props.ticket.stake) }}</td>
  </tr>
</template>
