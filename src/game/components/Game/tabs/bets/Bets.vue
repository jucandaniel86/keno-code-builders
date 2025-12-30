<script setup lang="ts">
import _ from 'lodash'

//stores
import { storeToRefs } from 'pinia'
import { DevicesEnum, useAppStore } from '@/stores/app'
import { useLotteryStore } from '@/stores/lottery'

//components
import Ticket from './Ticket.vue'
import TicketMobile from './TicketMobile.vue'
import { computed } from 'vue'
import { useUtils } from '@/core/core.Util'
import { useI18n } from 'vue-i18n'

//composables
const { nextDraw, extractedNumbers, lotteryStatus } = storeToRefs(useLotteryStore())
const { device } = storeToRefs(useAppStore())
const { findCommonNumbers } = useUtils()
const { t } = useI18n()

//computed
const sortedTickets = computed(() => {
  const tickets = nextDraw.value.map((ticket) => ({
    ...ticket,
    matches: findCommonNumbers(ticket.balls, extractedNumbers.value).length,
  }))

  return _.sortBy(tickets, ['matches']).reverse()
})
</script>
<template>
  <div>
    <div v-if="device === DevicesEnum.DESKTOP" class="HistoryNewBetsContainer">
      <TransitionGroup name="list" tag="div">
        <Ticket
          v-for="ticket in sortedTickets"
          :key="`Ticket${ticket.ticketNumber}`"
          :ticket="ticket"
          :matches="extractedNumbers"
        />
      </TransitionGroup>
    </div>
    <div v-else>
      <table class="keno-bets-table-mobile">
        <thead>
          <tr>
            <th>{{ t('bets.type') }}</th>
            <th>{{ t('bets.draw') }}</th>
            <th>{{ t('bets.ticketNo') }}</th>
            <th>{{ t('bets.time') }}</th>
            <th>{{ t('bets.bet') }}</th>
          </tr>
        </thead>
        <tbody :style="{ height: lotteryStatus === 'DRAW_START' ? 'auto' : '60px' }">
          <TransitionGroup name="list">
            <TicketMobile
              v-for="ticket in sortedTickets"
              :key="`Ticket${ticket.ticketNumber}`"
              :ticket="ticket"
              class="keno-bet-mobile"
              :matches="extractedNumbers"
            />
          </TransitionGroup>
        </tbody>
      </table>
    </div>
  </div>
</template>
