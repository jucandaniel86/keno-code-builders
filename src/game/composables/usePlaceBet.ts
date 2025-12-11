import { ALLOWED_NUMBERS, BETTING_OPEN_SECONDS, GAME_TYPES_ENUM } from '@/config/app.config'
import ModalController from '@/core/core.ModalController'
import NetworkController from '@/core/core.Network'
import { useGameStore } from '@/stores/game'
import { useLotteryStore } from '@/stores/lottery'
import { useStatusStore } from '@/stores/status'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAlerts } from './useAlerts'

export const usePlaceBet = () => {
  const { t } = useI18n()
  const { gameType, selectedNumbers } = storeToRefs(useGameStore())
  const { credit, bet } = storeToRefs(useStatusStore())
  const { bettingOpen, nextDrawSeconds } = storeToRefs(useLotteryStore())

  const betDisabled = computed(() => {
    if (
      !bettingOpen.value ||
      selectedNumbers.value.length === 0 ||
      nextDrawSeconds.value <= BETTING_OPEN_SECONDS
    ) {
      return true
    }
    return false
  })

  const calculateTotal = () => {
    const noTickets = 1
    return noTickets * bet.value
  }

  const isInsufficientFunds = () => {
    const total = calculateTotal()

    if (credit.value < total) {
      if (credit.value === 0) {
        ModalController.Instance().error(t('modals.ZERO_FUNDS_WINDOW'))
      } else {
        ModalController.Instance().insufficientFounds()
      }
      return true
    } else {
      return false
    }
  }

  const validate = () => {
    if (!bettingOpen.value) return false

    if (selectedNumbers.value.length === 0 && gameType.value !== GAME_TYPES_ENUM.HOT) {
      ModalController.Instance().error(t('modals.TEXT_INVALID_NUMBERS'))
      return false
    }

    if (
      !ALLOWED_NUMBERS.includes(selectedNumbers.value.length) &&
      gameType.value !== GAME_TYPES_ENUM.HOT
    ) {
      ModalController.Instance().error(t('modals.TEXT_INVALID_COMBINATION'))
      return false
    }

    return true
  }

  const placeBet = async () => {
    if (!validate()) return
    if (isInsufficientFunds()) return

    const { success } = useAlerts()

    const betData = await NetworkController.Instance().bet()

    if (betData?.error.errorCode !== 0) return

    success(t('modals.TEXT_PLACED_BET'))

    await NetworkController.Instance().bets()
    await NetworkController.Instance().balance()

    selectedNumbers.value = []
  }

  return {
    betDisabled,
    placeBet,
  }
}
