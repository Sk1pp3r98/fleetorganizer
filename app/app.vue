<script setup lang="ts">
const route = useRoute()

useHead(() => ({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - FleetOrganiser` : 'FleetOrganiser'
  },
}))

async function getCommodities () {
  const res = await $fetch('https://api.uexcorp.uk/2.0/commodities', {
    method: 'GET',
  })
  return res;
}

const commodities = await getCommodities();
provide('commodities', commodities)
</script>
<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>
