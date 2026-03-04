<script setup lang="ts">
type DropDownOption = {
  label: string
  value: string
}

const props = defineProps<{
  name: string
  dropdownValue?: string
  options?: DropDownOption[]
  placeholder?: string
}>()

const selectValue = ref(props.dropdownValue)
const emit = defineEmits(['update'])
const createdItems = ref<DropDownOption[]>([])

const items = computed(() => {
  const merged = [...(props.options ?? []), ...createdItems.value]
  const byValue = new Map<string, DropDownOption>()
  for (const option of merged) {
    byValue.set(option.value, option)
  }
  return [...byValue.values()]
})

const onCreate = (item: string) => {
  createdItems.value.push({ label: item, value: item })
}

const handleUpdate = () => {
  emit('update', selectValue.value)
}

watch(() => props.dropdownValue, (nextValue) => {
  selectValue.value = nextValue
})
</script>

<template>
  <USelectMenu
    :id="name"
    :placeholder="placeholder"
    v-model="selectValue"
    @change="handleUpdate()"
    create-item
    :items="items"
    :ui="{ content: 'min-w-fit' }"
    label-key="label"
    value-key="value"
    size="xl"
    class="w-48 bg-transparent text-white rounded-none"
    @create="onCreate"
  />
</template>

<style></style>
