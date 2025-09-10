<template>
  <button
    type="button"
    class="text-btn"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({ disabled: { type: Boolean, default: false } })
defineEmits(['click'])
</script>

<style scoped>
.text-btn {
  background: transparent; border: 0; padding: 0;
  color:#2563eb; text-decoration: underline; cursor: pointer;
  font: inherit;
}
.text-btn:disabled { color:#9ca3af; cursor:not-allowed; text-decoration:none }
</style>
