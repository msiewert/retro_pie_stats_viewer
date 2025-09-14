<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchAllPages, type PlayItem } from './services/api'
import VuetifyTable from './components/VuetifyTable.vue'
import GamesPlayedChart from './components/GamesPlayedChart.vue'
import ConsoleGamesChart from './components/ConsoleGamesChart.vue'
import CrashedGamesChart from './components/CrashedGamesChart.vue'

const loading = ref(false)
const error = ref<string | null>(null)
const rows = ref<PlayItem[]>([])

async function load() {
  loading.value = true
  error.value = null
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    const data = await fetchAllPages(controller.signal)
    clearTimeout(timeout)
    // Normalize: ensure fields exist and sort desc by timestamp initially
    rows.value = data
  } catch (e: any) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Retro Game Plays</h1>
      <div class="small">Data source: AWS Lambda</div>
    </div>

    <div v-if="loading" class="card">Loading game plays…</div>
    <div v-else-if="error" class="card" style="border-color:#a33;">Error: {{ error }} <button @click="load">Retry</button></div>
    <template v-else>
      <VuetifyTable :items="rows" />
      <GamesPlayedChart :items="rows" />
      <ConsoleGamesChart :items="rows" />
      <CrashedGamesChart :items="rows" />
    </template>
  </div>
</template>

<style scoped>
</style>
