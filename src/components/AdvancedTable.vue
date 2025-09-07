<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type Row = {
  action: string
  game: string
  emulator: string
  timestamp: string
}

const props = defineProps<{
  rows: Row[]
}>()

const search = ref('')
const actionFilter = ref('')
const emulatorFilter = ref('')
const page = ref(1)
const pageSize = ref(25)
const sortBy = ref<'timestamp'|'game'|'action'|'emulator'>('timestamp')
const sortDir = ref<'asc'|'desc'>('desc')

watch([search, actionFilter, emulatorFilter, pageSize, () => props.rows], () => {
  page.value = 1
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return props.rows.filter(r => {
    if (actionFilter.value && r.action !== actionFilter.value) return false
    if (emulatorFilter.value && r.emulator !== emulatorFilter.value) return false
    if (!q) return true
    return (
      r.game.toLowerCase().includes(q) ||
      r.action.toLowerCase().includes(q) ||
      r.emulator.toLowerCase().includes(q) ||
      r.timestamp.toLowerCase().includes(q)
    )
  })
})

const sorted = computed(() => {
  const arr = [...filtered.value]
  const dir = sortDir.value === 'asc' ? 1 : -1
  arr.sort((a, b) => {
    const s = sortBy.value
    let av: any = a[s]
    let bv: any = b[s]
    if (s === 'timestamp') {
      av = new Date(a.timestamp).getTime()
      bv = new Date(b.timestamp).getTime()
    }
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
  return arr
})

const total = computed(() => sorted.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})

function toggleSort(col: 'timestamp'|'game'|'action'|'emulator') {
  if (sortBy.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = col
    sortDir.value = col === 'timestamp' ? 'desc' : 'asc'
  }
}

const actions = computed(() => Array.from(new Set(props.rows.map(r => r.action))).sort())
const emulators = computed(() => Array.from(new Set(props.rows.map(r => r.emulator))).sort())
</script>

<template>
  <div class="card">
    <div class="controls">
      <input v-model="search" type="text" placeholder="Search..." />
      <select v-model="actionFilter">
        <option value="">All actions</option>
        <option v-for="a in actions" :key="a" :value="a">{{ a }}</option>
      </select>
      <select v-model="emulatorFilter">
        <option value="">All emulators</option>
        <option v-for="e in emulators" :key="e" :value="e">{{ e }}</option>
      </select>
      <span class="small">Showing {{ paged.length }} of {{ total }} items</span>
      <span style="flex:1"></span>
      <label class="small">Page size
        <select v-model.number="pageSize">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </label>
    </div>

    <div style="overflow:auto; max-height: 70vh;">
      <table class="table">
        <thead>
          <tr>
            <th class="th-sort" @click="toggleSort('timestamp')">Timestamp
              <span class="small" v-if="sortBy==='timestamp'">{{ sortDir==='asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="th-sort" @click="toggleSort('action')">Action
              <span class="small" v-if="sortBy==='action'">{{ sortDir==='asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="th-sort" @click="toggleSort('game')">Game
              <span class="small" v-if="sortBy==='game'">{{ sortDir==='asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="th-sort" @click="toggleSort('emulator')">Emulator
              <span class="small" v-if="sortBy==='emulator'">{{ sortDir==='asc' ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paged" :key="r.timestamp + r.game + r.action">
            <td>{{ new Date(r.timestamp).toLocaleString() }}</td>
            <td><span class="badge">{{ r.action }}</span></td>
            <td>{{ r.game }}</td>
            <td>{{ r.emulator }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <div>
        <button :disabled="page===1" @click="page=1">« First</button>
        <button :disabled="page===1" @click="page--">‹ Prev</button>
        <span>Page {{ page }} / {{ totalPages }}</span>
        <button :disabled="page===totalPages" @click="page++">Next ›</button>
        <button :disabled="page===totalPages" @click="page=totalPages">Last »</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
