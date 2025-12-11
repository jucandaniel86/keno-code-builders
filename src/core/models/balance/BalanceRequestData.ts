import RequestData, { WS_REQUEST_TYPES } from '../RequestData'

export default class BalanceRequestData extends RequestData {
  public requestType: string = WS_REQUEST_TYPES.BALANCE
  public sessionID: string = ''
  public gameID: any = ''
  public setup: boolean = true
  public publicState: any = {
    action: '',
  }
}
