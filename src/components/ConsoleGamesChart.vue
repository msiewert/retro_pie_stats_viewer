<template>
  <v-card class="mt-4">
    <v-card-title>Games by Console</v-card-title>
    <v-card-text>
      <Bar :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import type { PlayItem } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  items: PlayItem[]
}>()

const chartData = computed(() => {
  const consoleGameCounts = new Map<string, Map<string, number>>()
  
  props.items.forEach(item => {
    if (!consoleGameCounts.has(item.emulator)) {
      consoleGameCounts.set(item.emulator, new Map())
    }
    const gameMap = consoleGameCounts.get(item.emulator)!
    gameMap.set(item.game, (gameMap.get(item.game) || 0) + 1)
  })
  
  const consoles = Array.from(consoleGameCounts.keys()).sort()
  const allGames = new Set<string>()
  consoleGameCounts.forEach(gameMap => {
    gameMap.forEach((_, game) => allGames.add(game))
  })
  
  const colors = ['#4cc3ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
  
  const datasets = Array.from(allGames).slice(0, 8).map((game, index) => ({
    label: game,
    data: consoles.map(console => consoleGameCounts.get(console)?.get(game) || 0),
    backgroundColor: colors[index % colors.length]
  }))
  
  return {
    labels: consoles,
    datasets
  }
})

const chartOptions = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
      ticks: { color: '#a0a0a0' },
      grid: { color: '#2a2f3a' }
    },
    y: {
      stacked: true,
      ticks: { color: '#a0a0a0' },
      grid: { color: '#2a2f3a' }
    }
  },
  plugins: {
    legend: {
      labels: { color: '#e6e6e6' }
    }
  }
}
</script>