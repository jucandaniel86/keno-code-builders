import type CreditData from '../CreditData'
import type CurrencyData from '../CurrencyData'
import type ErrorData from '../ErrorData'
import type PlayerDetailsData from '../PlayerDetailsData'
import ResponseData from '../ResponseData'
import type RoundData from '../RoundData'

export default class LoginResponseData extends ResponseData {
  public playerDetails!: PlayerDetailsData
  public credit: CreditData | undefined = undefined
  public bonusCredit = []
  public stakeValues: Array<number> = []
  public defaultStake: number = -1
  public currencyExample: string = ''
  public currency: CurrencyData | undefined = undefined
  public autoBet: Array<number> = []
  public message = undefined
  public heartbeat: boolean = false
  public regulatory = undefined
  public priority: number = -1
  public continue: boolean = false
  public round: RoundData | undefined = undefined
  public error: ErrorData | undefined = undefined
}
