<script setup lang="ts">
const props = defineProps<{
  name: string,
  value: string | number,
  options?: [],
  placeholder?: string,
}>();
const selectValue = ref(props.value)
const commodities = inject('commodities')
const emit = defineEmits(['update']);
const items = ref(
  commodities.data?.map((item) => (
    `${item.code} | ${item.name}`
  ))
)

const onCreate = (item: string) => {
  items.value.push(item)
  value.value = item
}

const handleUpdate = () => {
  emit('update', selectValue);
}
</script>

<template>
  <USelectMenu :name="name" :placeholder="placeholder" v-model="selectValue"
    @change="handleUpdate()" create-item :items="items" size="xl" class="w-48" @create="onCreate" />
</template>

<style></style>