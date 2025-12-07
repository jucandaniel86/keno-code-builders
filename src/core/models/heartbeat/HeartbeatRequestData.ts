import RequestData from '../RequestData'

export default class HearthBeatRequestData extends RequestData {
  public devEncrypt: boolean = false
  public funReal: number = 0
  public gameID!: number
  public requestType: string = 'heartbeat'
  public sessionID!: string
}
