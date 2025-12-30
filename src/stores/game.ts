import { ref } from 'vue'
import { defineStore } from 'pinia'
import { GAME_NAME, GAME_TYPES_ENUM } from '@/config/app.config'
import p from '../../package.json'
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

  const history = ref<any>()
  const draws = ref<DrawTypeType[]>()

  const gameType = ref<GAME_TYPES_ENUM>(GAME_TYPES_ENUM.CLASSIC)

  const resultsHistory = ref<PastResultType[]>([])

  const sidebarDisabled = ref<boolean>(false)

  const analisis = ref<AnalisisType>({ hot: [], cold: [], statistics: {} })

  const analisisLoading = ref<boolean>(false)

  const randomSelectionLoading = ref<boolean>(false)

  const results = ref<number[]>([])

  const nextDraws = ref<number>(1)

  const setGamePlay = (_payload: any) => {
    game.value = {
      ...game.value,
      ..._payload,
    }
  }

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

  const setGameType = (_payload: GAME_TYPES_ENUM) => {
    gameType.value = _payload
  }

  const setResults = (_results: number[]) => {
    results.value = _results
  }

  const disableSidebar = (_payload: boolean) => (sidebarDisabled.value = _payload)

  const setRandomSelectionLoading = (_payload: boolean) => {
    randomSelectionLoading.value = _payload
  }

  const setNextDraws = (subscriptions: number) => {
    nextDraws.value = subscriptions
  }

  return {
    game,
    history,
    draws,
    selectedNumbers,
    disableInteraction,
    gameType,
    results,
    resultsHistory,
    sidebarDisabled,
    analisis,
    analisisLoading,
    randomSelectionLoading,
    nextDraws,
    setRandomSelectionLoading,
    disableSidebar,
    setGamePlay,
    setHistory,
    setDraws,
    setSelectedNumbers,
    setDisabledInteraction,
    setGameType,
    setResults,
    setAnalisys,
    setNextDraws,
  }
})
