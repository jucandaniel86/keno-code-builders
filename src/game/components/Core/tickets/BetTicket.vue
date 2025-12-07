<script setup lang="ts">
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import { useUtils } from '@/core/core.Util'
import type { TicketType } from '@/core/models/bets/BetsResponseData'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

//types
type BetTicketType = {
  ticket: TicketType
}
//props
const props = defineProps<BetTicketType>()

//composables
const { t } = useI18n()
const { isSet } = useUtils()

//computed
const balls = computed(() => props.ticket.balls.filter((ball) => ball > 0))

//methods
const getBallClasses = (_number: number) => {
  const classes = ['BetTicketBall']

  if (!isSet(props.ticket.drawResults)) return classes

  if (props.ticket.drawResults.includes(_number)) {
    classes.push('selected')
  }
  return classes
}
</script>
<template>
  <div class="ticket">
    <div className="BetTicketHOT" v-if="props.ticket.kenoGameType === 'HEADSORTAILS'">
      <span :class="props.ticket.kenoBetType">
        {{ props.ticket.kenoBetType }}
      </span>
    </div>
    <div>
      <div class="BetTicketCell">
        <span class="BetTicketIDLabel">
          {{ t('history.ticketID') }}
          <span class="label-ticket-id">
            {{ props.ticket.ticketNumber }}
          </span>
        </span>

        <div>
          <span className="label-bet-type" v-if="props.ticket.kenoGameType !== 'HEADSORTAILS'">
            {{ props.ticket.kenoGameType }}
          </span>
          <button className="HistoryTicketIcon" v-if="isSet(props.ticket.drawResults)">
            <i className="fa-sharp fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>

      <div className="BetTicketCell">
        <div className="ticket-numbers">
          <span
            v-for="ball in balls"
            :key="`Ball${props.ticket.ticketNumber}-${ball}`"
            :class="getBallClasses(ball)"
          >
            <span>
              {{ ball }}
            </span>
          </span>
        </div>
      </div>
      <div class="BetTicketCell" v-if="isSet(props.ticket.totalPrize)">
        <div class="BetTicketCellItem" v-if="props.ticket.stake">
          <span class="BetTicketLabel">
            {{ t('history.bet') }}
          </span>
          <span class="BetTicketValue">
            {{ CurrencyConverter.Convert(props.ticket.stake) }}
          </span>
        </div>
        <div class="BetTicketCellItem">
          <span class="BetTicketLabel">
            {{ t('history.win') }}
          </span>
          <span class="BetTicketValue">
            {{ CurrencyConverter.Convert(props.ticket.totalPrize as any) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
