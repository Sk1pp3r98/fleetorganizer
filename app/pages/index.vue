<script setup lang="ts">
useHead({
  title: 'Home',
})
const { data, error } = await useFetch("/api/db-test");
</script>

<template>
  <div v-if="data">
    <ShipsTable :table-data="data.rows" />
  </div>
  <Footer />
</template>
