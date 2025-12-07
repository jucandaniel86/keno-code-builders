import useModalStore from '@/stores/modal'
import Singleton from './core.Singleton'
import Proxi from './core.Proxi'
import { useUtils } from './core.Util'
import { i18n } from '@/i18n'

export default class ModalController extends Singleton {
  protected name = '[MODALCONTROLLER]'

  protected static _Instance: ModalController

  protected openFunc!: (_args: any) => void

  protected closeFunc!: () => void

  private buttons: any

  private t

  constructor() {
    super()

    const { openInfoModal, closeModal } = useModalStore()

    this.openFunc = openInfoModal
    this.closeFunc = closeModal

    this.t = i18n.global.t
    this.getButtons()
  }

  public static Instance(): ModalController {
    if (!this._Instance) {
      this._Instance = new ModalController()
    }

    return this._Instance
  }

  private getButtons() {
    this.buttons = {
      onOk: {
        text: this.t('modals.TEXT_OK'),
        onClick: () => this.closeFunc(),
      },
      onClose: {
        text: this.t('modals.TEXT_CLOSE'),
        onClick: () => this.closeFunc(),
      },
      onCashier: {
        text: this.t('modals.DEPOSIT_BTN'),
        onClick: () => Proxi.Instance().visitCashier(),
      },
      onHome: {
        text: this.t('modals.LOBBY_BTN'),
        onClick: () => Proxi.Instance().visitLobby(),
      },
      onReload: {
        text: this.t('modals.TEXT_RELOAD'),
        onClick: () => window.location.reload(),
      },
    }
  }

  public insufficientFounds() {
    const _btns = [this.buttons.onClose]
    const { getQueryParams } = useUtils()

    if (getQueryParams('cashierURL')) _btns.push(this.buttons.onCashier)

    this.openFunc({
      title: this.t('errors.TEXT_INSUFFICIENT_FOUNDS_TITLE'),
      content: this.t('errors.TEXT_ZERO_FOUNDS_LABEL'),
      buttons: _btns,
    })

    this._info('insufficientFounds() open')
  }

  public zeroFounds() {
    const _btns = [this.buttons.onClose]

    this.openFunc({
      title: this.t('errors.TEXT_INSUFFICIENT_FOUNDS_TITLE'),
      content: this.t('errors:TEXT_ZERO_FOUNDS_LABEL'),
      buttons: _btns,
    })

    this._info('zeroFounds() open')
  }

  public reload() {
    this.openFunc({
      title: this.t('errors.TEXT_GENERIC_ERROR_TITLE'),
      content: this.t('errors.TEXT_GENERIC_ERROR_TEXT'),
      buttons: [this.buttons.onReload],
    })
  }

  public ok(title: string, content: string) {
    this.openFunc({
      title,
      content,
      buttons: [this.buttons.onOk],
    })
  }

  public error(_errText: string) {
    console.error('ERROR', _errText)
    this.openFunc({
      title: 'Error',
      content: _errText,
      buttons: [this.buttons.onReload],
    })
  }

  public kicked(_reason: string) {
    const buttons = [this.buttons.onReload]
    const { getQueryParams } = useUtils()

    if (getQueryParams('lobbyURL')) {
      buttons.push(this.buttons.onHome)
    }
    this.openFunc({
      title: this.t('modals.TEXT_KICKED_TITLE'),
      content: this.t('modals.TEXT_KICKED_TEXT') + ' ' + _reason,
      buttons: buttons,
    })
  }

  public settings() {
    const { openSettingsModal } = useModalStore()

    openSettingsModal({
      title: '',
      content: '',
      buttons: [],
    })
  }
}
