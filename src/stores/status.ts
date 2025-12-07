import CurrencyConverter from '@/core/core.CurrencyConvertor'
import { useUtils } from '@/core/core.Util'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface StatusDataI {
  bet: number
  credit: number
}

export const useStatusStore = defineStore('status', () => {
  const credit = ref<number>(0)
  const bet = ref<number>(0)

  const { isSet } = useUtils()

  const setStatusData = (payload: any) => {
    if (isSet(payload.bet)) {
      bet.value = payload.bet
    }

    if (isSet(payload.credit)) {
      credit.value = payload.credit
    }
  }

  const balance = computed(() => {
    return CurrencyConverter.Convert(credit.value)
  })

  return {
    credit,
    bet,
    balance,
    setStatusData,
  }
})
