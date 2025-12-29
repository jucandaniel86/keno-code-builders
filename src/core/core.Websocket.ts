/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HEARTBEAT_INTERVAL, LotteryStatusTypes, WS_RECONNECT } from '@/config/app.config'
import ErrorManager from './core.ErrorManager'
import Logger from './core.Logger'
import { useUtils } from './core.Util'
import type BetRequestData from './models/bet/BetRequestData'
import type BetResponseData from './models/bet/BetResponseData'
import type ErrorData from './models/ErrorData'
import HearthBeatRequestData from './models/heartbeat/HeartbeatRequestData'
import type LoginRequestData from './models/login/LoginRequestData'
import type LoginResponseData from './models/login/LoginResponseData'
import { useGameStore } from '@/stores/game'
import type BetsRequestData from './models/bets/BetsRequestData'
import type BetsResponseData from './models/bets/BetsResponseData'
import { useLotteryStore } from '@/stores/lottery'
import type BalanceRequestData from './models/balance/BalanceRequestData'
import type BalanceResponseData from './models/balance/BalanceResponseData'
import type ResultsRequestData from './models/results/ResultsRequestData'
import type ResultsResponseData from './models/results/ResultsResponseData'

enum BROADCAST_RESPONSE_TYPES {
  CLOSE = 'close',
  RESULTS = 'results',
}

export default class WebsocketConnector extends Logger {
  public disconnectedCallback!: () => void

  private _isAuthenticated: boolean = false

  private retryTime: number = 2000

  private timeOutTime: number = 10000

  private webSocket: WebSocket | undefined = undefined

  private _serverAddress: string = ''

  protected name = '[WEBSOCKETCONTROLLER]'

  private heartbeatHandle!: number

  private sessionID: string = ''

  private lastError: ErrorData = {
    errorCode: 0,
    errorMessage: '',
    errorObject: {
      operatorCode: 0,
      operatorMessage: '',
    },
  }

  public isConnected(): boolean {
    if (this.webSocket !== undefined && this.webSocket.readyState === WebSocket.OPEN) return true
    return false
  }

  public isAuthenticated(): boolean {
    return this._isAuthenticated
  }

  public async initialize(serverAddress: string): Promise<boolean> {
    this._serverAddress = serverAddress

    return this.connectToServer()
  }

  private async connectToServer(): Promise<boolean> {
    const serverAddress = this._serverAddress

    this._info('Trying to connect to ' + serverAddress)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return new Promise<boolean>((resolve: Function) => {
      let stopAttempts = false
      const trySocket = (): void => {
        if (stopAttempts === true) resolve('Stoping Atempts')
        try {
          this.webSocket = new WebSocket(serverAddress)
        } catch (_err: any) {
          this._info('invalid connection')
          this._info(_err)
        }

        this.webSocket!.onerror = (): void => trySocket()
        this.webSocket!.onopen = (): void => {
          this._info('Connected')
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.webSocket!.onerror = (_ev: any): void => resolve(false)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.webSocket!.onclose = (_ev: any): void => {
            this._warn('Latest error: ' + JSON.stringify(this.lastError))
            if (WS_RECONNECT) {
              this.reconnectToServer()
            } else {
              ErrorManager.Instance().handle(this.lastError.errorCode)
            }
          }
          this.startHeartbeat()
          this.getBroadcast()
          resolve(true)
        }
      }

      trySocket()
      setTimeout(() => {
        stopAttempts = true
        resolve(true)
      }, this.retryTime)
    })
  }

  private reconnectToServer(): void {
    this._isAuthenticated = false
    this.webSocket = undefined

    this.connectToServer()
  }

  private async serverRequest<A, B>(request: A): Promise<Awaited<B>> {
    const { isSet } = useUtils()
    if (isSet(this.webSocket) === false) {
      this._warn('[WEBSOCKETCONTROLLER] Not connected.')
      throw '[WEBSOCKETBROKER] Not connected.'
    }

    return await new Promise<B>((resolve, reject) => {
      this.webSocket!.onmessage = (e: MessageEvent): void => {
        const response = JSON.parse(e.data)
        if (response.response) {
          resolve(response.response)
        } else {
          resolve(response)
        }

        this._log(JSON.stringify(JSON.parse(e.data), null, 2), false)
        if (JSON.parse(e.data).error) {
          this.lastError = JSON.parse(e.data).error
        }

        this.webSocket!.onmessage = null

        awaitingResponse = false
      }

      this._log(JSON.stringify(request, null, 2), true)

      this.webSocket!.send(JSON.stringify(request))

      let awaitingResponse = true

      setTimeout(() => {
        if (awaitingResponse === false) return

        //@ts-ignore
        this.webSocket.onmessage = undefined
        reject('Timeout')
      }, this.timeOutTime)
    })
  }

  /**
   *
   * @param request
   * @returns
   */
  public async authenticate(request: LoginRequestData): Promise<LoginResponseData> {
    const { isSet } = useUtils()
    return this.serverRequest<LoginRequestData, LoginResponseData>(request).then(
      (loginResponse) => {
        if (isSet(loginResponse!.error) === false || loginResponse!.error!.errorCode === 0) {
          this._isAuthenticated = true
          this.sessionID = loginResponse.playerDetails.fixedReference
        }

        return loginResponse
      },
    )
  }

  /**
   *
   * @param request
   * @returns
   */
  public async requestNextGame(request: BetRequestData): Promise<BetResponseData> {
    return this.serverRequest<BetRequestData, BetResponseData>(request)
  }

  /**
   *
   * @param request
   * @returns
   */
  public async requestBets(request: BetsRequestData): Promise<BetsResponseData> {
    return this.serverRequest(request)
  }

  /**
   *
   * @param request
   * @returns
   */
  public async requestBalance(request: BalanceRequestData): Promise<BalanceResponseData> {
    return this.serverRequest(request)
  }

  /**
   *
   * @param request
   * @returns
   */
  public async requestResults(request: ResultsRequestData): Promise<ResultsResponseData> {
    return this.serverRequest(request)
  }

  /**
   * @void
   */
  private startHeartbeat() {
    const nInterval: number = HEARTBEAT_INTERVAL * 1000
    const { getQueryParams } = useUtils()

    if (nInterval > 0) {
      // stop if started
      if (this.heartbeatHandle !== null) {
        clearTimeout(this.heartbeatHandle as any)
      }

      this.heartbeatHandle = setTimeout(() => {
        if (this.isAuthenticated()) {
          const heartbeatData = new HearthBeatRequestData()
          heartbeatData.gameID = getQueryParams('gameID') as any
          heartbeatData.funReal = getQueryParams('funReal') as any
          heartbeatData.sessionID = this.sessionID
          this.serverRequest(heartbeatData)
        }

        // start again
        this.startHeartbeat()
      }, nInterval)
    } else {
      if (this.heartbeatHandle !== null) {
        clearTimeout(this.heartbeatHandle)
      }
    }
  }

  private getBroadcast() {
    this.webSocket!.addEventListener('message', (message: any) => {
      const messageData = JSON.parse(message.data)
      const { setLottery, setLotteryStatus } = useLotteryStore()
      const { setResults } = useGameStore()
      const { isSet } = useUtils()

      if (isSet(messageData.broadcast)) {
        this._logBroadcast(messageData)

        switch (messageData.broadcast.requestType) {
          case BROADCAST_RESPONSE_TYPES.CLOSE:
            setLottery({ bettingOpen: false })
            setLotteryStatus(LotteryStatusTypes.BETTING_CLOSE)
            break
          case BROADCAST_RESPONSE_TYPES.RESULTS:
            setResults(messageData.broadcast.lottery.numbers)
            setLotteryStatus(LotteryStatusTypes.DRAW_START)
            setLottery({
              drawNumber: messageData.broadcast.lottery.drawNumber,
              nextDrawNumber: messageData.broadcast.lottery.nextDrawNumber,
            })
            break
        }
      }
    })
  }

  public getCurrentFeature(features: any[]) {
    const { game } = useGameStore()

    //@ts-ignore
    return features.find((feature) => feature.id === game.room)
  }

  private _logBroadcast(log: any) {
    console.groupCollapsed(
      `%c ${this.name} :: BROADCAST `,
      'background:rgb(69, 3, 144); color: white; display: block;',
    )
    console.log(log)
    console.groupEnd()
  }

  private _log(log: any, isFront = false) {
    if (!isFront) {
      console.groupCollapsed(
        `%c ${this.name} :: BACKEND `,
        'background: #039005; color: white; display: block;',
      )
      console.log(log)
      console.groupEnd()
    } else {
      console.groupCollapsed(
        `%c ${this.name} :: FRONTEND `,
        'background: #C14803; color: white; display: block;',
      )
      console.log(log)
      console.groupEnd()
    }
  }
}
