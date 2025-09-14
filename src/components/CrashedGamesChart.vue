<template>
  <v-card class="mt-4">
    <v-card-title>Crashed Games by Console</v-card-title>
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
  const sortedItems = [...props.items].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  const unfinishedByConsole = new Map<string, number>()
  const gameStates = new Map<string, { started: boolean, console: string }>()
  
  sortedItems.forEach(item => {
    const gameKey = `${item.emulator}-${item.game}`
    
    if (item.action === 'start') {
      gameStates.set(gameKey, { started: true, console: item.emulator })
    } else if (item.action === 'stop' || item.action === 'quit') {
      gameStates.delete(gameKey)
    }
  })
  
  gameStates.forEach(({ console }) => {
    unfinishedByConsole.set(console, (unfinishedByConsole.get(console) || 0) + 1)
  })
  
  const consoles = Array.from(unfinishedByConsole.keys()).sort()
  const counts = consoles.map(console => unfinishedByConsole.get(console) || 0)
  
  return {
    labels: consoles,
    datasets: [{
      label: 'Crashed Games',
      data: counts,
      backgroundColor: '#ff6b6b',
      borderColor: '#ff5252',
      borderWidth: 1
    }]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: { color: '#e6e6e6' }
    }
  },
  scales: {
    x: {
      ticks: { color: '#a0a0a0' },
      grid: { color: '#2a2f3a' }
    },
    y: {
      ticks: { color: '#a0a0a0' },
      grid: { color: '#2a2f3a' }
    }
  }
}
</script>