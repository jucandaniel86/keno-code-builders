import { ref } from 'vue'

export const useUtils = () => {
  const UrlParams = ref(new URLSearchParams(window.location.search))

  const getQueryParams = (_param: string): number | string | undefined | null => {
    if (UrlParams.value.has(_param)) {
      return UrlParams.value.get(_param)
    }

    return undefined
  }

  const isSet = (variable: any): boolean => {
    return variable !== undefined && variable !== null
  }

  const isString = (variable: any): boolean => typeof variable === 'string'

  const loadJS = async (src: string, loadAsync: boolean = true): Promise<boolean> => {
    return await new Promise((resolve) => {
      const ref: any = window.document.getElementsByTagName('script')[0]
      const script = window.document.createElement('script')
      script.src = src
      script.async = loadAsync
      script.defer = false

      ref.parentNode.insertBefore(script, ref)
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
    })
  }

  const kFormatter = (num: any, currency?: string) => {
    num = num.toString().replace(/[^0-9.]/g, '')
    if (num < 1000) {
      return num
    }
    const si: any[] = [
      { v: 1e3, s: 'K' },
      { v: 1e6, s: 'M' },
      { v: 1e9, s: 'B' },
      { v: 1e12, s: 'T' },
      { v: 1e15, s: 'P' },
      { v: 1e18, s: 'E' },
    ]
    let index
    for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
        break
      }
    }
    return (
      (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
      si[index].s +
      (currency ? currency : '')
    )
  }

  return {
    getQueryParams,
    isSet,
    isString,
    loadJS,
    kFormatter,
  }
}
