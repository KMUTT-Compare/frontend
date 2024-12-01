<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue', 'toggle-filter']);

const updateSearchInput = event => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div class="flex">
    <input
      type="text"
      :value="modelValue"
      @input="updateSearchInput"
      placeholder="ค้นหาหอพัก..."
      class="p-2 border rounded-lg"
    />
    <button @click="$emit('toggle-filter')" class="ml-2 p-2 bg-gray-300 rounded-lg">
      Filter
    </button>
  </div>
</template>
