<script setup lang="ts">
const { data, error } = await useFetch("/api/db-test");

console.log(data);
</script>

<template>
  <div v-if="data">
    <Table :table-data="data.rows"/>
  </div>
</template>
