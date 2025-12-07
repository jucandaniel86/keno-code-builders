import RequestData from '../RequestData'

export default class BetsRequestData extends RequestData {
  public choicesMade: any[] = []
  public coins: any[] = []
  public requestType: string = 'game'
  public selections: string[] = ['bets']
  public sessionID: string = ''
  public setup: boolean = true
  public stakes: any[] = []
}
