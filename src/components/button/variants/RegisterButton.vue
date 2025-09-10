<template>
  <BaseButton
    variant="primary"
    size="lg"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    등록하기
  </BaseButton>
</template>

<script setup>
import BaseButton from '../BaseButton.vue'
defineEmits(['click'])
</script>
