import NetworkController from '@/core/core.Network'

export const useLottery = () => {
  const closeCurrentDraw = async () => {
    //RGS Requests
    await NetworkController.Instance().setup()
    await NetworkController.Instance().bets()
    await NetworkController.Instance().balance()
    //Reset Current Draw Options
  }

  return {
    closeCurrentDraw,
  }
}
