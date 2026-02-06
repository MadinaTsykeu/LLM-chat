<template>
  <header class="main-header">
    <UiButton v-if="!breakpoint.md.value" variant="icon" size="sm" @click="open">
      <template #left>
        <LeftIcon />
      </template>
    </UiButton>
    <h3 class="main-header-button d-2" v-if="breakpoint.md.value">Chats</h3>
    <UiButton variant="primary" size="sm" :only-icon="!breakpoint.md.value">
      <template #left>
        <ElementIcon />
      </template>

      <span v-if="breakpoint.md.value" class="btn-text"> New Chat </span>
    </UiButton>
  </header>
</template>

<script setup lang="ts">
import ElementIcon from '@icons/Element.svg';
import UiButton from '../shared/UiButton.vue';
import LeftIcon from '@icons/Left.svg';
import { useAppBreakpoints } from '@/composables';
import { useSidebarState } from '@/composables'

const { open } = useSidebarState()

const breakpoint = useAppBreakpoints();
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
