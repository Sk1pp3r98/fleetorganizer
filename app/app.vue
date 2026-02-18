<script setup lang="ts">
const route = useRoute()

useHead(() => ({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - FleetOrganiser` : 'FleetOrganiser'
  },
}))
</script>
<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>
