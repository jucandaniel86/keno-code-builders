/* eslint-disable @typescript-eslint/ban-ts-comment */
import Singleton from './core.Singleton'
import { useUtils } from './core.Util'
import type CurrencyData from './models/CurrencyData'

export default class CurrencyConverter extends Singleton {
  protected static _Instance: CurrencyConverter

  private currencyData!: CurrencyData

  protected name = '[CURRENCYCONVERTER]'

  public static Instance(): CurrencyConverter {
    if (!this._Instance) {
      this._Instance = new CurrencyConverter()
    }

    return this._Instance
  }

  public static get CurrencyData(): CurrencyData {
    return this.Instance().currencyData
  }

  public static Initialize(currencyData: CurrencyData): void {
    this.Instance().initialize(currencyData)
  }

  public static HasInitialized(): boolean {
    return this.Instance().currencyData !== undefined
  }

  public initialize(currencyData: CurrencyData): void {
    this.currencyData = currencyData

    this.currencyData.symbol = this.parseHtmlEntities(this.currencyData.symbol)
    if (!this.currencyData.symbol || this.currencyData.symbol === 'null')
      this.currencyData.symbol = currencyData.code.toUpperCase()
    // Settings.Set(SettingType.CurrencySymbol, this.currencyData.symbol)
  }

  public static Convert(
    value: number,
    keepZeroDecimal: boolean = true,
    showCurrency: boolean = true,
  ): string {
    return this.Instance().convert(value, keepZeroDecimal, showCurrency)
  }

  private convert(
    value: number,
    keepZeroDecimal: boolean = true,
    showCurrency: boolean = true,
  ): string {
    const { isSet } = useUtils()

    if (isSet(this.currencyData) === false) {
      this._warn('Not initialized yet.')
      return value.toString()
    }
    return this.formatCurrency(value, keepZeroDecimal, showCurrency)
  }

  private formatMoney(
    value: number,
    decimalsNumber = 2,
    decimalSeparator = '.',
    thousandSeparator = ',',
  ) {
    try {
      //@ts-ignore
      const i = parseInt((value = Math.abs(Number(value) || 0).toFixed(decimalsNumber))).toString()
      const j = i.length > 3 ? i.length % 3 : 0
      return (
        (j ? i.substr(0, j) + thousandSeparator : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandSeparator) +
        (decimalsNumber
          ? decimalSeparator +
            //@ts-ignore
            Math.abs(value - i)
              .toFixed(decimalsNumber)
              .slice(2)
          : '')
      )
    } catch (e) {
      console.log(e)
    }
  }

  private isZeroDecimal(value: string, decimalSeparator: string): boolean {
    return Number(value.split(decimalSeparator)[1]) <= 0
  }

  private formatZeroDecimal(value: string, decimalSeparator: string): string | undefined {
    if (!this.isZeroDecimal(value, decimalSeparator)) return value
    return value.split(decimalSeparator)[0]
  }

  private formatPrefix(value: string, prefix: string): string {
    return `${prefix} ${value}`
  }

  private formatCurrency(
    value: number,
    keepZeroDecimal: boolean = true,
    showCurrency: boolean = true,
  ): string {
    const { decimalsNumber, decimalSeparator, thousandSeparator, symbol } = this.currencyData
    let format: any = this.formatMoney(value, decimalsNumber, decimalSeparator, thousandSeparator)

    if (keepZeroDecimal === false) format = this.formatZeroDecimal(format, decimalSeparator)

    if (showCurrency === true) format = this.formatPrefix(format, symbol)

    return format
  }

  formatFromCurrency(value: number, symbol: string) {
    const { decimalsNumber, decimalSeparator, thousandSeparator } = this.currencyData
    let format: any = this.formatMoney(value, decimalsNumber, decimalSeparator, thousandSeparator)

    format = this.formatPrefix(format, symbol)

    return format
  }

  private parseHtmlEntities(str: string): string {
    return str.replace(/&#([0-9]{1,3});/gi, function (match, numStr) {
      const num = parseInt(numStr, 10) // read num as normal number
      return String.fromCharCode(num)
    })
  }

  public static getCurrency(): string {
    return this.Instance().currencyData.symbol
  }
}
