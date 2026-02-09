<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm';
import { shipInstances } from '~~/server/db/schema';

type ShipInstances = InferSelectModel<typeof shipInstances>;

defineProps<{ rowData?: ShipInstances }>();
</script>
<template>
    <div v-if="rowData">
        <pre>
            {{ rowData }}
        </pre>
    </div>
</template>