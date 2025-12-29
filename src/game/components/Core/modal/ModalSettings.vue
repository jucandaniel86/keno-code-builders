<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//config
import {
  DEFAULT_TAB,
  LotteryStatusTypes,
  SettingMenuType,
  SETTINGS_MENU,
} from '@/config/app.config'
//components
import Info from '../info/Info.vue'
import History from '../info/history.vue'
import Statistics from '../info/statistics.vue'
import AppIcon from '../../Shared/AppIcon.vue'
//store
import { useGameStore } from '../../../../stores/game'
import useModalStore from '../../../../stores/modal'
//composables
import { useUtils } from '@/core/core.Util'
import Leaders from '../info/leaders.vue'
import SoundManager from '@/core/core.Sounds'
import Settings from '../info/settings.vue'
import { useLotteryStore } from '@/stores/lottery'

const defaultTab = ref<string>(DEFAULT_TAB)
const settings_menu = ref(SETTINGS_MENU.filter((menu) => !menu.disabled))

const handleTabClick = (id: string) => {
  defaultTab.value = id
  SoundManager.Instance().play('CLICK')
}

//composables
const { isSet } = useUtils()
const { closeModal } = useModalStore()
const { analisis } = storeToRefs(useGameStore())
const { lotteryStatus } = storeToRefs(useLotteryStore())

const activeTab = computed(() =>
  settings_menu.value.find((setting) => setting.id === defaultTab.value),
)

watch(lotteryStatus, () => {
  if (lotteryStatus.value === LotteryStatusTypes.DRAW_START) {
    closeModal()
  }
})
</script>
<template>
  <div class="modal-settings">
    <div class="modal-settings-left">
      <h1 v-if="activeTab" class="modal-title">
        <button @click.prevent="closeModal" class="close-btn">
          <AppIcon icon="close" />
        </button>
        {{ activeTab.title }}
      </h1>

      <Info v-if="activeTab && activeTab.id === SettingMenuType.INFO" />
      <History v-if="activeTab && activeTab.id === SettingMenuType.HISTORY" />
      <Statistics
        v-if="activeTab && activeTab.id === SettingMenuType.STATISTICS"
        :draws="analisis.statistics.draws"
      />
      <Leaders
        v-if="activeTab && activeTab.id === SettingMenuType.LEADERS"
        :draws="analisis.statistics.draws"
      />
      <Settings v-if="activeTab && activeTab.id === SettingMenuType.SETTINGS" />
    </div>
    <div class="modal-settings-right">
      <button
        v-for="setting in settings_menu"
        :key="`menu-${setting.id}`"
        class="settings-btn"
        :class="{ selected: defaultTab === setting.id }"
        @click.prevent="handleTabClick(setting.id)"
        :disabled="setting.analisis && !isSet(analisis.statistics.draws)"
      >
        <AppIcon :icon="setting.icon" />
        {{ setting.label }}
      </button>
    </div>
  </div>
</template>
