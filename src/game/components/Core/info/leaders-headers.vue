<script setup lang="ts">
import { ref } from 'vue'
import type { SortLeaderType } from './leaders.vue'
import AppIcon from '../../Shared/AppIcon.vue'

//types
type LeadersHeadersColumn = {
  column: string
  label: string
  width?: number
}
type LeadersHeadersType = {
  columns: LeadersHeadersColumn[]
  defaultSortingColumn: string
}

//props
const props = defineProps<LeadersHeadersType>()

//models
const sortOptions = ref<SortLeaderType>({
  column: 'displayName',
  direction: 'ASC',
})

//emitters
const emitters = defineEmits(['onSort'])

//methods
const setOrder = (_column: string) => {
  const column = sortOptions.value.column
  let direction = sortOptions.value.direction

  if (column !== _column) {
    direction = 'DESC'
  }
  if (column !== _column) {
    direction = 'DESC'
  }

  sortOptions.value = {
    column: _column,
    direction: direction === 'ASC' ? 'DESC' : 'ASC',
  }

  emitters('onSort', sortOptions.value)
}
</script>
<template>
  <table v-if="props.columns" width="100%">
    <tbody>
      <tr>
        <th
          v-for="(column, index) in props.columns"
          :key="`Column${index}`"
          :style="{
            width: column.width ? `${column.width}%` : 'auto',
          }"
        >
          <a
            href="#"
            class="winner-sort-btn"
            :class="{
              active: sortOptions.column === column.column,
              up: sortOptions.direction === 'ASC' && sortOptions.column === column.column,
              down: sortOptions.direction !== 'ASC' && sortOptions.column === column.column,
            }"
            @click.prevent="setOrder(column.column)"
          >
            <span>{{ column.label }}</span>
            <AppIcon icon="arrow" />
          </a>
        </th>
      </tr>
    </tbody>
  </table>
</template>
