<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  draws: {
    type: Array,
    required: true,
  },
})

//composables
const { t } = useI18n()
//models
const sort = ref<boolean>(false)
const extractAllNumbers = props.draws.flatMap((_el: any) => {
  return _el.numbers.map((_number: any) => _number.ball)
})
//methods
const toggleSort = () => (sort.value = !sort.value)
//methods
const sortResults = (statistics: any) => {
  function compare(a: any, b: any) {
    if (a.count > b.count) {
      return -1
    }
    if (a.count < b.count) {
      return 1
    }
    return 0
  }

  return Object.values(statistics).sort(compare)
}

//computed
const statistics = computed((): any => {
  const count: any = {}

  extractAllNumbers.forEach((element: number) => {
    count[element] = (count[element] || 0) + 1
  })
  const _return = Object.entries(count).map((_el: any) => ({
    number: _el[0],
    count: _el[1],
    percentage: ((_el[1] / 20) * 100).toFixed(2),
  }))

  return sort.value ? sortResults(_return) : _return
})
</script>
<template>
  <div class="keno-statistics-container">
    <div class="keno-statistics-header">
      <div class="keno-statistics-header-item">
        {{ t('statistics.lastRounds') }}
      </div>
      <div cllass="keno-statistics-header-item">
        <button @click.prevent="toggleSort">
          {{ t('statistics.sort') }}
          <span className="sortIcon">
            {{ sort ? 'active' : 'disabled' }}
          </span>
        </button>
      </div>
    </div>
    <div className="keno-statistics-body">
      <div
        v-for="statistic in statistics"
        :key="`Statistic${statistic.number}`"
        class="keno-statistics-row"
      >
        <div className="keno-statistics-ball">{{ statistic.number }}</div>
        <div className="keno-statistics-percentage">{{ statistic.percentage }}%</div>
        <div className="keno-statistics-line-container">
          <div
            className="keno-statistics-line"
            :style="{ width: `${statistic.percentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
