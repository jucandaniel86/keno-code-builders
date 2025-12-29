import { GAME_TYPES_ENUM, LotteryStatusTypes } from '@/config/app.config'
import NetworkController from '@/core/core.Network'
import { useGameStore } from '@/stores/game'
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

export const useLottery = () => {
  const { setLotteryStatus, clearExtractedNumbers, setLastResult, setActiveGame } =
    useLotteryStore()
  const { lotteryStatus } = storeToRefs(useLotteryStore())
  const { setSelectedNumbers } = useGameStore()

  const closeCurrentDraw = async () => {
    //RGS Requests
    await NetworkController.Instance().setup()
    await NetworkController.Instance().bets()
    await NetworkController.Instance().balance()
    //Reset Current Draw Options
    clearExtractedNumbers()
    setLastResult(null)
    setActiveGame(GAME_TYPES_ENUM.CLASSIC)
    setSelectedNumbers([])
  }

  const onDrawAnimationClose = async () => {
    setLotteryStatus(LotteryStatusTypes.DRAW_ENDS)
    const resultsData = await NetworkController.Instance().getLastResults()
    if (resultsData) {
      setLotteryStatus(LotteryStatusTypes.DISPLAY_RESULTS)
    }
  }

  const watchLotteryStatus = () => {
    watch(lotteryStatus, (newStatus, prevStatus) => {
      console.log(
        '%c🎰 LOTTERY%c status %c%s%c → %c%s%c @ %c%s',
        'padding:2px 8px; background:#111827; color:#f9fafb; border-radius:4px; font-weight:700',
        'color:#9ca3af; margin-left:6px; font-weight:600',
        'color:#10b981; font-weight:700',
        prevStatus ?? 'unknown',
        'color:#9ca3af; margin:0 6px',
        'color:#f59e0b; font-weight:700',
        newStatus,
        'color:#9ca3af; margin-left:6px',
        'color:#6b7280',
        new Date().toLocaleTimeString(),
      )
    })
  }

  return {
    closeCurrentDraw,
    onDrawAnimationClose,
    watchLotteryStatus,
  }
}
