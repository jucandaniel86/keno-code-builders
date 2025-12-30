<script setup lang="ts">
import { DevicesEnum, useAppStore } from '@/stores/app'
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
//components
import Ticket from '../bets/Ticket.vue'
import TicketMobile from '../bets/TicketMobile.vue'

//stores
const { futureDraws, lotteryStatus } = storeToRefs(useLotteryStore())
const { device } = storeToRefs(useAppStore())

//composables
const { t } = useI18n()
</script>
<template>
  <div>
    <div v-if="device === DevicesEnum.DESKTOP" class="HistoryNewBetsContainer">
      <TransitionGroup name="list" tag="div">
        <Ticket
          v-for="ticket in futureDraws"
          :key="`Ticket${ticket.ticketNumber}`"
          :ticket="ticket"
          :matches="[]"
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
              v-for="ticket in futureDraws"
              :key="`Ticket${ticket.ticketNumber}`"
              :ticket="ticket"
              class="keno-bet-mobile"
              :matches="[]"
            />
          </TransitionGroup>
        </tbody>
      </table>
    </div>
  </div>
</template>
