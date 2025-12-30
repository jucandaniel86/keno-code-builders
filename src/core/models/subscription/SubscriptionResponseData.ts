import type CreditData from '../CreditData'
import type ErrorData from '../ErrorData'
import ResponseData from '../ResponseData'
import type PublicStateResponseData from '../bet/PublicStateResponseData'

export default class SubscriptionResponseData extends ResponseData {
  public publicState!: PublicStateResponseData
  public error!: ErrorData
  public requestType: string = ''
  public credit!: CreditData
}
