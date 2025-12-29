import { ScreenEnum } from '@/core/enums/Screens'

//Tabs Configuration
export enum TabsEnum {
  RULES = 'rules',
  PAYTABLES = 'paytables',
  RESULTS = 'results',
  DRAW = 'draw',
}

export const GAME_NAME = 'KENO'
export const APP_STORAGE_ID = GAME_NAME.split(' ').join('_') + '_store'
export const GAME_ID = 4025
export const MOBILE_RESOLUTION = 700

//Game Configuration
export const MIN_RANDOM_BALL = 1
export const MAX_RANDOM_BALL = 80
export const MAX_SELECTED_NUMBERS = 10
export const MIN_SELECTED_NUMBERS = 2
export const MAX_DAWED_BALLS = 20

export const AUTOPLAY_MAX_NO_BETS = 100
export const PAST_RESULTS_LIMIT = 6
export const PAST_RESULTS_MOBILE_LIMIT = 3

export const DEFAULT_COLOR = 'blue'

export const DEFAULT_TICKET_COST = 0.5
export const DEFAULT_SCREEN: ScreenEnum = ScreenEnum.LOADING

//Services configuration
export const GAME_USE_HISTORY = false
export const GAME_USE_DRAWS = false
export const GAME_USE_ANALISYS = true

//SOUNDS CONFIG
export const GAME_SOUNDS = new Map<string, string>()
GAME_SOUNDS.set('BALL_MISS', 'small-short-deep-whoosh.mp3')
GAME_SOUNDS.set('BALL_MATCH', 'fast-deep-cinematic-whoosh-swo.mp3')
GAME_SOUNDS.set('CLICK', 'click.mp3')
GAME_SOUNDS.set('CANT_BET', 'cant_bet.mp3')
GAME_SOUNDS.set('PLACE_BET', 'play_click.mp3')
GAME_SOUNDS.set('REVEALED', 'revealed.mp3')

//WEBSOCKET CONFIG
export const WS_RECONNECT = false
export const DEFAULT_SOCKET_ENDPOINT = 'dev.igameforge.com'
export const DEFAULT_SOCKET_SERVER_PATH = 'marlipin/websocket'
export const HEARTBEAT_INTERVAL = 20

export const GAME_USE_PROXY = false

export const AUTOCLOSE_RESULTS_MODAL = 3 //seconds
export const WEEKLY_PRIZE = 250000

export const CLOSE_BETS_SEC = 9
export const EXTRACTING_SEC = 9

export const GAME_RATIO = 16 / 8
export const GAME_MOBILE_RATIO = 16 / 9

export const ALLOWED_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 40]
export const BETTING_OPEN_SECONDS = 5
export const BETTING_WARNING_SECONDS = 10

//info modal tabs
export enum SettingMenuType {
  INFO = 'info',
  HISTORY = 'history',
  STATISTICS = 'statistics',
  LEADERS = 'leaders',
  SETTINGS = 'settings',
}

type InfoModalTab = {
  id: SettingMenuType
  label: string
  title: string
  analisis: boolean
  disabled: boolean
  icon: string
}

export const SETTINGS_MENU: InfoModalTab[] = [
  {
    id: SettingMenuType.INFO,
    label: 'How to Play',
    title: 'HOW TO PLAY',
    analisis: false,
    disabled: false,
    icon: 'info',
  },
  {
    id: SettingMenuType.HISTORY,
    label: 'History',
    title: 'HISTORY',
    analisis: false,
    disabled: false,
    icon: 'history',
  },
  {
    id: SettingMenuType.STATISTICS,
    label: 'Statistics',
    title: 'STATISTICS',
    analisis: true,
    disabled: false,
    icon: 'graph',
  },
  {
    id: SettingMenuType.LEADERS,
    label: 'Leaders',
    title: 'LEADERS',
    analisis: false,
    disabled: false,
    icon: 'graph-2',
  },
  {
    id: SettingMenuType.SETTINGS,
    label: 'Settings',
    title: 'SETTINGS',
    analisis: false,
    disabled: false,
    icon: 'settings',
  },
]

export const DEFAULT_TAB = 'info'

export enum KenoGameTabsE {
  BETS = 'BETS',
  FUTURE = 'FUTURE',
  DRAWS = 'DRAWS',
}

export type KenoGameTabsT = {
  id: KenoGameTabsE
  label: string
  active: boolean
}

export const KENO_GAME_TABS: KenoGameTabsT[] = [
  {
    id: KenoGameTabsE.BETS,
    label: 'tabs.bets',
    active: true,
  },
  {
    id: KenoGameTabsE.FUTURE,
    label: 'tabs.future',
    active: true,
  },
  {
    id: KenoGameTabsE.DRAWS,
    label: 'tabs.draws',
    active: true,
  },
]

export enum GAME_TYPES_ENUM {
  CLASSIC = 'CLASSIC',
  JACKPOT = 'JACKPOT',
  BONUS = 'BONUS',
  HOT = 'HEADSORTAILS',
}

export const MAX_SUBSCRIPTIONS = 50

export const GAME_TYPES = [
  {
    id: 'classic',
    label: 'Classic',
    value: GAME_TYPES_ENUM.CLASSIC,
    type: 1,
    alias: 'Classic',
  },
  {
    id: 'jackpot',
    label: 'Jackpot',
    value: GAME_TYPES_ENUM.JACKPOT,
    type: 2,
    alias: 'Jackpot',
  },
  {
    id: 'bonus',
    label: 'Bonus',
    value: GAME_TYPES_ENUM.BONUS,
    type: 3,
    alias: 'Bonus',
  },
  {
    id: 'hot',
    label: 'Heads or Tails',
    value: GAME_TYPES_ENUM.HOT,
    type: 4,
    alias: 'HOT',
  },
]

export enum HOT_BALL_ENUM {
  TAILS = 'TAILS',
  HEADS = 'HEADS',
  EVENS = 'EVENS',
}

export type HotBallType = {
  type: HOT_BALL_ENUM
  class: string
  label: string
  value: 'E' | 'T' | 'H'
}

export const HOT_SELECTION_TYPES: HotBallType[] = [
  {
    type: HOT_BALL_ENUM.HEADS,
    label: 'Heads',
    class: 'heads',
    value: 'H',
  },
  {
    type: HOT_BALL_ENUM.TAILS,
    label: 'Tails',
    class: 'tails',
    value: 'T',
  },
  {
    type: HOT_BALL_ENUM.EVENS,
    label: 'Evens',
    class: 'evens',
    value: 'E',
  },
]

export const MAX_TRENDS_LIMIT = 8
export const DEFAULT_NUMBERS_LIMIT = 10

//Lottery Status
export enum LotteryStatusTypes {
  UNKNOW = 'UNKNOW',
  BETTING_OPEN = 'BETTING_OPEN',
  BETTING_CLOSE = 'BETTING_CLOSE',
  DRAW_START = 'DRAW_START',
  DRAW_ENDS = 'DRAW_ENDS',
  DISPLAY_RESULTS = 'DISPLAY_RESULTS',
}
