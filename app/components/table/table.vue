<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm';
import { shipInstances } from '~~/server/db/schema';
import Row from './row.vue';

type ShipInstances = InferSelectModel<typeof shipInstances>;

defineProps<{ tableData?: ShipInstances[] }>();
</script>

<template>
  <div v-if="tableData" class="table">
    <template v-for="row in tableData">
        <Row :row-data="row" />
    </template>
  </div>
</template>
