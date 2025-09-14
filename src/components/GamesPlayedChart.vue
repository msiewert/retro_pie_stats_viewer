<template>
  <v-card class="mt-4">
    <v-card-title>Games Played by Day</v-card-title>
    <v-card-text>
      <Line :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import type { PlayItem } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  items: PlayItem[]
}>()

const chartData = computed(() => {
  const dailyCounts = new Map<string, number>()
  
  props.items.forEach(item => {
    const date = new Date(item.timestamp).toISOString().split('T')[0]
    dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
  })
  
  const sortedDates = Array.from(dailyCounts.keys()).sort()
  const counts = sortedDates.map(date => dailyCounts.get(date)!)
  
  return {
    labels: sortedDates,
    datasets: [{
      label: 'Games Played',
      data: counts,
      borderColor: '#4cc3ff',
      backgroundColor: 'rgba(76, 195, 255, 0.1)',
      tension: 0.1
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