<template>
  <div v-if="isOpen" class="overlay" @click.self="close" role="dialog" aria-modal="true">
    <div class="modal">
      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-text">{{ message }}</p>

      <div class="modal-actions">
        <UiButton variant="primary" @click="close">Close</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppErrorModal } from '@/components/AppErrorModal';
import UiButton from '../shared/UiButton.vue';

const { isOpen, title, message, close } = useAppErrorModal();
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  box-sizing: border-box;
}

.modal {
  width: 100%;
  max-width: 520px;
  background: var(--neutral-100);
  border: 1px solid var(--neutral-300);
  box-shadow: var(--shadow-neutral-regular);
  border-radius: 16px;
  padding: 20px;
  margin-top: 80px;
  box-sizing: border-box;
}

.modal-title {
  margin: 0 0 8px 0;
  color: var(--neutral-700);
  font-weight: 600;
}

.modal-text {
  margin: 0;
  color: var(--neutral-600);
  white-space: pre-wrap;
}

.modal-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 480px) {
  .overlay {
    padding: 16px;
  }

  .modal {
    padding: 16px;
    margin-top: 48px;
  }
}
</style>
