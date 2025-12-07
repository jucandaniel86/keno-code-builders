/* eslint-disable @typescript-eslint/no-explicit-any */
import { APP_STORAGE_ID } from '@/config/app.config'
import { defineStore } from 'pinia'

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
  const settings = localStorage.getItem(APP_STORAGE_ID)

  return settings ? JSON.parse(settings) : getDefaultSettings()
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: getSettings(),
  }),
  actions: {
    updateSettings(partialSettings: any) {
      this.settings = {
        ...this.settings,
        ...partialSettings,
      }
      localStorage.setItem(APP_STORAGE_ID, JSON.stringify(this.settings))
    },
  },
})
