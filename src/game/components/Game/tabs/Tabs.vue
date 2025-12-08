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

//models
const allowedTabs = [KenoGameTabsE.DRAWS, KenoGameTabsE.FUTURE]
const { analisis, analisisLoading } = storeToRefs(useGameStore())
const tabs = ref<KenoGameTabsT[]>(
  KENO_GAME_TABS.filter((tab) => allowedTabs.indexOf(tab.id) !== -1),
)
const currentTab = ref<KenoGameTabsT>(tabs.value[0] as any)

//composables
const { t } = useI18n()

//methods
const onTabChange = (tab: KenoGameTabsT) => (currentTab.value = tab)
</script>
<template>
  <div class="tabs-wrapper">
    <div class="tab-menu-container">
      <button
        v-for="tab in tabs"
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
      <Loading v-if="analisisLoading" />
      <Results v-if="analisis.statistics.draws" :results="analisis.statistics.draws" />
    </div>
  </div>
</template>
