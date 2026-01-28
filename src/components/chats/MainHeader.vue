<template>
  <header class="main-header">
    <h3 class="main-header-button d-2">Chats</h3>
    <UiButton variant="primary" size="sm">
      <template #left>
        <ElementIcon fill="currentColor" />
      </template>
      New Chat
    </UiButton>
  </header>
</template>

<script setup lang="ts">
import ElementIcon from '@/assets/icons/Element.svg';
import UiButton from '../shared/UiButton.vue';
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
  border-bottom: 1px solid var(--neutral-400);
}

.main-header-button {
  font-weight: 500;
}
</style>
