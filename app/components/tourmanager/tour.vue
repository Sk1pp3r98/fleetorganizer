<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import type { Tour, TradeEntry, CostEntry } from '~/utils/types/tour'

const props = defineProps<{ tour: Tour }>()

const emptyTrade = (): TradeEntry => ({
  location: '',
  commodity: '',
  price: 0,
  amount: 0
})

const sellModal = ref<{
  commodity: string,
  amount: number
}>({
  commodity: '',
  amount: 0
})

const costModalOpen = ref(false);
const sellModalOpen = ref(false);
const renameOpen = ref(false);

const newBuy = ref(emptyTrade());
const newSell = ref(emptyTrade());

const addBuy = () => {
  if (!newBuy.value.commodity || !newBuy.value.amount) return
  props.tour.buys.push({ ...newBuy.value })
  newBuy.value = emptyTrade()
}

const addSell = () => {
  if (!newSell.value.commodity || !newSell.value.amount) return
  props.tour.sells.push({ ...newSell.value })
  newSell.value = emptyTrade()
}

const openSellModal = (commodity: string, amount: number) => {
  sellModal.value.commodity = commodity;
  sellModal.value.amount = amount;
  sellModalOpen.value = true;
}


const confirmSell = (form: TradeEntry) => {
  props.tour.sells.push({ ...form })
  sellModalOpen.value = false
}

const cancelSell = () => {
  sellModalOpen.value = false;
}

const confirmCost = (form: CostEntry) => {
  props.tour.costs.push({ ...form })
  costModalOpen.value = false;
}

const cancelCost = () => {
  costModalOpen.value = false;
}

const toggleTour = () => {
  props.tour.show = !props.tour.show
}

const profit = () => {
  let buyCost = 0
  let additionalCost = 0
  let sellRevenue = 0

  props.tour.buys?.forEach(b => {
    buyCost += b.price * b.amount
  })
  props.tour.costs?.forEach(b => {
    additionalCost += b.price
  })
  props.tour.sells?.forEach(s => {
    sellRevenue += s.price * s.amount
  })
  return Intl.NumberFormat().format(sellRevenue - buyCost - additionalCost)
}

const onboard = (): Record<string, number> => {
  const map: Record<string, number> = {}
  props.tour.buys.forEach(b => {
    map[b.commodity] = (map[b.commodity] || 0) + b.amount
  })
  props.tour.sells.forEach(s => {
    map[s.commodity] = (map[s.commodity] || 0) - s.amount
  })
  return map
}

defineEmits(['deleteTour']);
</script>

<template>
<div class="flex justify-between items-center">
  <div class="flex flex-row gap-2 items-center">
    <h2 class="text-lg font-bold hover:cursor-pointer">
      <EditableField :value="tour.name" @change="(e) => tour.name = e" type="string" />
    </h2>

    <h3 class="text-lg font-bold">{{ useDateFormat(tour.id, 'DD.MM.YYYY') }}</h3>
    <button @click="toggleTour()" class="text-red-500">Toggle view</button>
  </div>
  <button @click="$emit('deleteTour', tour.id)" class="text-red-500">Delete</button>
</div>

<div v-show="tour.show" class="tour-wrapper">
  <div class="grid grid-cols-2 gap-4">
    <div class="buy-div">
      <h3 class="font-semibold">Buy</h3>
      <form class="flex gap-2 mb-2" @submit.prevent="addBuy()">
        <div class="item flex flex-col">
          <label for="location">Location</label>
          <input name="location" v-model="newBuy.location" placeholder="Location" class="border p-1" />
        </div>
        <div class="item flex flex-col">
          <label for="commodity">Commodity</label>
          <input name="commodity" v-model="newBuy.commodity" placeholder="Commodity" class="border p-1" />
        </div>
        <div class="item flex flex-col">
          <label for="price_scu">aUEC/SCU</label>
          <input name="price_scu" v-model.number="newBuy.price" placeholder="Price / SCU" type="number"
            class="border p-1 w-28" />
        </div>
        <div class="item flex flex-col">
          <label for="scu_amount">SCUs</label>
          <input name="scu_amount" v-model.number="newBuy.amount" placeholder="SCUs" type="number"
            class="border p-1 w-20" />
        </div>
        <button @click="addBuy()" class="border px-2 min-w-20">+</button>
      </form>

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
            <td>
              <EditableField :value="b.location" @change="(e) => b.location = e" type="string" />
            </td>
            <td>
              <EditableField :value="b.commodity" @change="(e) => b.commodity = e" type="string" />
            </td>
            <td>
              <EditableField :value="b.price" @change="(e) => b.price = e" type="number" />
            </td>
            <td>
              <EditableField :value="b.amount" @change="(e) => b.amount = e" type="number" />
            </td>
            <td>{{ new Intl.NumberFormat().format(b.price * b.amount) }}</td>
            <td class="w-30 text-right"><button @click="tour.buys.splice(i, 1)" class="text-red-500">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="sell-div">
      <h3 class="font-semibold">Sell</h3>
      <form class="flex gap-2 mb-2" @submit.prevent="addSell()">
        <div class="item flex flex-col">
          <label for="location">Location</label>
          <input name="location" v-model="newSell.location" placeholder="Location" class="border p-1" />
        </div>
        <div class="item flex flex-col">
          <label for="commodity">Commodity</label>
          <input name="commodity" v-model="newSell.commodity" placeholder="Commodity" class="border p-1" />
        </div>
        <div class="item flex flex-col">
          <label for="price_scu">aUEC/SCU</label>
          <input name="price_scu" v-model.number="newSell.price" placeholder="aUEC/SCU" type="number"
            class="border p-1 w-28" />
        </div>
        <div class="item flex flex-col">
          <label for="scu_amount">SCUs</label>
          <input name="scu_amount" v-model.number="newSell.amount" placeholder="SCUs" type="number"
            class="border p-1 w-20" />
        </div>
        <button @click="addSell()" class="border px-2 min-w-20">+</button>
      </form>

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
            <td>
              <EditableField :value="s.location" @change="(e) => s.location = e" type="string" />
            </td>
            <td>
              <EditableField :value="s.commodity" @change="(e) => s.commodity = e" type="string" />
            </td>
            <td>
              <EditableField :value="s.price" @change="(e) => s.price = e" type="number" />
            </td>
            <td>
              <EditableField :value="s.amount" @change="(e) => s.amount = e" type="number" />
            </td>
            <td>{{ Intl.NumberFormat().format(s.price * s.amount) }}</td>
            <td class="w-30 text-right"><button @click="tour.sells.splice(i, 1)" class="text-red-500">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="cost-div mt-3" v-if="tour.costs?.length > 0">
    <h3 class="font-semibold">Cost</h3>

    <table class="w-full border text-sm">
      <thead class="text-left">
        <tr>
          <th>Location</th>
          <th>Name</th>
          <th>aUEC</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(c, i) in tour.costs" :key="i">
          <td>
            <EditableField :value="c.location" @change="(e) => c.location = e" type="string" />
          </td>
          <td>
            <EditableField :value="c.costName" @change="(e) => c.costName = e" type="string" />
          </td>
          <td>
            <EditableField :value="c.price" @change="(e) => c.price = e" type="string" />
          </td>
          <td class="w-30 text-right"><button @click="tour.costs.splice(i, 1)" class="text-red-500">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="border-y my-4 py-4 flex flex-row justify-between">
    <div class="">
      <div class="font-semibold">On Board</div>
      <div v-for="(amount, commodity) in onboard()" :key="commodity" class="flex gap-2 items-center">
        <template v-if="amount > 0">
          <span>{{ commodity }}: {{ amount }} SCU</span>
          <button class="border px-2" @click="openSellModal(commodity, amount)">
            Sell
          </button>
        </template>
        <template v-else>
          <span>{{ commodity }} sold</span>
        </template>
      </div>
    </div>
    <button class="border px-2" @click="costModalOpen = true">
      Add additional cost
    </button>
  </div>

  <div class=" font-bold">
    Profit: {{ profit() }} aUEC
  </div>
</div>

<!-- Modals -->

<CostModal v-if="costModalOpen" @confirm-cost="confirmCost" @cancel-cost="cancelCost" />

<SellModal v-if="sellModalOpen" :commodity="sellModal.commodity" :amount="sellModal.amount" @confirm-sell="confirmSell"
  @cancel-sell="cancelSell" />
</template>

<style>
th {
  font-weight: 700;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid var(--color-white);
}

tr:nth-child(even) {
  backdrop-filter: brightness(70%);
}
</style>
