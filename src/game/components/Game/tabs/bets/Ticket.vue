<script setup lang="ts">
console.log('ticket')
import { GAME_TYPES_ENUM } from '@/config/app.config'
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import type { NewBetType } from '@/stores/lottery'
import { useI18n } from 'vue-i18n'
interface TabsTicketType {
  ticket: NewBetType
}
const props = defineProps<TabsTicketType>()

const { t } = useI18n()
</script>
<template>
  <div class="BetTicket">
    <div class="BetTicketHeaderContainer">
      <div class="BetTicketHeaderType">{{ props.ticket.kenoGameType }}</div>
      <div
        v-if="props.ticket.kenoGameType === GAME_TYPES_ENUM.HOT"
        class="BetTicketHotType"
        :class="props.ticket.kenoBetType"
      >
        {{ props.ticket.kenoBetType }}
      </div>
    </div>

    <div class="BetTicketHeader">
      <span>{{ t('tabs.ticketID') }} #{{ props.ticket.ticketNumber }}</span>
      <span>{{ t('tabs.bet') }} {{ CurrencyConverter.Convert(props.ticket.stake) }}</span>
    </div>
    <div class="keno-results-item-numbers">
      <div v-for="(ball, i) in props.ticket.balls" :key="`Ball${props.ticket.ticketNumber}-${i}`">
        <span>{{ ball }}</span>
      </div>
    </div>
  </div>
</template>
