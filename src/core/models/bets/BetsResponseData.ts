import type CreditData from '../CreditData'
import type ErrorData from '../ErrorData'
import ResponseData from '../ResponseData'

export enum KenoGameTypes {
  CLASSIC = 'CLASSIC',
}

export type TicketType = {
  balls: number[]
  dateTime: string
  drawNumber: number
  drawResults: number[]
  drawTime: string
  headOrTailPrize: number
  kenoBetType: string
  kenoDrawType: string
  kenoGameType: string
  onlyHeadOrTailBet: boolean
  prize?: number
  selection?: number
  stake?: number
  ticketNumber: number
  totalPrize?: number
}

type LotteryBetsType = {
  futureDraws: TicketType[]
  nextDraw: TicketType[]
  previousDraws: TicketType[]
  selection: number
  totalWinOnLastDraw: number
}

export default class BetsResponseData extends ResponseData {
  public error!: ErrorData
  public requestType: string = ''
  public credit!: CreditData
  public lottery!: LotteryBetsType
}
