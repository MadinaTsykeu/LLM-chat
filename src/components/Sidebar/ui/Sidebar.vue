<template>
  <aside class="sidebar" :class="{
    'mobile-open': isOpen && isMobile,
    'sidebar--collapsed': isCollapsedDesktop
  }">
    <SidebarHeader
      :mobileOpen="isOpen"
      @closeSidebar="close"
    />

    <div class="sidebar-history">
      <h2 class="sidebar-title d-1">chat history</h2>
      <div class="sidebar-chat-list">
        <SidebarChatButton>Chat 1</SidebarChatButton>
        <SidebarChatButton>Chat 2</SidebarChatButton>
      </div>
    </div>

    <div class="sidebar-bottom">
      <UiButton
        variant="primary"
        size="sm"
        class="sidebar-new-chat-btn d-2"
      >
        <template #left>
          <ElementIcon fill="currentColor" />
        </template>

        <h3 class="d-2 start-chat">Start new chat</h3>
      </UiButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
import ElementIcon from '@icons/Element.svg';
import UiButton from '@/components/shared/UiButton.vue';
import SidebarHeader from './SidebarHeader.vue';
import SidebarChatButton from './SidebarChatButton.vue';
import { useSidebarState } from '@/components/Sidebar'
import { computed, onMounted, watch } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const { isOpen, close, open } = useSidebarState()
const { md } = useAppBreakpoints()

const isMobile = computed(() => !md.value)
const isCollapsedDesktop = computed(() => !isOpen.value && !isMobile.value)

onMounted(() => {
  if (isMobile.value) {
    close()
  } else {
    open()
  }
})

watch(isMobile, (mobile) => {
  if (mobile) {
    close()
  } else {
    open()
  }
})
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

.sidebar-history {
  flex: 1;
  margin-top: 40px;
  overflow: auto;
  min-height: 0;
  transition: opacity 0.6s ease;
  transition-delay: 0.3s;
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
  transition:
    opacity 0.25s ease,
    width 0.25s ease;
}

.sidebar.sidebar--collapsed {
  width: 70px;
}

.sidebar.sidebar--collapsed .sidebar-history {
  opacity: 0;
  pointer-events: none;
}

.sidebar.sidebar--collapsed .sidebar-new-chat-btn {
  width: var(--btn-height-sm);
  height: var(--btn-height-sm);
  align-self: center;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.sidebar--collapsed .sidebar-bottom {
  display: flex;
  justify-content: center;
}

.sidebar.sidebar--collapsed .start-chat {
  display: none;
}

.sidebar.sidebar--collapsed .sidebar-new-chat-btn :deep(.ui-btn__icon--left) {
  margin: 0 !important;
}

.sidebar.sidebar--collapsed .sidebar-new-chat-btn :deep(.ui-btn__text) {
  display: none !important;
}

.sidebar.sidebar--collapsed .sidebar-new-chat-btn :deep(svg) {
  display: block;
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
}
</style>
