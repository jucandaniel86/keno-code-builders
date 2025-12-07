import Singleton from './core.Singleton'
import { useUtils } from './core.Util'
import WebsocketConnector from './core.Websocket'
import LoginRequestData from './models/login/LoginRequestData'
import type LoginResponseData from './models/login/LoginResponseData'

import type BetResponseData from './models/bet/BetResponseData'
import type RequestData from './models/RequestData'

import { DEFAULT_SOCKET_ENDPOINT, DEFAULT_SOCKET_SERVER_PATH, GAME_ID } from '@/config/app.config'
import type PlayerDetailsData from './models/PlayerDetailsData'
import BetRequestData from './models/bet/BetRequestData'
import Provider from './core.Provider'
import SetupRequestData from './models/setup/SetupRequestData'
import { useSessionStore } from '@/stores/session'
import { useStatusStore } from '@/stores/status'
import type SetupResponseData from './models/setup/SetupResponseData'
import { useGameStore } from '@/stores/game'
import BetsRequestData from './models/bets/BetsRequestData'

export default class NetworkController extends Singleton {
  public serverProtocol: string = ''

  public endPoint: string = DEFAULT_SOCKET_ENDPOINT

  public serverpath: string = DEFAULT_SOCKET_SERVER_PATH

  public loginRequestData!: LoginRequestData

  public historyURL: any

  public cashierURL: any

  private allowedGameIds = [GAME_ID]

  private ws!: WebsocketConnector

  protected static _Instance: NetworkController

  public static Instance(): NetworkController {
    if (!this._Instance) {
      this._Instance = new NetworkController()
    }

    return this._Instance
  }

  private loadURLParameters(): void {
    this.loginRequestData = new LoginRequestData()
    this.loginRequestData.requestType = 'login'

    const { getQueryParams, isSet, isString } = useUtils()

    const endPoint = Provider.Instance().getProvider().ws
    if (isSet(endPoint) === false) {
      // PopUp.ShowReboot();
      throw new Error('[NETWORKCONTROLLER] Endpoint URL parameter not found.')
    }

    this.endPoint = endPoint as string

    const gameID = getQueryParams('gameID')

    if (isSet(gameID) && typeof gameID === 'string') this.loginRequestData.gameID = gameID

    const siteID = getQueryParams('siteID')

    if (isSet(siteID) && isString(siteID)) this.loginRequestData.siteID = siteID as any

    const brandID = getQueryParams('brandID')

    if (isSet(brandID) && isString(brandID)) this.loginRequestData.brandID = brandID as any

    const fixedID = getQueryParams('fixedID')

    if (isSet(fixedID)) this.loginRequestData.fixedID = fixedID as any

    const playToken = getQueryParams('playToken')

    if (isSet(playToken)) this.loginRequestData.sessionID = playToken as any

    const funReal = getQueryParams('funReal')

    if (isSet(funReal)) this.loginRequestData.funReal = funReal as any

    const sessionID = getQueryParams('sessionID')
    if (isSet(sessionID) && isString(sessionID)) {
      this.loginRequestData.sessionID = sessionID as any
    }

    const cashierURL = getQueryParams('cashierURL')

    if (isSet(cashierURL) === true) this.cashierURL = cashierURL
    else this.cashierURL = undefined

    const historyURL = getQueryParams('historyURL')

    if (isSet(historyURL) === true) this.historyURL = historyURL
    else this.historyURL = undefined

    if (this.loginRequestData.validate() === false) {
      throw new Error('[NETWORKCONTROLLER] Invalid URL Params.')
    }

    if (!this.allowedGameIds.includes(parseInt(this.loginRequestData.gameID))) {
      throw new Error('[NETWORKCONTROLLER] Invalid Game ID.')
    }
  }

  private async initializeServer(): Promise<void> {
    this.ws = new WebsocketConnector()
    await this.ws.initialize(this.serverProtocol + this.endPoint + this.serverpath)
  }

  public async initialize(): Promise<void> {
    this.loadURLParameters()
    await this.initializeServer()
  }

  private generateLoginRequest(): LoginRequestData {
    return this.loginRequestData
  }

  public isConnected(): boolean {
    return this.ws.isConnected()
  }

  public isAuthenticated(): boolean {
    return this.ws.isAuthenticated()
  }

  private updateSessionID(playerDetails: PlayerDetailsData): void {
    if (
      this.loginRequestData.sessionID !== playerDetails.fixedReference &&
      playerDetails.fixedReference
    )
      this.loginRequestData.sessionID = playerDetails.fixedReference
  }

  private generateSetupData(): RequestData {
    const finalRequest = new SetupRequestData()

    finalRequest.sessionID = this.loginRequestData.sessionID
    finalRequest.requestType = 'game'

    return finalRequest
  }

  private generateBetData(lines: any): RequestData {
    const finalRequest = new BetRequestData()
    const { bet } = useStatusStore()

    const bets = {
      bet: bet,
      numbers: lines,
    }
    finalRequest.sessionID = this.loginRequestData.sessionID
    finalRequest.gameID = this.loginRequestData.gameID
    finalRequest.publicState = {
      action: 'START',
      payload: {
        bets: [bets],
        serId: 'ser.keno.start',
      },
    }

    finalRequest.requestType = 'game'

    return finalRequest
  }

  public authenticate(): Promise<LoginResponseData> {
    const { isSet } = useUtils()
    return new Promise((resolve, reject) => {
      if (this.isConnected() === false) {
        reject('Invalid Connection')
        return
      }
      this.ws.authenticate(this.generateLoginRequest()).then((response) => {
        if (isSet(response.credit) === true) {
          //update to store all the shit
          this.updateSessionID(response.playerDetails)

          const { setSessionData } = useSessionStore()
          const { setStatusData } = useStatusStore()

          setStatusData({
            bet: response.defaultStake,
            credit: response.credit?.amount,
          })

          setSessionData({
            sessionID: response.playerDetails.sessionId,
            fixedID: response.playerDetails.fixedReference,
            credit: response.credit,
            currency: response.currency,
            betLevels: response.stakeValues,
            betIndex: response.stakeValues.indexOf(response.defaultStake),
          })
        }

        resolve(response)
      })
    })
  }

  public async setup(): Promise<SetupResponseData> {
    const { isSet } = useUtils()
    const { setPrizes, setTimer } = useGameStore()
    if (this.isAuthenticated() === false) {
      return this.ws
        .authenticate(this.generateLoginRequest())
        .then(() => this.ws.requestNextGame(this.generateSetupData() as any))
        .then((response: any) => {
          if (isSet(response.lottery.prizes)) {
            setPrizes(response.lottery.prizes)
          }
          if (isSet(response.lottery.drawClosesSeconds)) {
            setTimer(response.lottery.drawClosesSeconds)
          }

          if (isSet(response.credit) === true)
            // GameController.UpdateCreditData(response.credit);

            this.updateSessionID(response.playerDetails)
          return response
        })
    } else {
      return this.ws.requestNextGame(this.generateSetupData() as any).then((response: any) => {
        if (isSet(response.lottery.prizes)) {
          setPrizes(response.lottery.prizes)
        }
        if (isSet(response.lottery.drawClosesSeconds)) {
          setTimer(response.lottery.drawClosesSeconds)
        }

        if (isSet(response.credit) === true)
          // GameController.UpdateCreditData(response.credit);

          this.updateSessionID(response.playerDetails)

        return response
      })
    }
  }

  public async bet(lines: any[]): Promise<BetResponseData> {
    // const { setGamePlay } = useGameStore()
    const { isSet } = useUtils()

    if (this.isAuthenticated() === false) {
      return this.ws
        .authenticate(this.generateLoginRequest())
        .then(() => this.ws.requestNextGame(this.generateBetData(lines) as any))
        .then((response: any) => {
          if (isSet(response.credit) === true)
            // GameController.UpdateCreditData(response.credit);

            this.updateSessionID(response.playerDetails)

          return response
        })
    } else {
      return this.ws
        .requestNextGame(this.generateBetData(lines) as any)
        .then((response) => response)
    }
  }

  private generateBetsData() {
    const finalRequest = new BetsRequestData()

    finalRequest.sessionID = this.loginRequestData.sessionID
    finalRequest.requestType = 'game'

    return finalRequest
  }

  public async bets() {
    const { isSet } = useUtils()
    const { setHistory } = useGameStore()

    return this.ws.requestBets(this.generateBetsData() as any).then((response) => {
      console.log('RESPONSE', response)
      if (isSet(response.lottery.previousDraws)) {
        setHistory(response.lottery.previousDraws)
      }
    })
  }
}
