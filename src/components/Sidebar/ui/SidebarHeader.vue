<template>
  <div class="sidebar-header" :class="{ collapsed: isCollapsedView }">
    <div class="sidebar-user">
      <img :src="Avatar" alt="Avatar" class="avatar-img" />
      <h3 class="username d-2" :class="{ hidden: isCollapsedView }">Mauro Sicard</h3>
    </div>
    <div class="sidebar-actions">
      <UiButton size="sm" variant="icon">
        <template #left>
          <SettingsIcon />
        </template>
      </UiButton>
      <UiButton size="sm" variant="icon" @click="toggleOpen">
        <template #left>
          <LeftIcon />
        </template>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from '@/assets/image/Avatar.jpg';
import SettingsIcon from '@icons/Settings.svg';
import LeftIcon from '@icons/Left.svg';
import UiButton from '@/components/shared/UiButton.vue';

import { useSidebarState } from '@/components/Sidebar';
import { useAppBreakpoints } from '@/composables/useAppBreakpoints';

const { isOpen, close, toggleOpen } = useSidebarState();
const { md } = useAppBreakpoints();

const isMobile = computed(() => !md.value);
const isCollapsedView = computed(() => !isOpen.value && !isMobile.value);
</script>

<style scoped>
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-actions {
  display: flex;
  gap: 12px;
}

.username {
  white-space: nowrap;
  overflow: hidden;
  transition:
    opacity 0.25s ease,
    width 0.25s ease;
}

.sidebar-header.collapsed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.sidebar-header.collapsed .sidebar-actions {
  flex-direction: column;
}

.sidebar-header.collapsed .sidebar-user {
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.hidden {
  opacity: 0;
  width: 0;
  margin: 0;
  padding: 0;
}
</style>
