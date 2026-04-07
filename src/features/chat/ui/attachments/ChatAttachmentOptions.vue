<template>
  <div v-if="modelValue" class="composer-attach-menu" tabindex="-1" @focusout="handleFocusOut">
    <button
      v-for="option in attachmentOptions"
      :key="option.accept"
      type="button"
      class="composer-attach-menu-item"
      @click="handleSelect(option.accept)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ATTACHMENT_OPTIONS } from './constants';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', accept: string): void;
}>();

const attachmentOptions = ATTACHMENT_OPTIONS;

function handleSelect(accept: string) {
  emit('select', accept);
  emit('update:modelValue', false);
}

function handleFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget as Node | null;

  if (!nextTarget || !(event.currentTarget as HTMLElement).contains(nextTarget)) {
    emit('update:modelValue', false);
  }
}
</script>

<style scoped>
.composer-attach-menu {
  position: absolute;
  left: 20px;
  bottom: 56px;
  display: flex;
  flex-direction: column;
  min-width: 140px;
  padding: 8px;
  border: 1px solid var(--neutral-400);
  border-radius: 12px;
  background: var(--neutral-100);
  z-index: 10;
}

.composer-attach-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: var(--neutral-700);
}

.composer-attach-menu-item:hover {
  background: var(--neutral-200);
}
</style>
