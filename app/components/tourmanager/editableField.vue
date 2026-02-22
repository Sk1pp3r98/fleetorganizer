<script setup lang="ts">
const props = defineProps<{
  value: string | number,
  type: 'string' | 'number'
}>();

const emit = defineEmits(['change']);

const editOpen = ref(false);
const input = useTemplateRef('input-field');

const openEdit = async () => {
  editOpen.value = true;
  await nextTick();
  input.value?.focus();
}

const handleSubmit = (value: string) => {
  emit('change', value)
  editOpen.value = false;
}
</script>

<template>
  <div v-show="!editOpen" @click="openEdit()">
    {{ value }}
  </div>
  <input
    ref="input-field"
    v-show="editOpen"
    v-bind:value="value"
    @keyup.enter="handleSubmit(($event?.target as HTMLInputElement).value)"
    @blur="handleSubmit(($event?.target as HTMLInputElement).value)"
    :type="type === 'number' ? 'number' : undefined"
    class="border w-full"
    size="10"
    />
</template>

<style></style>
