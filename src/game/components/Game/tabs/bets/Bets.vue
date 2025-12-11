<script setup lang="ts">
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import Ticket from './Ticket.vue'

//composables
const { nextDraw } = storeToRefs(useLotteryStore())
</script>
<template>
  <div class="HistoryNewBetsContainer">
    <Ticket v-for="ticket in nextDraw" :key="`Ticket${ticket.ticketNumber}`" :ticket="ticket" />
  </div>
</template>
