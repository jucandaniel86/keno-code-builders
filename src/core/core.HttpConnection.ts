import { useGameStore } from '@/stores/game'
import type { ProviderType } from './core.Provider'
import Singleton from './core.Singleton'
import { useUtils } from './core.Util'
import moment from 'moment'
import { storeToRefs } from 'pinia'

export default class HttpConnection extends Singleton {
  protected name = '[HTTPCONNECTION]'
  protected static _Instance: HttpConnection
  private provider!: ProviderType

  constructor() {
    super()
  }

  public setProvider(provider: ProviderType) {
    this.provider = provider
  }

  public static Instance(): HttpConnection {
    if (!this._Instance) {
      this._Instance = new HttpConnection()
    }

    return this._Instance
  }

  private fetch = async (url: string, params = {}) => {
    const results = await fetch(`${url}?${new URLSearchParams(params).toString()}`, {}).then(
      async (_res) => await _res.json(),
    )

    this._info(results)

    return results
  }

  extractStatistics(extractAllNumbers: any[]) {
    const count: any = {}

    extractAllNumbers.forEach((element: number) => {
      count[element] = (count[element] || 0) + 1
    })

    return Object.entries(count).map((_el: any) => ({
      number: _el[0],
      count: _el[1],
    }))
  }

  compare(a: any, b: any) {
    if (a.count > b.count) {
      return -1
    }
    if (a.count < b.count) {
      return 1
    }
    return 0
  }

  async getAnalisysResults() {
    const { setAnalisys } = useGameStore()
    const { getQueryParams } = useUtils()
    const { analisisLoading } = storeToRefs(useGameStore())

    const startTime = moment().subtract(1, 'hour').toDate().getTime()
    const endTime = moment().toDate().getTime()

    try {
      const payload = {
        gameID: getQueryParams('gameID'),
        startTime: startTime,
        endTime: endTime,
      }

      this._info({
        URL: this.provider.analisys,
        DATA: payload,
      })

      analisisLoading.value = true

      const results = await this.fetch(this.provider.analisys, payload)

      if (!results) {
        throw 'Analisys Err::'
      }

      analisisLoading.value = false

      const extractAllNumbers = results.draws.flatMap((_el: any) => {
        return _el.numbers.map((_number: any) => _number.ball)
      })

      const statistics = this.extractStatistics(extractAllNumbers)

      const _lStatistics = Object.values(statistics).sort(this.compare.bind(this))
      let hot = [],
        cold = []
      hot = _lStatistics.slice(0, 10).map((el) => parseInt(el.number))
      cold = _lStatistics.slice(70, 80).map((el) => parseInt(el.number))

      setAnalisys({
        hot,
        cold,
        statistics: results,
      })
    } catch (err) {
      this._warn(err)
    }
  }

  public async getFeed() {
    const { getQueryParams } = useUtils()

    try {
      const payload = {
        gameID: getQueryParams('gameID'),
        siteID: 30,
        brandID: 2,
      }

      this._info({
        URL: this.provider.feed,
        DATA: payload,
      })

      const results = await this.fetch(this.provider.feed, payload)

      if (!results) {
        throw 'Analisys Err::'
      }

      return results
    } catch (err) {
      this._warn(err)
      return false
    }
  }
}
