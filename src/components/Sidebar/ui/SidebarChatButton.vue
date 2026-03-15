<template>
  <button class="btn d-2" :class="{ 'btn--active': active }" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean;
}>();
</script>

<style scoped>
.btn {
  width: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-weight: 400;
  color: var(--neutral-600);
  text-align: left;
  border-radius: 8px;
  padding: 8px 12px;
}

.btn:hover:not(:disabled) {
  background: var(--neutral-400);
  color: var(--neutral-800);
}

.btn:active:not(:disabled) {
  background: var(--neutral-500);
}

.btn--active {
  background: var(--neutral-400);
  color: var(--neutral-800);
}
</style>
