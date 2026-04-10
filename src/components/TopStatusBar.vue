<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import DatabaseService from "@/data/db-service.js";

const isAboutHidden = ref(true)
const monitorStatus = ref("Offline")
let unsubscribe = null
let statusTimer = null
const latestRecord = ref(null)
const OFFLINE_THRESHOLD_SECONDS = 5

function toggleAbout(){
  isAboutHidden.value = !isAboutHidden.value
}


onMounted(()=>{
  unsubscribe = DatabaseService.getLatest((record) => {
    if(record?.timestamp) {
      const lastUpdate = new Date(record.timestamp).getTime()
      const now = Date.now()
      const secondsAgo = (now - lastUpdate) / 1000
      monitorStatus.value = secondsAgo < OFFLINE_THRESHOLD_SECONDS ? "Online" : "Offline"
    }
  })

  statusTimer = setInterval(() => {
    if (latestRecord.value?.timestamp) {
      const secondsAgo = (Date.now() - latest.value.timestamp) / 1000
      monitorStatus.value = secondsAgo < OFFLINE_THRESHOLD_SECONDS ? "Online" : "Offline"
    }
  }, 1000)
})

onUnmounted(()=>{
  if(unsubscribe) unsubscribe()
  if (statusTimer) clearInterval(statusTimer)
})
</script>

<template>
  <div class="flex flex-row w-full justify-between items-center pr-4 bg-[#404040]">
<!--    logo-->
    <div class="flex-1 flex justify-start">
    <img src="/logo.png" alt="CalmSpace Logo" class="h-[4em]">
    </div>
<!--    status-->
    <div class="flex-1 flex justify-center">
      <p class="text-[#B2ADAD]">Monitor Status:
        <span :class="monitorStatus === 'Online' ? 'text-green-400' : 'text-red-400'">{{ monitorStatus }}</span></p>
    </div>

<!--    buttons-->
    <button
        class="flex-1 flex justify-end"
        @click="toggleAbout"
    >
      <svg width="32px" height="32px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#c0c0c0">
        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="SVGRepo_iconCarrier"> <title>about</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="about-white" fill="#c0c0c0" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51168 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.154987,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51168 331.154987,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.44,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.44,384 213.333333,384 Z M240.04672,128 C240.04672,143.46752 228.785067,154.666667 213.55008,154.666667 C197.698773,154.666667 186.713387,143.46752 186.713387,127.704107 C186.713387,112.5536 197.99616,101.333333 213.55008,101.333333 C228.785067,101.333333 240.04672,112.5536 240.04672,128 Z M192.04672,192 L234.713387,192 L234.713387,320 L192.04672,320 L192.04672,192 Z" id="Shape"> </path> </g> </g> </g>
      </svg>
    </button>
  </div>

  <div
      v-if="!isAboutHidden"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      @click.stop="toggleAbout"
  >
  <div

      class="flex flex-col gap-4 w-[80%] h-[60%] items-center z-99 justify-center m-auto px-10 bg-[#F9F3EE]"
  >

    <h1 class="text-3xl">About CalmSpace</h1>

    <p>CalmSpace is an IoT application
      capable of monitoring interior environments and
      keeping track of environment metrics to ensure
      they stay within recommended parameters that
      help to reduce the risk of sensory overload in
      Neurodivergent individuals, including those with
      Autism Spectrum Disorder (ASD) and ADHD.</p>

    <p>This project was designed and built as part of the module: Technology Futures.</p>

    <div class="flex flex-col gap-1 items-center w-full justify-start">
    <p>Metric Thresholds</p>
    <p>Humidity (%RH) = Between 40 and 60 %RH</p>
    <p>Noise (DB) = Must be below 50 decibels</p>
    <p>Temperature (°C) = Between 17 and 26</p>
    </div>

    <p>Student: Gary O'Connor, K00288477</p>

<!--    some links here -->
    <p><a href="https://github.com/k00288477/CalmSpace"
      class="hover:underline hover:text-blue-500"
    >Github Repository</a></p>

    <button @click="toggleAbout" class="px-4 py-2 bg-[#404040] text-white rounded hover:cursor-pointer hover:scale-105 hover:opacity-75">Close</button>
  </div>
  </div>
</template>

<style scoped>

</style>