<script setup lang="ts">
import CheckedOption from '../../Shared/CheckedOption.vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { watch, ref } from 'vue'
import SlideSelector from '../../SlideSelector.vue'
import LinkIcon from '../../Shared/LinkIcon.vue'
import Proxi from '@/core/core.Proxi'

const { MUTE_BG, VOLUME_MUSIC } = storeToRefs(useSettingsStore())
const volume = ref<number>(VOLUME_MUSIC.value)

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
    <CheckedOption label="Mute Sound" v-model="MUTE_BG" />
    <SlideSelector
      label="Music Volumne"
      v-model="volume"
      :disabled="MUTE_BG"
      :min-value="0"
      :max-value="1"
      :step="0.1"
      @valueChange="
        (val) => {
          VOLUME_MUSIC = val
        }
      "
    />
    <LinkIcon
      label="Lobby URL"
      icon="home"
      @onClick="
        () => {
          Proxi.Instance().visitLobby()
        }
      "
    />
    <LinkIcon
      label="Rules"
      icon="info"
      @onClick="
        () => {
          console.log('visit rules')
        }
      "
    />

    <LinkIcon
      label="History"
      icon="history"
      @onClick="
        () => {
          console.log('visit rules')
        }
      "
    />
  </div>
</template>
