<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import DatabaseService from "@/data/db-service.js"

const latest = ref(null)
const dataRows = ref([])
let unsubscribe = null
let stopPolling = null

onMounted(() => {
  unsubscribe = DatabaseService.getLatest((record) => {
    latest.value = record
  })
  stopPolling = DatabaseService.pollAll((rows) => {
    dataRows.value = rows
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  if (stopPolling) stopPolling()
})
</script>

<template>
<h1>Your did it!</h1>

<h2>Readings</h2>

<table>
<thead>
<tr>
<td>Humidity</td>
<td>Noise</td>
<td>Temperature</td>
<td>Timestamp</td>
</tr>
</thead>

<tbody>
<tr>
<!--    v-for="(row, index) in data" :key="index"-->
  <td>{{ latest?.humidity }}</td>
  <td>{{ latest?.noise }}</td>
  <td>{{ latest?.temperature }}</td>
  <td>{{ latest?.timestamp }}</td>
  <td></td>
</tr>
</tbody>
</table>

  <table>
    <thead>
    <tr>
      <td>Humidity</td>
      <td>Noise</td>
      <td>Temperature</td>
      <td>Timestamp</td>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(row, index) in dataRows" :key="index">
      <td>{{ row.humidity }}</td>
      <td>{{ row.noise }}</td>
      <td>{{ row.temperature }}</td>
      <td>{{ row.timestamp }}</td>
    </tr>
    </tbody>
  </table>

</template>

<style scoped>
</style>