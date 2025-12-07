import { useUtils } from '@/core/core.Util'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

export const usePrizes = () => {
  //models
  const currentPrizes = ref<any[]>([])
  //composables
  const { prizes, selectedNumbers } = storeToRefs(useGameStore())

  //methods
  const extractCurrentPrize = () => {
    const { kFormatter } = useUtils()
    currentPrizes.value = []

    const _prize = prizes.value.find((prize) => prize.selections === selectedNumbers.value.length)

    if (_prize && _prize.items) {
      _prize.items.forEach((item: any) => {
        const matches = item.matches
        matches.forEach((match: any) => {
          let lPrize = kFormatter(item.winMultiplier)

          if (item.jackpotPrizes) {
            const lJackpots: any[] = []
            item.jackpotPrizes.forEach((jackpot: number, index: number) => {
              let label = ''
              switch (index) {
                case 0:
                  label = 'mini'
                  break
                case 1:
                  label = 'super'
                  break
                case 2:
                  label = 'mega'
                  break
              }
              lJackpots.push(`${kFormatter(jackpot)} (${label})`)
            })
            lPrize = lJackpots.join(',')
          }

          currentPrizes.value.push({
            match: match,
            multiplier: lPrize,
          })
        })
      })
    }
  }

  // let sortedPrizes = _.sortBy(currentPrizes, ["match"], "asc");
  // if (display === PrizeDisplayType.TOP || display === PrizeDisplayType.POPUP) {
  //   sortedPrizes = sortedPrizes.reverse();
  // }
  // }

  watch(selectedNumbers, () => {
    extractCurrentPrize()
  })

  return {
    currentPrizes,
  }
}
