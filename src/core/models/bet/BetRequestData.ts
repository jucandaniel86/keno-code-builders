import RequestData from '../RequestData'

type BetType = {
  bet: number
  numbers: number[]
}

interface PublicStateBetRequestData {
  payload: {
    bets: BetType[]
    serId: string
  }
  action: string
}

export default class BetRequestData extends RequestData {
  public bonusRef1: string = ''
  public gameID: string | number = ''
  public requestType: string = 'game'
  public sessionID: string = ''
  public publicState!: PublicStateBetRequestData
}
