<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed, 'mobile-open': props.isSidebarOpen }" >
    <SidebarHeader :collapsed="isCollapsed" @toggle="toggleSidebar" :mobileOpen="props.isSidebarOpen" @closeSidebar="emit('close')"/>
    <div class="sidebar-history">
      <h2 class="sidebar-title d-1">chat history</h2>
      <div class="sidebar-chat-list">
        <SidebarChatButton>Chat 1</SidebarChatButton>
        <SidebarChatButton>Chat 2</SidebarChatButton>
      </div>
    </div>
    <div class="sidebar-bottom">
      <UiButton variant="primary" size="sm" class="sidebar-new-chat-btn d-2" v-if="!isCollapsed">
        <template #left>
          <ElementIcon fill="currentColor" />
        </template>
        <h3 class="d-2 start-chat">Start new chat</h3>
      </UiButton>
      <UiButton variant="primary" size="sm" class="d-2" v-else>
        <template #left>
          <ElementIcon fill="currentColor" />
        </template>
      </UiButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
import ElementIcon from '@icons/Element.svg';
import UiButton from '../shared/UiButton.vue';
import SidebarHeader from './SidebarHeader.vue';
import SidebarChatButton from './SidebarChatButton.vue';
import { ref } from 'vue';

const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

interface Props {
  isSidebarOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 296px;
  padding: 24px 24px 24px 14px;
  box-sizing: border-box;
  overflow: hidden;
  transition: width 0.6s ease;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-history {
  flex: 1;
  margin-top: 40px;
  overflow: auto;
  min-height: 0;
  transition: opacity 0.6s ease;
  transition-delay: 0.3s;
}

.sidebar.collapsed .sidebar-history {
  opacity: 0;
  pointer-events: none;
  transition-delay: 0s;
}

.sidebar-title {
  font-weight: 500;
  padding-left: 10px;
  color: var(--neutral-500);
  margin: 0;
  text-transform: uppercase;
}

.sidebar-chat-list {
  margin-top: 24.5px;
  display: flex;
  flex-direction: column;
}

.sidebar-bottom {
  margin-top: auto;
  padding-bottom: 16px;
}

.sidebar-new-chat-btn {
  width: 100%;
  height: 42px;
}

.btn-new {
  font-weight: 500;
}

.start-chat {
    white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.25s ease, width 0.25s ease;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 296px;
    background-color: var(--neutral-100);
    transform: translateX(-110%);
    transition: transform 0.25s ease;
    z-index: 20;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 296px;
  }
}
</style>
