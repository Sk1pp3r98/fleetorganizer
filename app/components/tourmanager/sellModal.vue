<script setup lang="ts">
import type { TradeEntry } from '~/utils/types/tour';

const props = defineProps<{
  commodity?: string,
  amount?: number
}>()

const emit = defineEmits(['confirmSell', 'cancelSell'])

const newSell = (): TradeEntry => ({
  location: '',
  commodity: props.commodity ?? '',
  amount: props.amount ?? 0,
  price: 0
})

const form = ref<TradeEntry>(newSell());
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-primary p-6 space-y-4 w-96">
      <h3 class="text-lg font-bold">Sell {{ form.commodity }}</h3>

      <div class="item flex flex-col">
        <label for="modalLocation">Location</label>
        <input name="modalLocation" v-model="form.location" placeholder="Location" class="border p-2 w-full" />
      </div>
      <div class="item flex flex-col">
        <label for="modalPriceScu">Price / SCU</label>
        <input name="modalPriceScu" v-model.number="form.price" placeholder="Price / SCU" type="number"
          class="border p-2 w-full" />
      </div>
      <div class="item flex flex-col">
        <label for="modalScuAmount">SCUs</label>
        <input name="modalScuAmount" v-model.number="form.amount" placeholder="SCUs" type="number"
          class="border p-2 w-full" />
      </div>

      <div class="flex justify-end gap-2">
        <button class="border px-3" @click="emit('cancelSell')">Cancel</button>
        <button class="border px-3" @click="emit('confirmSell', form)">Confirm</button>
      </div>
    </div>
  </div>
</template>

<style></style>