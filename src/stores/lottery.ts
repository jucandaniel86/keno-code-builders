import type { GAME_TYPES_ENUM } from '@/config/app.config'
import { useUtils } from '@/core/core.Util'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type PrizeItemType = {
  lose: boolean
  matches: number[]
  winMultiplier: number
  jackpot?: boolean
  jackpotPrizes?: number[]
}

export type PrizeType = {
  selections: number
  bonusLevels: number[]
  items: PrizeItemType[]
}

export type GameTicketType = {
  balls: number[]
  dateTime: string
  drawNumber: number
  drawResults: number[]
  drawTime: string
  headOrTailPrize: number
  kenoBetType: string
  kenoDrawType: string
  kenoGameType: GAME_TYPES_ENUM
  onlyHeadOrTailBet: boolean
  prize: number
  selection: number
  stake: number
  ticketNumber: number | string
  totalPrize: number
}

export type NewBetType = {
  drawNumber: number
  dateTime: string
  ticketNumber: string | number
  balls: number[]
  stake: number
  selection: number
  kenoDrawType: string
  kenoBetType: string
  onlyHeadOrTailBet: boolean
  kenoGameType: GAME_TYPES_ENUM
}

export const useLotteryStore = defineStore('lottery', () => {
  //models
  const maxWinCurrency = ref<string>('')
  const maxWin = ref<number>(0)
  const prizes = ref<PrizeType[]>([])
  const nextDrawSeconds = ref<number>(0)
  const drawClosesSeconds = ref<number>(0)
  const drawNumber = ref<number>(0)
  const nextDrawNumber = ref<number>(0)
  const lastTimestamp = ref<string>('')
  const nextTimestamp = ref<string>('')
  const bettingOpen = ref<boolean>(false)
  //tickets
  const futureDraws = ref<any[]>([])
  const nextDraw = ref<NewBetType[]>([])
  const previousDraws = ref<GameTicketType[]>([])

  const setLottery = (_payload: any) => {
    const { isSet } = useUtils()
    if (isSet(_payload.maxWinCurrency)) {
      maxWinCurrency.value = _payload.maxWinCurrency
    }
    if (isSet(_payload.maxWin)) {
      maxWin.value = _payload.maxWin
    }
    if (isSet(_payload.prizes)) {
      prizes.value = _payload.prizes
    }
    if (isSet(_payload.nextDrawSeconds)) {
      nextDrawSeconds.value = _payload.nextDrawSeconds
    }
    if (isSet(_payload.drawClosesSeconds)) {
      drawClosesSeconds.value = _payload.drawClosesSeconds
    }
    if (isSet(_payload.drawNumber)) {
      drawNumber.value = _payload.drawNumber
    }
    if (isSet(_payload.nextDrawNumber)) {
      nextDrawNumber.value = _payload.nextDrawNumber
    }
    if (isSet(_payload.lastTimestamp)) {
      lastTimestamp.value = _payload.lastTimestamp
    }
    if (isSet(_payload.nextTimestamp)) {
      nextTimestamp.value = _payload.nextTimestamp
    }
    if (isSet(_payload.bettingOpen)) {
      bettingOpen.value = _payload.bettingOpen
    }
  }

  const setTickets = (_payload: any) => {
    const { isSet } = useUtils()
    if (isSet(_payload.futureDraws)) {
      futureDraws.value = _payload.futureDraws
    }
    if (isSet(_payload.nextDraw)) {
      const tickets = _payload.nextDraw
        .filter(
          (ticket: any) =>
            ['CLASSIC', 'HOT'].indexOf(ticket.kenoGameType) !== -1 &&
            nextDrawNumber.value === ticket.drawNumber,
        )
        .map((ticket: any) => {
          const balls = ticket.balls.filter((_number: any) => {
            if (_number > 0) return _number
            else return false
          })

          return {
            ...ticket,
            balls,
          }
        })

      console.log('tickets', tickets)
      nextDraw.value = tickets
    }
    if (isSet(_payload.previousDraws)) {
      previousDraws.value = _payload.previousDraws
    }
  }

  return {
    maxWinCurrency,
    maxWin,
    prizes,
    nextDrawSeconds,
    drawClosesSeconds,
    drawNumber,
    nextDrawNumber,
    lastTimestamp,
    nextTimestamp,
    bettingOpen,
    futureDraws,
    nextDraw,
    previousDraws,
    setLottery,
    setTickets,
  }
})
