<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import type { Tour, TradeEntry, CostEntry } from '~/utils/types/tour'
import type {
  GetCommoditiesPricesByTerminalOkResponse,
  UexCommodity,
  UexCommodityPriceByTerminal,
  UexTerminal,
} from '~/utils/types/uex';

const props = defineProps<{ tour: Tour }>()
const commodities = inject('commodities', ref<UexCommodity[]>([]))
const terminals = inject('terminals', ref<UexTerminal[]>([]))

const emptyTrade = (): TradeEntry => ({
  location: '',
  commodity: '',
  price: 0,
  totalPrice: 0,
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

const newBuy = ref(emptyTrade());
const newSell = ref(emptyTrade());
const lastBuyEdited = ref<keyof Pick<TradeEntry, 'price' | 'amount' | 'totalPrice'> | null>(null);
const lastSellEdited = ref<keyof Pick<TradeEntry, 'price' | 'amount' | 'totalPrice'> | null>(null);
const terminalPriceCache = ref(new Map<number, UexCommodityPriceByTerminal[]>())
const buyCommodityTerminals = ref<UexCommodityPriceByTerminal[]>([])
const sellCommodityTerminals = ref<UexCommodityPriceByTerminal[]>([])

const allCommodityOptions = computed(() => {
  return [...new Map(
    commodities.value.map((item) => [
      item.code,
      { label: `${item.code} | ${item.name}`, value: item.code },
    ])
  ).values()]
})

const locationOptions = computed(() => {
  return [...new Map(
    terminals.value.map((item) => [
      item.code,
      { label: `${item.nickname} | ${item.displayname}`, value: item.nickname },
    ])
  ).values()]
})

const resolveTerminalByLocation = (location: string) => {
  const normalized = location.trim().toLowerCase()
  if (!normalized) return undefined

  return terminals.value.find((terminal) => {
    const candidates = [
      terminal.nickname,
      terminal.code,
      terminal.name,
      terminal.displayname,
      terminal.fullname,
    ].filter(Boolean)

    return candidates.some((candidate) => candidate.toLowerCase() === normalized)
  })
}

const buyTerminalId = computed(() => resolveTerminalByLocation(newBuy.value.location)?.id ?? null)
const sellTerminalId = computed(() => resolveTerminalByLocation(newSell.value.location)?.id ?? null)

const fetchTerminalPrices = async (terminalId: number): Promise<UexCommodityPriceByTerminal[]> => {
  const cached = terminalPriceCache.value.get(terminalId)
  if (cached) return cached

  try {
    const response = await $fetch<GetCommoditiesPricesByTerminalOkResponse>(
      `https://api.uexcorp.uk/2.0/commodities_prices/id_terminal/${terminalId}`,
      { method: 'GET' }
    )
    const rows = response?.data ?? []
    terminalPriceCache.value.set(terminalId, rows)
    return rows
  } catch {
    return []
  }
}

watch(
  buyTerminalId,
  async (terminalId) => {
    if (!terminalId) {
      buyCommodityTerminals.value = []
      return
    }
    buyCommodityTerminals.value = await fetchTerminalPrices(terminalId)
  },
  { immediate: true }
)

watch(
  sellTerminalId,
  async (terminalId) => {
    if (!terminalId) {
      sellCommodityTerminals.value = []
      return
    }
    sellCommodityTerminals.value = await fetchTerminalPrices(terminalId)
  },
  { immediate: true }
)

const buyCommodityOptions = computed(() => {
  if (!buyTerminalId.value) return allCommodityOptions.value

  const buyableCodes = new Set(
    buyCommodityTerminals.value
      .filter((row) => row.price_buy > 0)
      .map((row) => row.commodity_code)
  )

  return allCommodityOptions.value.filter((option) => buyableCodes.has(option.value))
})

const sellCommodityOptions = computed(() => {
  if (!sellTerminalId.value) return allCommodityOptions.value

  const sellableCodes = new Set(
    sellCommodityTerminals.value
      .filter((row) => row.price_sell > 0)
      .map((row) => row.commodity_code)
  )

  return allCommodityOptions.value.filter((option) => sellableCodes.has(option.value))
})

const isFiniteNumber = (value: number): boolean => Number.isFinite(value);

const setIfChanged = (
  trade: TradeEntry,
  key: keyof Pick<TradeEntry, 'price' | 'amount' | 'totalPrice'>,
  nextValue: number
) => {
  if (!isFiniteNumber(nextValue)) return;
  if (Math.abs((trade[key] ?? 0) - nextValue) < 0.0001) return;
  trade[key] = Number(nextValue.toFixed(2));
}

const syncTradeValues = (
  trade: TradeEntry,
  changed: keyof Pick<TradeEntry, 'price' | 'amount' | 'totalPrice'> | null
) => {
  if (!changed) return;

  const price = Number(trade.price);
  const amount = Number(trade.amount);
  const totalPrice = Number(trade.totalPrice);
  const hasPrice = isFiniteNumber(price) && price > 0;
  const hasAmount = isFiniteNumber(amount) && amount > 0;
  const hasTotal = isFiniteNumber(totalPrice) && totalPrice > 0;

  if (changed === 'price') {
    if (hasPrice && hasAmount) {
      setIfChanged(trade, 'totalPrice', price * amount);
    } else if (hasPrice && hasTotal) {
      setIfChanged(trade, 'amount', totalPrice / price);
    }
    return;
  }

  if (changed === 'amount') {
    if (hasPrice && hasAmount) {
      setIfChanged(trade, 'totalPrice', price * amount);
    } else if (hasAmount && hasTotal) {
      setIfChanged(trade, 'price', totalPrice / amount);
    }
    return;
  }

  if (hasTotal && hasAmount) {
    setIfChanged(trade, 'price', totalPrice / amount);
  } else if (hasTotal && hasPrice) {
    setIfChanged(trade, 'amount', totalPrice / price);
  }
}

watch(
  () => [newBuy.value.price, newBuy.value.amount, newBuy.value.totalPrice],
  () => syncTradeValues(newBuy.value, lastBuyEdited.value)
)

watch(
  () => [newSell.value.price, newSell.value.amount, newSell.value.totalPrice],
  () => syncTradeValues(newSell.value, lastSellEdited.value)
)

watch(
  () => [newBuy.value.location, newBuy.value.commodity, buyCommodityTerminals.value],
  () => {
    if (!newBuy.value.location || !newBuy.value.commodity) return

    const row = buyCommodityTerminals.value.find(
      (item) => item.commodity_code === newBuy.value.commodity
    )
    if (!row || row.price_buy <= 0) return

    lastBuyEdited.value = 'price'
    setIfChanged(newBuy.value, 'price', row.price_buy)
  }
)

watch(
  () => [newSell.value.location, newSell.value.commodity, sellCommodityTerminals.value],
  () => {
    if (!newSell.value.location || !newSell.value.commodity) return

    const row = sellCommodityTerminals.value.find(
      (item) => item.commodity_code === newSell.value.commodity
    )
    if (!row || row.price_sell <= 0) return

    lastSellEdited.value = 'price'
    setIfChanged(newSell.value, 'price', row.price_sell)
  }
)

const addBuy = () => {
  if (!newBuy.value.commodity || !newBuy.value.amount) return
  props.tour.buys.push({ ...newBuy.value })
  newBuy.value = emptyTrade()
  lastBuyEdited.value = null
}

const addSell = () => {
  if (!newSell.value.commodity || !newSell.value.amount) return
  props.tour.sells.push({ ...newSell.value })
  newSell.value = emptyTrade()
  lastSellEdited.value = null
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
          <DropDownInputField
            name="buy-location"
            :dropdown-value="newBuy.location"
            :options="locationOptions"
            placeholder="Location"
            @update="(newValue) => newBuy.location = newValue || ''"
            class="border p-1 max-w-34 h-9"
          />
        </div>
        <div class="item flex flex-col">
          <label for="commodity">Commodity</label>
          <DropDownInputField
            name="buy-commodity"
            :dropdown-value="newBuy.commodity"
            :options="buyCommodityOptions"
            placeholder="Commodity"
            @update="(newValue) => newBuy.commodity = newValue || ''"
            class="border p-1 max-w-34 h-9"
          />
        </div>
        <div class="item flex flex-col">
          <label for="scu_amount">SCUs</label>
          <input name="scu_amount" v-model.number="newBuy.amount" placeholder="SCUs" type="number"
            @input="lastBuyEdited = 'amount'"
            class="border p-1 w-20 h-9" />
        </div>
        <div class="item flex flex-col">
          <label for="price_scu">aUEC/SCU</label>
          <input name="price_scu" v-model.number="newBuy.price" placeholder="Price / SCU" type="number" step="0.01"
            @input="lastBuyEdited = 'price'"
            class="border p-1 w-28 h-9" />
        </div>
        <div class="item flex flex-col">
          <label for="price_scu">aUEC Total</label>
          <input name="price_scu" v-model.number="newBuy.totalPrice" placeholder="Price / SCU" type="number" step="0.01"
            @input="lastBuyEdited = 'totalPrice'"
            class="border p-1 w-28 h-9" />
        </div>
        <button @click="addBuy()" class="border px-2 min-w-20 ml-auto">+</button>
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
          <DropDownInputField
            name="sell-location"
            :dropdown-value="newSell.location"
            :options="locationOptions"
            placeholder="Location"
            @update="(newValue) => newSell.location = newValue || ''"
            class="border p-1 max-w-34 h-9"
          />
        </div>
        <div class="item flex flex-col">
          <label for="commodity">Commodity</label>
          <DropDownInputField
            name="sell-commodity"
            :dropdown-value="newSell.commodity"
            :options="sellCommodityOptions"
            placeholder="Commodity"
            @update="(newValue) => newSell.commodity = newValue || ''"
            class="border p-1 max-w-34 h-9"
          />
        </div>
        <div class="item flex flex-col">
          <label for="scu_amount">SCUs</label>
          <input name="scu_amount" v-model.number="newSell.amount" placeholder="SCUs" type="number"
            @input="lastSellEdited = 'amount'"
            class="border p-1 w-20 h-9" />
        </div>
        <div class="item flex flex-col">
          <label for="price_scu">aUEC/SCU</label>
          <input name="price_scu" v-model.number="newSell.price" placeholder="aUEC/SCU" type="number" step="0.01"
            @input="lastSellEdited = 'price'"
            class="border p-1 w-28 h-9" />
        </div>
        <div class="item flex flex-col">
          <label for="price_scu">aUEC Total</label>
          <input name="price_scu" v-model.number="newSell.totalPrice" placeholder="aUEC Total" type="number" step="0.01"
            @input="lastSellEdited = 'totalPrice'"
            class="border p-1 w-28 h-9" />
        </div>
        <button @click="addSell()" class="border px-2 min-w-20 ml-auto">+</button>
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
