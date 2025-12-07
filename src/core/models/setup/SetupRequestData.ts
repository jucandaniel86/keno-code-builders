import RequestData from '../RequestData'

export default class SetupRequestData extends RequestData {
  public choicesMade: any[] = []
  public coins: any[] = []
  public getPayTable: boolean = true

  public requestType: string = ''
  public sessionID: string = ''
  public selections: string[] = ['timer']

  public setup: boolean = true
  public stakes: any[] = []
}
