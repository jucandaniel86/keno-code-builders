<script setup lang="ts">
import { ref } from 'vue'
import type { SortLeaderType } from './leaders.vue'

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
            :class="{ active: sortOptions.column === column.column }"
            @click.prevent="setOrder(column.column)"
          >
            <span>{{ column.label }}</span>
            <svg
              v-if="sortOptions.direction === 'ASC' && sortOptions.column === column.column"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.245 20l-11.245-14.374-11.219 14.374-.781-.619 12-15.381 12 15.391-.755.609z"
              />
            </svg>
            <svg v-else width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"
              />
            </svg>
          </a>
        </th>
      </tr>
    </tbody>
  </table>
</template>
