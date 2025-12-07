type PublicStatePayload = {
  bets: any[]
  serId: string
}

export default class PublicStateRequestData {
  public action: string = ''
  public payload!: PublicStatePayload
}
