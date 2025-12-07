import { ref } from 'vue'
import { defineStore } from 'pinia'
import { GAME_NAME } from '@/config/app.config'
import p from '../../package.json'
import type { PrizeData } from '@/core/models/setup/SetupResponseData'
// import SoundManager from '@/core/core.Sounds'
// import { useSettingsStore } from './settings'
// import { useTicketHistory } from '@/composables/useTicketHistory'

export enum GameStates {
  BETTING = 'betting',
  EXTRACTING = 'extracting',
  CLOSED = 'betting-closed',
}

export type TicketType = {
  bet: number
  totalWin?: number
  numbers: number[]
  drawId?: number | string
  ticket?: string | number
  drawTS?: number
  id?: string | number
  matched?: number[]
}

export type AnalisisType = {
  hot: number[]
  cold: number[]
  statistics: any
}

interface GameStoreData {
  version?: string
  name?: string
  state: GameStates
  tickets: TicketType[]
  totalWin: number
  extractedNumbers: number[]
}

export type DrawTypeType = {
  timestamp: number
  extracted: number[]
  prizes: any[]
}

export enum GameModeType {
  MANUAL = 'manual',
  AUTO = 'auto',
}

export type GameResultsType = {
  win: number
  numbers: number[]
  bet: number
}

export type PastResultType = {
  id: string
  win: number
  extractedNumbers: number[]
  selectedNumbers: number[]
  bet: number
  multiplier: number
  date: string
}

export const useGameStore = defineStore('game', () => {
  const game = ref<GameStoreData>({
    version: p.version,
    name: GAME_NAME,
    state: GameStates.BETTING,
    tickets: [],
    totalWin: 0,
    extractedNumbers: [],
  })

  const selectedNumbers = ref<number[]>([])

  const disableInteraction = ref<boolean>(false)

  const gameMode = ref<GameModeType>(GameModeType.MANUAL)

  const history = ref<any>()
  const draws = ref<DrawTypeType[]>()

  const displayResults = ref<boolean>(false)

  const results = ref<GameResultsType>()

  const resultsHistory = ref<PastResultType[]>([])

  const sidebarDisabled = ref<boolean>(false)

  const winningNumbers = ref<number[]>([])

  const prizes = ref<PrizeData[]>([])

  const analisis = ref<AnalisisType>({ hot: [], cold: [], statistics: {} })

  const analisisLoading = ref<boolean>(false)

  const timer = ref<number>(0)

  const setGamePlay = (_payload: any) => {
    game.value = {
      ...game.value,
      ..._payload,
    }
  }

  const setTimer = (sec: number) => (timer.value = sec)

  const setDisplayResults = (_payload: boolean) => (displayResults.value = _payload)

  const setResults = (_payload: any) => (results.value = _payload)

  const setHistory = (_payload: any) => (history.value = _payload)

  const setAnalisys = (_payload: any) => (analisis.value = _payload)

  const setDraws = (_payload: any) => {
    draws.value = _payload
  }

  const setSelectedNumbers = (_payload: any) => {
    selectedNumbers.value = _payload
  }

  const setDisabledInteraction = (_payload: boolean) => {
    disableInteraction.value = _payload
  }

  const setGameType = (_payload: GameModeType) => {
    gameMode.value = _payload
  }

  const setResultsHistory = (_result: PastResultType) => {
    resultsHistory.value.push(_result)
  }

  const disableSidebar = (_payload: boolean) => (sidebarDisabled.value = _payload)

  const clearWinningNumbers = () => {
    winningNumbers.value = []
  }

  const setWinningNumbers = async (_numbers: number[]): Promise<void> => {
    console.log(_numbers)
    // const { settings } = storeToRefs(useSettingsStore())
    // const { calcMultiplier } = useTicketHistory()

    // if (settings.value.INSTANT_BET) {
    //   winningNumbers.value = _numbers
    //   setMultipler(calcMultiplier(_numbers, selectedNumbers.value))
    //   return Promise.resolve()
    // }

    // return new Promise((resolve) => {
    //   const numbers = [..._numbers]
    //   let i = 0

    //   const h = () => {
    //     setTimeout(
    //       () => {
    //         SoundManager.Instance().play('REVEALED')
    //         winningNumbers.value.push(numbers[i])
    //         setMultipler(calcMultiplier(winningNumbers.value, selectedNumbers.value))
    //         i++
    //         if (numbers.length === i) {
    //           resolve()
    //           return
    //         }
    //         h()
    //       },
    //       i === 0 ? 0 : 150,
    //     )
    //   }

    //   h()
    // })
  }

  const setPrizes = (_prizes: PrizeData[]) => {
    prizes.value = _prizes
  }

  return {
    game,
    history,
    draws,
    selectedNumbers,
    disableInteraction,
    gameMode,
    displayResults,
    results,
    resultsHistory,
    sidebarDisabled,
    winningNumbers,
    prizes,
    analisis,
    timer,
    analisisLoading,
    disableSidebar,
    setGamePlay,
    setHistory,
    setDraws,
    setSelectedNumbers,
    setDisabledInteraction,
    setGameType,
    setDisplayResults,
    setResults,
    setResultsHistory,
    setWinningNumbers,
    clearWinningNumbers,
    setPrizes,
    setAnalisys,
    setTimer,
  }
})
