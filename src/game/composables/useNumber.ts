import { MAX_RANDOM_BALL, MIN_RANDOM_BALL } from '@/config/app.config'

export const useNumber = () => {
  const convertToInt = (_number: any, _validation = false) => {
    const o = _number.replace(',', '.').replace(/^0+(?=\d)/, '')
    if ((_validation ? /^-?(\d*\.?\d*)$/ : /^\d*$/).test(o)) {
      if (o === '' || o === '.') return 0
      {
        const p = parseFloat(o)
        if (!isNaN(p)) return _validation ? o : Math.floor(p)
      }
    } else return parseInt(o)
  }

  const generateRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min)

  const generateRandomNumbers = (total: number = 10) => {
    const numbers = []
    while (numbers.length < total) {
      const RandomNumber = generateRandomInt(MIN_RANDOM_BALL, MAX_RANDOM_BALL)
      if (numbers.indexOf(RandomNumber) === -1) {
        numbers.push(RandomNumber)
      }
    }
    return numbers
  }

  return {
    convertToInt,
    generateRandomInt,
    generateRandomNumbers,
  }
}
