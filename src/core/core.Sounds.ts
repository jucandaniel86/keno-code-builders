import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import Singleton from './core.Singleton'
import { useUtils } from './core.Util'
import { GAME_SOUNDS } from '@/config/app.config'

export default class SoundManager extends Singleton {
  resources: any = []
  private isLoaded: boolean = false

  private musicVolume: number
  private musicMute: boolean

  protected static _Instance: SoundManager
  protected name = '[SOUNDMANAGER]'

  constructor() {
    super()
    const store = useSettingsStore()
    const { settings } = storeToRefs(store)

    this.musicVolume = settings.value.VOLUME_MUSIC
    this.musicMute = settings.value.MUTE_BG
  }

  public static Instance(): SoundManager {
    if (!this._Instance) {
      this._Instance = new SoundManager()
    }

    return this._Instance
  }

  async load(): Promise<void> {
    return await this.loadItems()
  }

  async loadItems() {
    const _filesToLoad: any[] = []

    GAME_SOUNDS.forEach(async (value: any, key: any) => {
      _filesToLoad.push({
        name: key,
        file: value,
      })
    })

    await Promise.all(
      _filesToLoad.map(async (item: any) => {
        const audio = new Audio('./assets/sounds/' + item.file)

        this.resources[item.name] = {
          sound: audio,
          channel: 'sfx',
        }
      }),
    )
    return this.resources
  }

  setVolume(_strChannel: string, _volume: any) {
    // saves volume in this.sfxVolume and this.musicVolume
    this[(_strChannel + 'Volume') as keyof typeof this] = _volume
    const { isSet } = useUtils()
    for (const res in this.resources) {
      if (isSet(this.resources[res].sound)) {
        const sound = this.resources[res].sound
        const channel = this.resources[res].channel
        if (channel === _strChannel) {
          if (!this[_strChannel as keyof typeof this] + 'Mute') {
            sound.volume = _volume
          }
        }
      }
    }

    this._info('received setVolume channel [' + _strChannel + ']:' + _volume)
  }

  muteChannel(_strChannel: string, _bMute: any) {
    const { isSet } = useUtils()
    for (const res in this.resources) {
      if (isSet(this.resources[res])) {
        const sound = this.resources[res].sound
        const channel = this.resources[res].channel

        if (channel === _strChannel) {
          this[(_strChannel + 'Mute') as keyof typeof this] = _bMute

          if (_bMute) {
            sound.volume = 0
          } else {
            sound.volume = this[(_strChannel + 'Volume') as keyof typeof this]
          }
        }
      }
    }

    this._info('received mute channel [' + _strChannel + ']:' + _bMute)
  }

  play(soundAlias: string, looping: boolean = false) {
    if (soundAlias === '') return

    if (typeof this.resources[soundAlias] === 'undefined') {
      this._warn('sound not found: [' + soundAlias + ']')
      return
    }

    const store = useSettingsStore()
    const { settings } = storeToRefs(store)

    if (settings.value.VOLUME_MUSIC === 0) return

    this.resources[soundAlias].sound.pause()
    this.resources[soundAlias].sound.looping = looping
    this.resources[soundAlias].sound.currentTime = 0
    this.resources[soundAlias].sound.volume = settings.value.VOLUME_MUSIC
    this.resources[soundAlias].sound.play()

    this._info('play sound: [' + soundAlias + ']:')
  }

  stop(soundAlias: string, looping: boolean = false) {
    if (soundAlias === '') return

    if (typeof this.resources[soundAlias] === 'undefined') {
      this._warn('sound not found: [' + soundAlias + ']')
      return
    }

    this.resources[soundAlias].sound.looping = looping
    this.resources[soundAlias].sound.pause()

    this._info('stop sound: [' + soundAlias + ']:')
  }
}

export function SND_PLAY(_sndID: string, _bLooping: boolean = false) {
  if (typeof _sndID === 'undefined' || _sndID === '') return

  SoundManager.Instance().play(_sndID, _bLooping ? _bLooping : false)
}

export function SND_STOP(_sndID: string) {
  SoundManager.Instance().stop(_sndID)
}
