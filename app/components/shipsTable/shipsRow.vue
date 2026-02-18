<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm';
import { shipInstances } from '~~/server/db/schema';

type ShipInstances = InferSelectModel<typeof shipInstances>;

const props = defineProps<{ rowData?: ShipInstances }>();
console.log(props.rowData);
</script>
<template>
    <div v-if="rowData">
        <pre>
            {{ rowData }}
        </pre>
    </div>
</template>