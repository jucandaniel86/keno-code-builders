import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export const useHistory = () => {
  const { previousDraws } = storeToRefs(useLotteryStore())

  const tickets = computed(() => {
    const result: any = []

    previousDraws.value.forEach((ticket: any) => {
      const currentDrawID = ticket.drawNumber
      const currentDrawExists = result.find((element: any) => element.drawNumber === currentDrawID)

      if (!currentDrawExists) {
        result.push({
          drawNumber: currentDrawID,
          tickets: [ticket],
        })
      } else {
        currentDrawExists.tickets.push(ticket)
      }
    })
    return result
  })

  const totalStake = (tickets: any[]) => {
    return tickets.reduce((acumulator: any, val: any) => {
      return acumulator + val.stake
    }, 0)
  }

  const totalWin = (tickets: any[]) => {
    return tickets.reduce((acumulator: any, val: any) => {
      return acumulator + val.totalPrize
    }, 0)
  }

  return {
    tickets,
    totalStake,
    totalWin,
  }
}
