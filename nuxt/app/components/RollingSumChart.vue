<template>
  <div class="chart-wrapper">
    <Line :data="chartDataConfig" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip 
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

const props = defineProps<{
  data: Array<{ date: string, rollingSum: number }>
  config: { limit: number, max: number }
}>()

const chartDataConfig = computed(() => {
  if (!props.data || !props.config) return { labels: [], datasets: [] }

  const labels = props.data.map(d => {
    const date = new Date(d.date)
    return `${date.getUTCDate()} ${date.toLocaleString('default', { month: 'short', timeZone: 'UTC' })}`
  })
  
  const values = props.data.map(d => d.rollingSum)
  const limitValues = props.data.map(() => props.config.limit)

  return {
    labels,
    datasets: [
      {
        label: 'Rolling Sum',
        data: values,
        borderColor: '#22C5E8',
        backgroundColor: '#22C5E8',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.1
      },
      {
        label: 'Limit',
        data: limitValues,
        borderColor: '#E63757',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: props.config?.max || 100,
      grid: { color: '#F5F6F8' },
      border: { display: false }
    },
    x: {
      grid: { display: false },
      ticks: {
        maxTicksLimit: 7
      }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#0E2138',
      titleFont: { family: 'Plus Jakarta Sans', size: 13 },
      bodyFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' }
    }
  }
}))
</script>

<style scoped>
.chart-wrapper {
  height: 220px;
  width: 100%;
  position: relative;
}
</style>