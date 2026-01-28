<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-user">
        <Avatar />
        <h3 class="d-2">Mauro Sicard</h3>
      </div>
      <div class="sidebar-actions">
        <SettingsIcon />
        <LeftIcon />
      </div>
    </div>
    <div class="sidebar-history">
      <h2 class="sidebar-title d-1">chat history</h2>
      <ul class="sidebar-chat-list">
        <li class="sidebar-chat-item">
          <button class="btn d-2" type="button">Chat 1</button>
        </li>
        <li class="sidebar-chat-item">
          <button class="btn d-2" type="button">Chat 2</button>
        </li>
      </ul>
    </div>
    <div class="sidebar-bottom">
      <UiButton variant="primary" size="sm" class="sidebar-new-chat-btn d-2">
        <template #left>
          <ElementIcon fill="currentColor" />
        </template>
        Start new chat
      </UiButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Avatar from '@/assets/icons/Avatar.svg';
import SettingsIcon from '@/assets/icons/Settings.svg';
import LeftIcon from '@/assets/icons/Left.svg';
import UiButton from './shared/UiButton.vue';
import ElementIcon from '@/assets/icons/Element.svg';
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 296px;
  padding: 24px 24px 24px 14px;
  box-sizing: border-box;
}

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

.sidebar-actions {
  display: flex;
  gap: 12px;
}

.sidebar-history {
  flex: 1;
  margin-top: 40px;
  overflow: auto;
  min-height: 0;
}

.sidebar-title {
  font-weight: 500;
  padding-left: 10px;
  color: var(--neutral-500);
  margin: 0;
  text-transform: uppercase;
}

.sidebar-chat-list {
  padding: 0;
  margin: 0;
  padding-left: 12px;
  margin-top: 24.5px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
}

.btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-weight: 400;
  color: var(--neutral-600);
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
</style>
