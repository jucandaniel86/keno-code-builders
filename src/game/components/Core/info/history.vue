<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { useHistory } from '@/game/composables/useHistory'
//@ts-ignore
import { useI18n } from 'vue-i18n'
import BetTicket from '../tickets/BetTicket.vue'
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import AppIcon from '../../Shared/AppIcon.vue'

const { tickets, totalStake, totalWin } = useHistory()
const { t } = useI18n()
</script>
<template>
  <div class="history-container">
    <div
      v-for="draw in tickets"
      :key="`DrawHistoryID${draw.drawNumber}`"
      class="history-tab-container"
    >
      <div class="history-tab-details-container">
        <div class="history-tab-details">
          <div class="CurrentBetsInfoItem">{{ t('history.drawID') }}</div>
          <div class="CurrentBetsInfoItem">
            <span class="CurrentBetsInfoItem">{{ draw.drawNumber }}</span>
          </div>

          <div class="CurrentBetsInfoItem">{{ t('history.totalBetsCount') }}</div>
          <div class="CurrentBetsInfoItem">
            <span class="CurrentBetsInfoItem">{{ draw.tickets.length }}</span>
          </div>

          <div class="CurrentBetsInfoItem">{{ t('history.totalBetsAmount') }}</div>
          <div class="CurrentBetsInfoItem">
            <span class="CurrentBetsInfoItem">
              {{ CurrencyConverter.Convert(totalStake(draw.tickets)) }}
            </span>
          </div>

          <div class="CurrentBetsInfoItem">{{ t('history.totalBetsWin') }}</div>
          <div class="CurrentBetsInfoItem">
            <span class="CurrentBetsInfoItem">
              {{ CurrencyConverter.Convert(totalWin(draw.tickets)) }}
            </span>
          </div>
        </div>
        <div>
          <button class="repeat-bet-btn">
            <p>{{ t('history.repeatAllBets') }}</p>
            <span class="icon">
              <AppIcon icon="rotate" />
            </span>
          </button>
        </div>
      </div>

      <div class="history-tab-tickets">
        <BetTicket
          v-for="ticket in draw.tickets"
          :ticket="ticket"
          :key="`Ticket${ticket.ticketNumber}`"
        />
      </div>
    </div>
  </div>
</template>
