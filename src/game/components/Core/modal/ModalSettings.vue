<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
//config
import { DEFAULT_TAB, SettingMenuType, SETTINGS_MENU } from '@/config/app.config'
//components
import Info from '../info/Info.vue'
import History from '../info/history.vue'
import Statistics from '../info/statistics.vue'
//store
import { useGameStore } from '../../../../stores/game'
import useModalStore from '../../../../stores/modal'
//composables
import { useUtils } from '@/core/core.Util'
import Leaders from '../info/leaders.vue'

const defaultTab = ref<string>(DEFAULT_TAB)
const settings_menu = ref(SETTINGS_MENU.filter((menu) => !menu.disabled))

const handleTabClick = (id: string) => {
  defaultTab.value = id
}

//composables
const { isSet } = useUtils()
const { closeModal } = useModalStore()
const { analisis } = storeToRefs(useGameStore())

const activeTab = computed(() =>
  settings_menu.value.find((setting) => setting.id === defaultTab.value),
)
</script>
<template>
  <div class="modal-settings">
    <div class="modal-settings-left">
      <button @click.prevent="closeModal" class="close-btn">CLOSE</button>
      <h1 v-if="activeTab" class="modal-title">{{ activeTab.title }}</h1>

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
    </div>
    <div class="modal-settings-right">
      <button
        v-for="setting in settings_menu"
        :key="`menu-${setting.id}`"
        :class="{ selected: defaultTab === setting.id }"
        @click.prevent="handleTabClick(setting.id)"
        style="cursor: pointer"
        :disabled="setting.analisis && !isSet(analisis.statistics.draws)"
      >
        {{ setting.label }}
      </button>
    </div>
  </div>
</template>
