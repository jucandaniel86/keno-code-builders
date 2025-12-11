import RequestData from '../RequestData'

export default class BetRequestData extends RequestData {
  public requestType: string = 'game'
  public sessionID: string = ''
  public selections: any[] = []
  public choicesMade: number[] = []
  public stakes: number[] = []
  public coins: any[] = []
  public setup = false
  public echoRef = false
  public currency: any = ''
  public nextDrawNumber: any = ''
  public nextTimestamp: any = ''
  public kenoGameType = ''
}
