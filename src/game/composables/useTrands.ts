import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'
import { HOT_BALL_ENUM, MAX_TRENDS_LIMIT } from '@/config/app.config'

export const useTrands = () => {
  const { analisis } = storeToRefs(useGameStore())

  const extractValidNumbers = (_result: any) => _result.numbers.map((_number: any) => _number.ball)
  const calculateBalls = (type: HOT_BALL_ENUM, drawedNumbers: any[]): number => {
    switch (type) {
      case HOT_BALL_ENUM.HEADS:
        return drawedNumbers.filter((_no: number) => _no <= 40).length
      case HOT_BALL_ENUM.TAILS:
        return drawedNumbers.filter((_no: number) => _no > 40).length
      default:
        return 0
    }
  }
  const calculateWinningType = (drawedNumbers: any[]) => {
    const tails = calculateBalls(HOT_BALL_ENUM.TAILS, drawedNumbers)
    const heads = calculateBalls(HOT_BALL_ENUM.HEADS, drawedNumbers)

    if (tails > heads) return 'T'
    else if (heads > tails) return 'H'
    else return 'E'
  }

  const getClasses = (_type: string, _index: number) => {
    const _classes = ['keno-trends-item']

    switch (_type) {
      case 'E':
        _classes.push('evens')
        break
      case 'T':
        _classes.push('tails')
        break
      case 'H':
        _classes.push('heads')
        break
    }

    if (_index === 0) _classes.push('first')

    return _classes
  }

  const results = computed(() => {
    const draws = analisis.value.statistics.draws
    const _return: any[] = []
    if (!draws) return _return

    draws.forEach((result: any) => {
      const balls = extractValidNumbers(result)
      _return.push(calculateWinningType(balls))
    })

    return _return.splice(0, MAX_TRENDS_LIMIT)
  })

  return {
    results,
    getClasses,
  }
}
