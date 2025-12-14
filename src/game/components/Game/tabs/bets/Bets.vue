<script setup lang="ts">
//stores
import { storeToRefs } from 'pinia'
import { DevicesEnum, useAppStore } from '@/stores/app'
import { useLotteryStore } from '@/stores/lottery'

//components
import Ticket from './Ticket.vue'
import TicketMobile from './TicketMobile.vue'

//composables
const { nextDraw } = storeToRefs(useLotteryStore())
const { device } = storeToRefs(useAppStore())
</script>
<template>
  <div>
    <div v-if="device === DevicesEnum.DESKTOP" class="HistoryNewBetsContainer">
      <Ticket v-for="ticket in nextDraw" :key="`Ticket${ticket.ticketNumber}`" :ticket="ticket" />
    </div>
    <div v-else>
      <table class="keno-bets-table-mobile">
        <thead>
          <tr>
            <th>Type</th>
            <th>Draw</th>
            <th>Ticket No.</th>
            <th>Time</th>
            <th>Bet</th>
          </tr>
        </thead>
        <tbody>
          <TicketMobile
            v-for="ticket in nextDraw"
            :key="`Ticket${ticket.ticketNumber}`"
            :ticket="ticket"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
