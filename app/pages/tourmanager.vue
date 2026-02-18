<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDateFormat } from '@vueuse/core';

const tours = ref([])
const newTourName = ref('')
const dateOptions = { day: 'numeric', month: 'long', year: 'numeric'};

const emptyTrade = () => ({
  location: '',
  commodity: '',
  price: 0,
  amount: 0
})

const sellModal = ref({
  open: false,
  tourId: null,
  form: {
    location: '',
    commodity: '',
    price: 0,
    amount: 0
  }
})

const createTour = () => {
  if (!newTourName.value) return
  tours.value.push({
    id: Date.now(),
    show: true,
    name: newTourName.value,
    buys: [],
    sells: [],
    newBuy: emptyTrade(),
    newSell: emptyTrade()
  })
  newTourName.value = ''
}

const deleteTour = (id) => {
  tours.value = tours.value.filter(t => t.id !== id)
}

const addBuy = (tour) => {
  if (!tour.newBuy.commodity || !tour.newBuy.amount) return
  tour.buys.push({ ...tour.newBuy })
  tour.newBuy = emptyTrade()
}

const addSell = (tour) => {
  if (!tour.newSell.commodity || !tour.newSell.amount) return
  tour.sells.push({ ...tour.newSell })
  tour.newSell = emptyTrade()
}

const onboard = (tour) => {
  const map = {}
  tour.buys.forEach(b => {
    map[b.commodity] = (map[b.commodity] || 0) + b.amount
  })
  tour.sells.forEach(s => {
    map[s.commodity] = (map[s.commodity] || 0) - s.amount
  })
  return map
}

const profit = (tour) => {
  let buyCost = 0
  let sellRevenue = 0

  tour.buys.forEach(b => {
    buyCost += b.price * b.amount
  })
  tour.sells.forEach(s => {
    sellRevenue += s.price * s.amount
  })

  return  Intl.NumberFormat().format(sellRevenue - buyCost)
}

const openSellModal = (tour, commodity, amount) => {
  sellModal.value.open = true
  sellModal.value.tourId = tour.id
  sellModal.value.form = {
    location: '',
    commodity,
    price: 0,
    amount
  }
}

const closeSellModal = () => {
  sellModal.value.open = false
}

const confirmSell = () => {
  const tour = tours.value.find(t => t.id === sellModal.value.tourId)
  if (!tour) return

  tour.sells.push({ ...sellModal.value.form })
  closeSellModal()
}

const toggleTour = (tour) => {
  tour.show = !tour.show
}

watch(tours, () => {
  localStorage.setItem('scTours', JSON.stringify(tours.value))
}, { deep: true })

onMounted(() => {
  const saved = localStorage.getItem('scTours')
  if (saved) {
    tours.value = JSON.parse(saved)
    tours.value.forEach(t => {
      t.newBuy = emptyTrade()
      t.newSell = emptyTrade()
    })
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
      <div class="flex justify-between items-center">
        <div class="flex flex-row gap-2">
          <h2 class="text-lg font-bold">{{ tour.name }}</h2>
          <h3 class="text-lg font-bold">{{ useDateFormat(tour.id, 'DD.MM.YYYY', 'de') }}</h3>
          <button @click="toggleTour(tour)" class="text-red-500">Toggle view</button>
        </div>
        <button @click="deleteTour(tour.id)" class="text-red-500">Delete</button>
      </div>

      <div v-show="tour.show" class="tour-wrapper">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold">Buy</h3>
            <div class="flex gap-2 mb-2">
              <div class="item flex flex-col">
                <label for="location">Location</label>
                <input name="location" v-model="tour.newBuy.location" placeholder="Location" class="border p-1" />
              </div>
              <div class="item flex flex-col">
                <label for="commodity">Commodity</label>
                <input name="commodity" v-model="tour.newBuy.commodity" placeholder="Commodity" class="border p-1" />
              </div>
              <div class="item flex flex-col">
                <label for="price_scu">aUEC/SCU</label>
                <input name="price_scu" v-model.number="tour.newBuy.price" placeholder="Price / SCU" type="number"
                  class="border p-1 w-28" />
              </div>
              <div class="item flex flex-col">
                <label for="scu_amount">SCUs</label>
                <input name="scu_amount" v-model.number="tour.newBuy.amount" placeholder="SCUs" type="number"
                  class="border p-1 w-20" />
              </div>
              <button @click="addBuy(tour)" class="border px-2 min-w-20">+</button>
            </div>

            <table class="w-full border text-sm">
              <thead class="text-left">
                <tr>
                  <th>Location</th>
                  <th>Commodity</th>
                  <th>aUEC/SCU</th>
                  <th>SCU</th>
                  <th>Trade value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(b, i) in tour.buys" :key="i">
                  <td>{{ b.location }}</td>
                  <td>{{ b.commodity }}</td>
                  <td>{{ b.price }}</td>
                  <td>{{ b.amount }}</td>
                  <td>{{ new Intl.NumberFormat().format(b.price * b.amount) }}</td>
                  <td><button @click="tour.buys.splice(i, 1)">x</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 class="font-semibold">Sell</h3>
            <div class="flex gap-2 mb-2">
              <div class="item flex flex-col">
                <label for="location">Location</label>
                <input name="location" v-model="tour.newSell.location" placeholder="Location" class="border p-1" />
              </div>
              <div class="item flex flex-col">
                <label for="commodity">Commodity</label>
                <input name="commodity" v-model="tour.newSell.commodity" placeholder="Commodity" class="border p-1" />
              </div>
              <div class="item flex flex-col">
                <label for="price_scu">aUEC/SCU</label>
                <input name="price_scu" v-model.number="tour.newSell.price" placeholder="Price / SCU" type="number"
                  class="border p-1 w-28" />
              </div>
              <div class="item flex flex-col">
                <label for="scu_amount">SCUs</label>
                <input name="scu_amount" v-model.number="tour.newSell.amount" placeholder="SCUs" type="number"
                  class="border p-1 w-20" />
              </div>
              <button @click="addSell(tour)" class="border px-2 min-w-20">+</button>
            </div>

            <table class="w-full border text-sm">
              <thead class="text-left">
                <tr>
                  <th>Location</th>
                  <th>Commodity</th>
                  <th>aUEC/SCU</th>
                  <th>SCUs</th>
                  <th>Trade value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(s, i) in tour.sells" :key="i">
                  <td>{{ s.location }}</td>
                  <td>{{ s.commodity }}</td>
                  <td>{{ s.price }}</td>
                  <td>{{ s.amount }}</td>
                  <td>{{ Intl.NumberFormat().format(s.price * s.amount) }}</td>
                  <td><button @click="tour.sells.splice(i, 1)">x</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="border-t mt-3 pt-3">
          <div class="font-semibold">On Board</div>
          <div v-for="(amount, commodity) in onboard(tour)" :key="commodity" class="flex gap-2 items-center">
            <template v-if="amount > 0">
              <span>{{ commodity }}: {{ amount }} SCU</span>
              <button class="border px-2" @click="openSellModal(tour, commodity, amount)">
                Sell
              </button>
            </template>
            <template v-else>
              <span>{{ commodity }} sold</span>
            </template>
          </div>
        </div>

        <div class="border-t pt-3 font-bold">
          Profit: {{ profit(tour) }} aUEC
        </div>
      </div>
    </div>
    <div v-if="sellModal.open" class="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div class="bg-primary p-6 space-y-4 w-96">
        <h3 class="text-lg font-bold">Sell {{ sellModal.form.commodity }}</h3>

        <div class="item flex flex-col">
          <label for="modalLocation">Location</label>
          <input name="modalLocation" v-model="sellModal.form.location" placeholder="Location"
            class="border p-2 w-full" />
        </div>
        <div class="item flex flex-col">
          <label for="modalPriceScu">Price / SCU</label>
          <input name="modalPriceScu" v-model.number="sellModal.form.price" placeholder="Price / SCU" type="number"
            class="border p-2 w-full" />
        </div>
        <div class="item flex flex-col">
          <label for="modalScuAmount">SCUs</label>
          <input name="modalScuAmount" v-model.number="sellModal.form.amount" placeholder="SCUs" type="number"
            class="border p-2 w-full" />
        </div>

        <div class="flex justify-end gap-2">
          <button class="border px-3" @click="closeSellModal">Cancel</button>
          <button class="border px-3" @click="confirmSell">Confirm</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
button {
  @apply cursor-pointer
}

th {
  font-weight: 700;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid var(--color-white);
}

tr:nth-child(even) {
  backdrop-filter: brightness(70%);
}
</style>