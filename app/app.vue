<script setup lang="ts">
import type { GetCommoditiesOkResponse, GetTerminalsOkResponse } from '~/utils/types/uex'

useHead(() => ({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - FleetOrganiser` : 'FleetOrganiser'
  },
}))

const { data: commodityData } = await useFetch<GetCommoditiesOkResponse>('https://api.uexcorp.uk/2.0/commodities', {
  method: 'GET',
})

const { data: terminalsData } = await useFetch<GetTerminalsOkResponse>('https://api.uexcorp.uk/2.0/terminals', {
  method: 'GET',
})

const commodities = computed(() => commodityData.value?.data ?? [])
const terminals = computed(() => terminalsData.value?.data ?? [])
provide('commodities', commodities)
provide('terminals', terminals)
</script>
<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>
