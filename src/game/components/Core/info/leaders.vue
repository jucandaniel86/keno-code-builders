<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import CurrencyConverter from '@/core/core.CurrencyConvertor'
import HttpConnection from '@/core/core.HttpConnection'
import { useUtils } from '@/core/core.Util'
import { computed, onMounted, ref } from 'vue'
//@ts-ignore
import { useI18n } from 'vue-i18n'
import LeadersHeaders from './leaders-headers.vue'

//types
export type WinnerType = {
  bigWinner: boolean | string
  currency: string
  dateTimeWon: string
  displayName: string
  gameName: string
  stake: number
  winAmount: number
  multiplier: number
}

export type SortLeaderType = {
  column?: string
  direction?: string
}

//composables
const { isSet, kFormatter } = useUtils()
const { t } = useI18n()

//models
const winners = ref<WinnerType[]>([])
const loading = ref<boolean>(false)
const sortOptions = ref<SortLeaderType>({
  column: 'displayName',
  direction: 'ASC',
})
const columns = [
  { column: 'displayName', label: t('leaders.displayName'), width: 30 },
  { column: 'stake', label: t('leaders.bet'), width: 15 },
  { column: 'multiplier', label: 'x', width: 25 },
  { column: 'winAmount', label: t('leaders.win') },
]

//methods
const roundHalf = (num: number) => {
  return Math.round(num * 2) / 2
}

const calculateMultiplier = (win: number, stake: number) => {
  return stake <= 0 ? 0 : roundHalf(win / stake)
}

const fetchWinners = async () => {
  loading.value = true
  const results = await HttpConnection.Instance().getFeed()

  if (results && isSet(results.prizeWinners)) {
    winners.value = results.prizeWinners.map((el: WinnerType) => ({
      ...el,
      multiplier: calculateMultiplier(el.winAmount, el.stake),
    }))
  }
  loading.value = false
}

const handleSort = (sort: SortLeaderType) => {
  sortOptions.value = sort
}

//computed
const leaders = computed(() => {
  const { column = 'displayName', direction = 'ASC' }: SortLeaderType = sortOptions.value

  const _f = (_number: any) => parseFloat(String(_number))

  const _tmpLeaders = [...winners.value].sort((_a: WinnerType, _b: WinnerType) => {
    if (direction === 'ASC') {
      switch (column) {
        case 'displayName':
          return _a.displayName.localeCompare(_b.displayName)
        case 'stake':
          return _f(_a.stake) < _f(_b.stake) ? -1 : 1
        case 'multiplier':
          return _a.multiplier < _b.multiplier ? -1 : 1
        case 'winAmount':
          return _f(_a.winAmount) < _f(_b.winAmount) ? -1 : 1
        default:
          return _a.displayName.localeCompare(_b.displayName)
      }
    }

    if (direction === 'DESC') {
      switch (column) {
        case 'displayName':
          return _b.displayName.localeCompare(_a.displayName)
        case 'stake':
          return _f(_b.stake) > _f(_a.stake) ? 1 : -1
        case 'multiplier':
          return _b.multiplier > _a.multiplier ? 1 : -1
        case 'winAmount':
          return _f(_b.winAmount) > _f(_a.winAmount) ? 1 : -1
        default:
          return _b.displayName.localeCompare(_a.displayName)
      }
    }
    return 0
  })
  return _tmpLeaders
})

//onMounted
onMounted(() => {
  fetchWinners()
})
</script>
<template>
  <div style="height: 100%">
    <p v-if="loading">Loading</p>
    <div className="leaders-container" v-else>
      <div className="leaders-header">
        <LeadersHeaders
          :columns="columns"
          :default-sorting-column="'displayName'"
          @on-sort="handleSort"
        />
      </div>
      <div className="leaders-body" v-if="winners && leaders">
        <div v-for="(leader, index) in leaders" class="leader-item" :key="`Leader_${index}`">
          <table>
            <tbody>
              <tr>
                <td style="width: 30%">{{ leader.displayName }}</td>
                <td style="width: 15%">
                  {{
                    CurrencyConverter.Instance().formatFromCurrency(leader.stake, leader.currency)
                  }}
                </td>
                <td style="width: 25%; text-align: right">x{{ leader.multiplier }}</td>
                <td style="text-align: right">{{ kFormatter(leader.winAmount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
