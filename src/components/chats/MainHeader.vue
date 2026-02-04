<template>
  <header class="main-header">
    <UiButton variant="icon" size="sm" @click="$emit('openSidebar')" class="main-icon">
      <template #left>
        <LeftIcon />
      </template>
    </UiButton>
    <h3 class="main-header-button d-2">Chats</h3>
    <UiButton variant="primary" size="sm" class="btn">
      <template #left>
        <ElementIcon fill="currentColor" />
      </template>
      New Chat
    </UiButton>
    <UiButton variant="primary" size="sm" class="btn-icon">
      <template #left>
        <ElementIcon fill="currentColor" />
      </template>
    </UiButton>
  </header>
</template>

<script setup lang="ts">
import ElementIcon from '@icons/Element.svg';
import UiButton from '../shared/UiButton.vue';
import LeftIcon from '@icons/Left.svg';

defineEmits<{
  (e: 'openSidebar'): void
}>()
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

.main-icon {
  display: none;
}

.btn-icon {
  display: none;
}


@media (max-width: 768px) {
  .main-icon {
    display: block;
  }

  .btn-icon {
    display: inline-block;
  }

  .main-header-button {
    display: none;
  }

  .btn {
    display: none;
  }

}

</style>
