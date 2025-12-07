/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ProviderType } from './core.Provider'
import Singleton from './core.Singleton'
import { useUtils } from './core.Util'
import type ProxiAbstract from './interfaces/ProxiAbstract'

export default class Proxi extends Singleton implements ProxiAbstract {
  private provider!: ProviderType
  private isWrapperLoaded: boolean = false
  private noWrapper: boolean = false
  protected static _Instance: Proxi

  protected name = '[PROXI]'

  public static Instance(): Proxi {
    if (!this._Instance) {
      this._Instance = new Proxi()
    }

    return this._Instance
  }

  public async init(provider: ProviderType) {
    const { getQueryParams, loadJS } = useUtils()
    this.provider = provider
    this.noWrapper = getQueryParams('noWrapper') === 'true'

    try {
      await loadJS(this.provider.wrapper)
      this.isWrapperLoaded = true
      this._info('wrapper is loaded')
    } catch (err) {
      this._warn(err)
    }
  }

  private canSend(): boolean {
    if (!this.isWrapperLoaded) return false

    if (this.noWrapper) return false
    return true
  }

  gameReady(): void {
    if (!this.canSend()) {
      //@ts-ignore
      cbGameWrapper.isWrapperActive({
        data: {
          active: true,
        },
      })
    }
  }

  gameLoadingStarted(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.gameLoadingStarted()
    }
  }

  gameLoadingEnded(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.gameLoadingEnded()
    }
  }

  updateStake(_number: number): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.stakeUpdate(_number)
    }
  }

  insufficientFunds(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.insufficientFunds()
    }
  }

  gameExit(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.exitGame()
    }
  }

  gameReload(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.gameReload()
    }
  }

  sendWindowSize(_width: number, _height: number): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.gameResize(_width, _height)
    }
  }

  updateBalance(_number: number, _stake: number): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.balancesUpdate(_number, _stake)
    }
  }

  paytableDialogueOpened(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.paytableDialogueOpened()
    }
  }

  paytableDialogueClosed(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.paytableDialogueClosed()
    }
  }

  rulesDialogueOpened(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.rulesDialogueOpened()
    }
  }

  rulesDialogueClosed(): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.rulesDialogueClosed()
    }
  }

  visitLobby(): void {
    const { getQueryParams } = useUtils()
    const lobbyUrl = getQueryParams('lobbyURL')
    if (lobbyUrl) {
      //@ts-ignore
      window.top.location.href = decodeURIComponent(lobbyUrl)
    }
  }

  visitHistory(): void {
    const { getQueryParams } = useUtils()
    const historyLink =
      getQueryParams('historyURL') +
      '?' +
      'siteID=' +
      getQueryParams('siteID') +
      '&gameID=' +
      getQueryParams('gameID') +
      '&fixedID=' +
      getQueryParams('fixedID')

    window.open(historyLink, '_blank')?.focus()
  }

  visitRules(): void {
    const { getQueryParams } = useUtils()
    const rulesLink =
      getQueryParams('rulesURL') +
      '?' +
      'siteID=' +
      getQueryParams('siteID') +
      '&lang=' +
      getQueryParams('lang') +
      '&gameID=' +
      getQueryParams('gameID')

    //@ts-ignore
    if (
      //@ts-ignore
      !isNaN(parseInt(Utils.getUrlParameter('siteID'))) &&
      //@ts-ignore
      parseInt(Utils.getUrlParameter('siteID')) === 30
    ) {
      window.location.href = rulesLink
      return
    }

    if (!getQueryParams('rulesURL')) {
      const rulesLink =
        '/games/heads-or-tails/rules.html' +
        '?' +
        'siteID=' +
        getQueryParams('siteID') +
        '&lang=' +
        getQueryParams('lang') +
        '&gameID=' +
        getQueryParams('gameID')

      window.open(rulesLink, '_blank')?.focus()
    }

    window.open(rulesLink, '_blank')?.focus()
  }

  visitCashier(): void {
    //@ts-ignore
    const deposit_URL = decodeURIComponent(
      //@ts-ignore
      Utils.getUrlParameter('cashierURL') || Utils.getUrlParameter('depositURL'),
    )

    //@ts-ignore
    window.top.location.href = deposit_URL
  }

  roundStart(_bet: number, _credit: number): void {
    if (this.canSend()) {
      //@ts-ignore
      cbGameWrapper.setBusy(_bet)
    }
  }

  serverInitComplete(): void {
    throw new Error('Method not implemented.')
  }
  toggleWrapperActive(_boolean: boolean): void {
    throw new Error('Method not implemented.')
  }
  toggleRealityCheck(_boolean: boolean): void {
    throw new Error('Method not implemented.')
  }
  sendRoundOn(_boolean: boolean): void {
    throw new Error('Method not implemented.')
  }
  toggleSound(_boolean: boolean): void {
    throw new Error('Method not implemented.')
  }
  updateLoadingProgress(_percent: number): void {
    throw new Error('Method not implemented.')
  }
  updateWinnings(_number: number): void {
    throw new Error('Method not implemented.')
  }
  roundStarted(_obj: any): void {
    throw new Error('Method not implemented.')
  }
  roundEnded(_obj: any): void {
    throw new Error('Method not implemented.')
  }
  gotoAccountsPage(): void {
    throw new Error('Method not implemented.')
  }
  gotoResponsibleGamingPage(): void {
    throw new Error('Method not implemented.')
  }
  menuDialogOpened(): void {
    throw new Error('Method not implemented.')
  }
  menuDialogClosed(): void {
    throw new Error('Method not implemented.')
  }
  betDialogueOpened(): void {
    throw new Error('Method not implemented.')
  }
  betDialogueClosed(): void {
    throw new Error('Method not implemented.')
  }
  autospinDialogueOpened(): void {
    throw new Error('Method not implemented.')
  }
  autospinDialogueClosed(): void {
    throw new Error('Method not implemented.')
  }
}
