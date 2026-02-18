<script setup lang="ts">
const { data, error } = await useFetch("/api/db-test");
</script>

<template>
  <Header />
  <div v-if="data" class="container mx-auto">
    <Table :table-data="data.rows" />
  </div>
  <Footer />
</template>
