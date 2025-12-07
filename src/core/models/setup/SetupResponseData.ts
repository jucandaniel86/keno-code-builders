import type CreditData from '../CreditData'
import type ErrorData from '../ErrorData'
import ResponseData from '../ResponseData'

type PrizeItem = {
  lose: boolean
  matches: number[]
  winMultiplier: number
  jackpot?: boolean
  jackpotPrizes?: number[]
}

export type PrizeData = {
  selections: number
  bonusLevels: string
  items: PrizeItem[]
}
export default class SetupResponseData extends ResponseData {
  public error!: ErrorData
  public requestType: string = ''
  public credit!: CreditData
  public bettingOpen: boolean = false
  public drawClosesSeconds: number = 0
  public drawNumber: number = 0
  public lastTimestamp: string = ''
  public maxWin: number = 0
  public maxWinCurrency: string = ''
  public nextDrawNumber: number = 0
  public nextDrawSeconds: number = 0
  public nextTimestamp: string = ''
  public prizes?: PrizeData[]
}

/**

prizes
:
[{selections: 1, bonusLevels: "[1, 2, 3, 4, 5, 10]",…},…]
selection
:
0
 */
