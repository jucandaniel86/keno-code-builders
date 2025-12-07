import Singleton from './core.Singleton'
import { useUtils } from './core.Util'

export type ProviderType = {
  wrapper: string
  ws: string
  env: string
  analisys: string
  feed: string
}

export enum ProviderEndpointEnum {
  DEV = 'dev.cbcontents.com',
  UAT = 'uat.cbcontents.com',
  PROD = 'prod.cbcontents.com',
}

export default class Provider extends Singleton {
  protected static _Instance: Provider
  private endpoint: any = ''
  private provider!: ProviderType

  protected name = '[PROVIDER]'

  constructor() {
    super()
  }

  public static Instance(): Provider {
    if (!this._Instance) {
      this._Instance = new Provider()
    }

    return this._Instance
  }

  public initialize(): void {
    const { getQueryParams } = useUtils()

    this.endpoint = getQueryParams('endpoint')
    const date = new Date()

    switch (this.endpoint) {
      case ProviderEndpointEnum.DEV:
        this.provider = {
          wrapper: 'https://demo.cbcontents.com/widget/game-wrapper/wrapper.js?v=' + date.getTime(),
          ws: 'wss://' + this.endpoint + '/',
          env: 'DEV',
          analisys: 'https://dev.cbcontents.com/analysis/',
          feed: 'https://uat.cbcontents.com/marlipin/launch/feed.jsp',
        }
        break
      case ProviderEndpointEnum.UAT:
        this.provider = {
          wrapper:
            'https://demo-uat.cbcontents.com/widget/game-wrapper/wrapper.js?v=' + date.getTime(),
          ws: 'wss://' + this.endpoint + '/',
          env: 'UAT',
          analisys: 'https://uat.cbcontents.com/analysis/',
          feed: 'https://uat.cbcontents.com/marlipin/launch/feed.jsp',
        }
        break
      case ProviderEndpointEnum.PROD:
        this.provider = {
          wrapper: 'https://fe.cbcontents.com/game-wrapper/wrapper.js?v=' + date.getTime(),
          ws: 'wss://' + this.endpoint + '/',
          env: 'PROD',
          analisys: 'https://prod1.cbcontents.com/analysis/',
          feed: 'https://prod1.cbcontents.com/marlipin/launch/feed.jsp',
        }
        break
      default:
        this.provider = {
          wrapper: 'https://demo.cbcontents.com/widget/game-wrapper/wrapper.js?v=' + date.getTime(),
          ws: 'wss://' + this.endpoint + '/',
          env: 'DEV',
          analisys: 'https://dev.cbcontents.com/analysis/',
          feed: 'https://uat.cbcontents.com/marlipin/launch/feed.jsp',
        }
    }
  }

  public getProvider(): ProviderType {
    return this.provider
  }

  public printProvider(): void {
    this._info(this.provider)
  }
}
