import { defineStore } from 'pinia'
import { ref } from 'vue'

interface GameSettingsI {
  MUTE_BG: boolean
  VOLUME_MUSIC: number
  INSTANT_BET: boolean
}

const getDefaultSettings = (): GameSettingsI => ({
  MUTE_BG: false,
  VOLUME_MUSIC: 1,
  INSTANT_BET: false,
})

const getSettings = (): GameSettingsI => {
  return getDefaultSettings()
}

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const MUTE_BG = ref<boolean>(getSettings().MUTE_BG)
    const VOLUME_MUSIC = ref<number>(getSettings().VOLUME_MUSIC)
    const INSTANT_BET = ref<boolean>(getSettings().INSTANT_BET)

    return {
      MUTE_BG,
      VOLUME_MUSIC,
      INSTANT_BET,
    }
  },
  {
    persist: true,
  },
)
