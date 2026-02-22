<script setup lang="ts">
import type { CostEntry } from '~/utils/types/tour';

const emit = defineEmits(['confirmCost', 'cancelCost'])

const newCost = (): CostEntry => ({
  location: '',
  costName: '',
  price: 0
})

const form = ref<CostEntry>(newCost());
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-primary p-6 space-y-4 w-96">
      <div class="item flex flex-col">
        <label for="modalLocation">Location</label>
        <input name="modalLocation" v-model="form.location" placeholder="Location" class="border p-2 w-full" />
      </div>
      <div class="item flex flex-col">
        <label for="modalPriceScu">Name</label>
        <input name="modalPriceScu" v-model="form.costName" placeholder="Name" class="border p-2 w-full" />
      </div>
      <div class="item flex flex-col">
        <label for="modalScuAmount">aUEC</label>
        <input name="modalScuAmount" v-model.number="form.price" placeholder="aUEC" type="number"
          class="border p-2 w-full" />
      </div>

      <div class="flex justify-end gap-2">
        <button class="border px-3" @click="emit('cancelCost')">Cancel</button>
        <button class="border px-3" @click="emit('confirmCost', form)">Confirm</button>
      </div>
    </div>
  </div>
</template>

<style></style>