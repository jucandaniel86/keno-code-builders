<script setup lang="ts">
console.log('ticket')
import { GAME_TYPES, GAME_TYPES_ENUM } from '@/config/app.config'
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import type { NewBetType } from '@/stores/lottery'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
interface TabsTicketType {
  ticket: NewBetType
  matches: number[]
}
const props = defineProps<TabsTicketType>()

const { t } = useI18n()

const ticketTypeAlias = computed(() => {
  return GAME_TYPES.find((gameType) => gameType.value === props.ticket.kenoGameType)?.alias
})
</script>
<template>
  <div class="BetTicket">
    <div class="BetTicketHeaderContainer">
      <div class="BetTicketHeaderType">{{ ticketTypeAlias }}</div>
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
      <template
        v-for="(ball, i) in props.ticket.balls"
        :key="`Ball${props.ticket.ticketNumber}-${i}`"
      >
        <div v-if="ball > 0">
          <span :class="{ match: props.matches.indexOf(ball) !== -1 }">{{ ball }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
