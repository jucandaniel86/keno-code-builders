import Logger from './core.Logger'

export default class Singleton extends Logger {
  protected static _Instance: unknown

  protected static Instance(): unknown {
    return this._Instance
  }

  protected static SetInstance(object: unknown): void {
    this._Instance = object
  }
}
