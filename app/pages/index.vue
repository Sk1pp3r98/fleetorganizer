<script setup lang="ts">
const { data, error } = await useFetch("/api/db-test");
</script>

<template>
  <div v-if="data" class="container mx-auto">
  <header>
    Header content
  </header>
    <Table :table-data="data.rows"/>
  <footer>
    Footer content
  </footer>
  </div>
</template>
