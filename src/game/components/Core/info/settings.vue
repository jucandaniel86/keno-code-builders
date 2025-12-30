<script setup lang="ts">
import CheckedOption from '../../Shared/CheckedOption.vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { watch, ref } from 'vue'
import SlideSelector from '../../SlideSelector.vue'
import LinkIcon from '../../Shared/LinkIcon.vue'
import Proxi from '@/core/core.Proxi'
import { useI18n } from 'vue-i18n'

const { MUTE_BG, VOLUME_MUSIC } = storeToRefs(useSettingsStore())
const volume = ref<number>(VOLUME_MUSIC.value)

const { t } = useI18n()

watch(MUTE_BG, () => {
  if (MUTE_BG.value) {
    VOLUME_MUSIC.value = 0
  } else {
    VOLUME_MUSIC.value = 1
  }
})

watch(volume, (newValue) => {
  VOLUME_MUSIC.value = newValue
})
</script>
<template>
  <div class="settings-component">
    <CheckedOption
      :label="MUTE_BG ? t('components.settings.enableSound') : t('components.settings.mute')"
      v-model="MUTE_BG"
    />
    <SlideSelector
      :label="t('components.settings.musicVol')"
      v-model="VOLUME_MUSIC"
      :disabled="MUTE_BG"
      :min-value="0"
      :max-value="1"
      :step="0.1"
    />
    <LinkIcon
      :label="t('components.settings.lobbyURL')"
      icon="home"
      @onClick="
        () => {
          Proxi.Instance().visitLobby()
        }
      "
    />
    <LinkIcon
      :label="t('components.settings.rules')"
      icon="info"
      @onClick="
        () => {
          console.log('visit rules')
        }
      "
    />

    <LinkIcon
      :label="t('components.settings.history')"
      icon="history"
      @onClick="
        () => {
          console.log('visit rules')
        }
      "
    />
  </div>
</template>
