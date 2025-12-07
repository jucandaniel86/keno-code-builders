import ModalController from './core.ModalController'
import Singleton from './core.Singleton'
import { useUtils } from './core.Util'
import { i18n } from '@/i18n'

export default class ErrorManager extends Singleton {
  protected name = '[ERROR_MANAGER]'
  protected static _Instance: ErrorManager

  public static Instance(): ErrorManager {
    if (!this._Instance) {
      this._Instance = new ErrorManager()
    }

    return this._Instance
  }

  handle(_errorCode: number) {
    switch (_errorCode) {
      //DUPLICATE SOCKET SESSION
      case 33:
        return this.handleRedirect()
      case 13:
        return this.handleRedirect()
      case 116:
        return this.handleRedirect()
      default:
        return this.handleRedirect()
    }
  }

  handleRedirect() {
    const { getQueryParams } = useUtils()

    const t = i18n.global.t

    if (parseInt(getQueryParams('siteID') as any) !== 30) {
      ModalController.Instance().error(String(t('modals.TEXT_WEBSOCKET_CLOSED')))
      return
    }
  }
}
