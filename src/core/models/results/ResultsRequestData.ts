import RequestData, { WS_REQUEST_TYPES } from '../RequestData'

export default class ResultsRequestData extends RequestData {
  public requestType: string = WS_REQUEST_TYPES.GAME
  public sessionID: string = ''
  public stakes: any[] = []
  public choicesMade: any[] = []
  public selections: any[] = ['getLastDrawResults']
  public setup: boolean = true
  public coins: any = []
}
