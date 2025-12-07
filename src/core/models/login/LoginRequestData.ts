import { useUtils } from '@/core/core.Util'
import RequestData from '../RequestData'

export default class LoginRequestData extends RequestData {
  public sessionID: string = ''
  public funReal: string = '-1'
  public fixedID: string = ''
  public siteID: string = ''
  public gameID: string = ''
  public brandID: string = ''

  public validate(): boolean {
    const { isSet } = useUtils()
    return (
      isSet(this.sessionID) &&
      this.sessionID !== '' &&
      isSet(this.fixedID) &&
      this.fixedID !== '-1' &&
      isSet(this.siteID) &&
      this.siteID !== '' &&
      isSet(this.gameID) &&
      this.gameID !== ''
    )
  }
}
