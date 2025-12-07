import { MAX_RANDOM_BALL } from '@/config/app.config'
import SoundManager from '@/core/core.Sounds'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

export const useAutopick = () => {
  const { setSelectedNumbers } = useGameStore()

  const generateRandomNumber = () => {
    const { selectedNumbers } = storeToRefs(useGameStore())
    const newNumber = Math.floor(Math.random() * MAX_RANDOM_BALL)
    if (selectedNumbers.value.indexOf(newNumber) !== -1) {
      return generateRandomNumber()
    }
    return newNumber
  }

  const generateNumbers = async (totalNumbers: number) => {
    return new Promise((resolve) => {
      const { selectedNumbers } = storeToRefs(useGameStore())

      if (totalNumbers < selectedNumbers.value.length) {
        setSelectedNumbers([])
      }

      const NumbersToGenerate =
        selectedNumbers.value.length === totalNumbers
          ? totalNumbers
          : totalNumbers - selectedNumbers.value.length

      let d = 0
      const h = () => {
        setTimeout(
          () => {
            const newNumber = generateRandomNumber()

            setSelectedNumbers([...selectedNumbers.value, newNumber])

            d++
            SoundManager.Instance().play('CLICK')
            if (d >= NumbersToGenerate) {
              //ended
              return resolve(true)
            }
            h()
          },
          d === 0 ? 0 : 150,
        )
      }
      h()
    })
  }

  return {
    generateNumbers,
  }
}
