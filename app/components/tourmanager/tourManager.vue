<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Tour } from '~/utils/types/tour';

useHead({
  title: 'Tourmanager',
})

const tours = ref<Tour[]>([]);
const newTourName = ref('');


const createTour = () => {
  if (!newTourName.value) return
  tours.value.push({
    id: Date.now(),
    show: true,
    name: newTourName.value,
    buys: [],
    sells: [],
    costs: []
  })
  newTourName.value = ''
}

const deleteTour = (id: number) => {
  tours.value = tours.value.filter(t => t.id !== id)
}

watch(tours, () => {
  localStorage.setItem('scTours', JSON.stringify(tours.value))
}, { deep: true })

onMounted(() => {
  const saved = localStorage.getItem('scTours')
  if (saved) {
    tours.value = JSON.parse(saved) as Tour[]
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <div class="flex gap-2">
      <input v-model="newTourName" placeholder="New Tour Name" class="border p-2" @keyup.enter="createTour" />
      <button @click="createTour" class="border px-3">Create Tour</button>
    </div>

    <div v-for="tour in tours.slice().reverse()" :key="tour.id" class="border p-4 space-y-4">
      <Tour :tour="tour"/>
    </div>

  </div>
</template>

<style>
</style>