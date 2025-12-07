export type TicketType = {
  bet: number
  numbers: number[]
}

export type PlayerTurnType = {
  tickets: TicketType[]
}

export type PlayerDataType = {
  playerTurn: PlayerTurnType
}

export type TurnType = {
  id: string
  extractedNumbers: number[]
}

export type FeaturesType = {
  playersData: PlayerDataType[]
  turn: TurnType
}

export default class PublicStateResponseData {
  public totalWinCash: number = -1
  public isWon: boolean = false
  public features!: FeaturesType[]
}
