import { useUtils } from '@/core/core.Util'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface GameCreditI {
  amount: number
  baseCredits: number
  bonus: number
  currency: string
  decimalPrecision: number | string
  isFiat: boolean
  regular: number
  ticketValue: number
  ticketsLeft: number
}

export interface GameCurrencyI {
  before: boolean
  code: string
  decimalSeparator: string
  decimalsNumber: number
  symbol: string
  thousandSeparator: string
}

export const useSessionStore = defineStore('session', () => {
  //models
  const sessionID = ref<string>('')
  const fixedID = ref<string>('')
  const credit = ref<GameCreditI>()
  const currency = ref<GameCurrencyI>()
  const betLevels = ref<number[]>([])
  const betIndex = ref<number>(0)

  //composables
  const { isSet } = useUtils()

  const setSessionID = (_sessionID: string) => (sessionID.value = _sessionID)
  const setFixedID = (_fixedID: string) => (fixedID.value = _fixedID)
  const setCredit = (_payload: GameCreditI) => (credit.value = _payload)
  const setCurrency = (_payload: GameCurrencyI) => (currency.value = _payload)
  const setBetLevels = (_payload: number[]) => (betLevels.value = _payload)
  const setBetIndex = (_betIndex: number) => (betIndex.value = _betIndex)
  const setSessionData = (_payload: any) => {
    if (isSet(_payload.sessionID)) {
      setSessionID(_payload.sessionID)
    }
    if (isSet(_payload.fixedID)) {
      setFixedID(_payload.fixedID)
    }
    if (isSet(_payload.credit)) {
      setCredit(_payload.credit)
    }
    if (isSet(_payload.currency)) {
      setCurrency(_payload.currency)
    }
    if (isSet(_payload.betLevels)) {
      setBetLevels(_payload.betLevels)
    }
    if (isSet(_payload.betIndex)) {
      setBetIndex(_payload.betIndex)
    }
  }

  const setMaxBet = () => {
    betIndex.value = betLevels.value.length - 1
  }

  return {
    sessionID,
    fixedID,
    credit,
    currency,
    betLevels,
    betIndex,
    setSessionID,
    setFixedID,
    setCredit,
    setCurrency,
    setBetLevels,
    setBetIndex,
    setSessionData,
    setMaxBet,
  }
})
