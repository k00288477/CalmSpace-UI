<script setup>
import {ref, onMounted, onUnmounted, computed} from "vue"
import DatabaseService from "@/data/db-service.js"
import MetricContainer from "@/components/MetricContainer.vue";

const latest = ref(null)
const dataRows = ref([])
let unsubscribe = null
let stopPolling = null

const thresholds = {
  temperature: { green: [17, 26], yellow: [14, 29] },
  humidity:    { green: [30, 60], yellow: [10, 80] },
  noise:       { green: [0, 50],  yellow: [50, 70] }
}

function getColour(type, value) {
  if (value === null || value === undefined) return 'bg-gray-300'
  const t = thresholds[type]
  if (!t) return 'bg-gray-300'
  if (value >= t.green[0] && value <= t.green[1]) return 'bg-green-300'
  if (value >= t.yellow[0] && value <= t.yellow[1]) return 'bg-yellow-300'
  return 'bg-red-300'
}

function formatTime(unix) {
  return new Date(unix).toLocaleTimeString('en-IE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}


const containerColour = computed(() => {
  if (!latest.value) return 'border-[#404040]'

  const checks = [
    { type: 'humidity', value: latest.value.humidity },
    { type: 'noise', value: latest.value.noise },
    { type: 'temperature', value: latest.value.temperature }
  ]

  const outOfGreen = checks.filter(({ type, value }) => {
    const t = thresholds[type]
    return value < t.green[0] || value > t.green[1]
  }).length

  if (outOfGreen === 0) return 'border-[#404040]'
  if (outOfGreen === 1) return 'border-yellow-600'
  return 'border-red-700'
})

function isToday(unix) {
  const date = new Date(unix)
  const today = new Date()
  return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
}

onMounted(() => {
  unsubscribe = DatabaseService.getLatest((record) => {
    latest.value = record
  })
  stopPolling = DatabaseService.subscribeAll((rows) => {
    dataRows.value = rows
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  if (stopPolling) stopPolling()
})
</script>

<template>
  <h2 class="w-[75%] m-auto text-2xl font-semibold mt-3">Current Readings</h2>
  <div :class="['flex flex-row w-[75%] items-center mt-1 mb-5 m-auto justify-between pt-10 pb-10 px-10 rounded-4xl bg-[#404040] text-[#E0DFDD] border-4', containerColour]">
    <div class="flex-1 flex flex-col items-center justify-center">
    <MetricContainer :metric="latest?.humidity" label="Humidity (%RH)" type="humidity"/>
      <span>Target: 40%RH - 60%RH</span>
  </div>
  <div class="flex-1 flex flex-col items-center justify-center">
    <MetricContainer :metric="latest?.noise" label="Noise (DB)" type="noise"/>
    <span>Target: < 50db</span>
  </div>
  <div class="flex-1 flex flex-col items-center justify-center">
    <MetricContainer :metric="latest?.temperature" label="Temperature (°C)" type="temperature"/>
    <span>Target: 17°C - 26°C</span>
  </div>
</div>

  <div class="w-[75%] h-[50em] overflow-scroll m-auto my-5">
    <h2 class="text-2xl font-semibold mb-3">Readings Log (Past Hour)</h2>
    <table class="w-full border-collapse">
      <thead>
      <tr class="bg-[#404040] text-[#E0DFDD]">
        <th class="py-3 px-4 text-left">Humidity (%RH)</th>
        <th class="py-3 px-4 text-left">Noise (DB)</th>
        <th class="py-3 px-4 text-left">Temperature (°C)</th>
        <th class="py-3 px-4 text-left">Timestamp</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in dataRows.filter(r => isToday(r.timestamp))" :key="index" class="border-b border-black-200">
        <td :class="['py-3 px-4', getColour('humidity', row.humidity)]">{{ row.humidity }}</td>
        <td :class="['py-3 px-4', getColour('noise', row.noise)]">{{ row.noise }}</td>
        <td :class="['py-3 px-4', getColour('temperature', row.temperature)]">{{ row.temperature }}</td>
        <td class="py-3 px-4 bg-[#404040] text-[#E0DFDD]">{{ formatTime(row.timestamp) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
span {
  color: darkgrey;
}
</style>