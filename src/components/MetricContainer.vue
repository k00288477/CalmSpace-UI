<script setup>
import {computed} from "vue";

const props = defineProps({
  metric: {
    type: Number,
    default: 0
  },
  label: {
    type: String
  },
  type : {
    type: String
  }
})

const thresholds = {
  temperature: { green: [17, 26], yellow: [14, 29] },
  humidity:    { green: [30, 60], yellow: [10, 80] },
  noise:       { green: [0, 50],  yellow: [50, 70] }
}

const borderColour = computed(() => {
  if (props.metric === null) return 'border-gray-400'
  const t = thresholds[props.type]
  if (!t) return 'border-gray-400'

  const v = props.metric
  if (v >= t.green[0] && v <= t.green[1]) return 'border-green-400'
  if (v >= t.yellow[0] && v <= t.yellow[1]) return 'border-yellow-400'
  return 'border-red-400'
})

</script>

<template>

  <div :class="['flex flex-col items-center justify-center border-4 w-[10em] h-[10em] rounded-full', borderColour]">
    <p class="text-6xl">{{ metric ?? '-' }}</p>
    <p>{{ label }}</p>
  </div>
</template>

<style scoped>

</style>