<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
//config
import { KENO_GAME_TABS, KenoGameTabsE, type KenoGameTabsT } from '@/config/app.config'

//@ts-ignore
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

//components
import Loading from '../../Shared/Loading.vue'
import Results from './results/Results.vue'
import Bets from './bets/Bets.vue'
import SoundManager from '@/core/core.Sounds'

type TabsComponentType = {
  tabs?: KenoGameTabsE[]
}

const props = withDefaults(defineProps<TabsComponentType>(), {
  tabs: () => [KenoGameTabsE.DRAWS, KenoGameTabsE.FUTURE],
})

//models
const allowedTabs = props.tabs
const { analisis, analisisLoading } = storeToRefs(useGameStore())
const currentTabs = ref<KenoGameTabsT[]>(
  KENO_GAME_TABS.filter((tab) => allowedTabs.indexOf(tab.id) !== -1),
)
const currentTab = ref<KenoGameTabsT>(currentTabs.value[0] as any)

//composables
const { t } = useI18n()

//methods
const onTabChange = (tab: KenoGameTabsT) => {
  if (tab === currentTab.value) return
  currentTab.value = tab
  SoundManager.Instance().play('CLICK')
}
</script>
<template>
  <div class="tabs-wrapper">
    <div class="tab-menu-container">
      <button
        v-for="tab in currentTabs"
        :key="tab.id"
        class="tab-menu-btn"
        @click.prevent="onTabChange(tab)"
        :class="{
          active: tab.id === currentTab.id,
        }"
        :disabled="analisisLoading"
      >
        {{ t(tab.label) }}
      </button>
    </div>
    <div class="tabs-content">
      <Loading v-if="analisisLoading && currentTab.id === KenoGameTabsE.DRAWS" />
      <Results
        v-if="analisis.statistics.draws && currentTab.id === KenoGameTabsE.DRAWS"
        :results="analisis.statistics.draws"
      />
      <Bets v-if="currentTab.id === KenoGameTabsE.BETS" />
    </div>
  </div>
</template>
