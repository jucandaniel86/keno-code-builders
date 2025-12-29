import type CreditData from '../CreditData'
import type ErrorData from '../ErrorData'
import ResponseData from '../ResponseData'
import type RoundData from '../RoundData'

export default class ResultsResponseData extends ResponseData {
  public bonusCredit: any[] = []
  public continue: boolean = true
  public error!: ErrorData
  public credit!: CreditData
  public heartbeat: boolean = false
  public playerDetails: any = {}
  public priority: number = 0
  public regulatory: any = {}
  public round!: RoundData
  public lottery: any
}
