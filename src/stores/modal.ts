import { defineStore } from 'pinia'

import InfoModalWindow from '@/game/components/Core/modal/InfoModalWindow.vue'
import SettingsModal from '@/game/components/Core/modal/ModalSettings.vue'

// eslint-disable-next-line vue/prefer-import-from-vue
import { extend } from '@vue/shared'
import { markRaw, ref } from 'vue'
import SoundManager from '@/core/core.Sounds'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const component = extend({})
type VueComponent = InstanceType<typeof component>

export interface IModalProps {
  component: null | VueComponent
  props?: IModalPropsSettings
}

export interface IModalState {
  modalState: IModalProps
}

export interface IModalPropsSettings {
  title?: string
  content: string
  buttons?: any[]
  results?: any
}

const basicState = { component: null, props: { title: '', content: '' } }

export default defineStore('modal', () => {
  const state = markRaw<IModalState>({ modalState: basicState })
  const open = ref<boolean>(false)

  const openModal = (payload: IModalProps) => {
    // Get props and component from payload passed to function
    const { props, component } = payload as any

    // Get the body element
    const body = document.body

    // If its there, prevent scroll from happening
    if (body) body.style.overflow = 'hidden'

    // Assign them to our state
    state.modalState = { component, props: props || {} }
    open.value = true
  }

  const closeModal = () => {
    // Reset our state
    state.modalState = basicState
    open.value = false

    // Get the body element
    const body = document.body

    //play close sound
    SoundManager.Instance().play('CLICK')

    // If its there, reset overflow style
    if (body) body.style.overflow = 'auto'
  }

  const openInfoModal = (settings: IModalPropsSettings) => {
    openModal({ component: InfoModalWindow, props: settings })
  }

  const openSettingsModal = (settings: IModalPropsSettings) => {
    openModal({ component: SettingsModal, props: settings })
  }

  const openGameInfoModal = (settings: IModalPropsSettings) => {
    openModal({ component: InfoModalWindow, props: settings })
  }

  return {
    state,
    open,
    openModal,
    closeModal,
    openInfoModal,
    openGameInfoModal,
    openSettingsModal,
  }
})
