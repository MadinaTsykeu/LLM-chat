<template>
  <div class="main-content">
    <img :src="BackgroundMain" alt="BackgroundMain" class="content-accent" />
    <div class="main-card">
      <img :src="BackgroundChat" alt="BackgroundChat" class="card-accent" />
      <div class="main-card-inner">
        <h2 class="d-4">Welcome back, Mauro</h2>
        <p class="p-small">Lorem ipsum dolor sit amet consectetur adipisicing elit sed</p>

        <div class="box-wrapper">
          <input class="box-wrapper-input p-small" type="text" placeholder="How can I help you?" />
          <UiButton variant="primary" size="df" class="box-send-btn">
            <template #left>
              <SendIcon :width="20" :height="20" fill="currentColor" />
            </template>
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SendIcon from '@icons/Send.svg';
import BackgroundChat from '@icons/BackgroundChat.png';
import BackgroundMain from '@icons/BackgroundMain.png';
import UiButton from '../shared/UiButton.vue';
</script>

<style scoped>
.main-content {
  position: relative;
  overflow: hidden;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40px 24px;
}

.content-accent {
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%);
  width: 100%;
  pointer-events: none;
  z-index: 0;
}

.card-accent {
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%);
  width: 700px;
  height: auto;
  z-index: 0;
}

.main-card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-card {
  position: relative;
  z-index: 2;
  overflow: visible;
  isolation: isolate;
  width: 100%;
  max-width: 774px;
  height: auto;
  min-height: 234px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 32px;
  box-sizing: border-box;
  border: 1px solid var(--neutral-400);
  border-radius: 16px;
  box-shadow: var(--shadow-neutral-regular);
  background: var(--light-400);
  backdrop-filter: blur(8px);
}

.main-card h2 {
  font-weight: 500;
  color: var(--neutral-800);
  margin: 0;
}

.main-card p {
  font-weight: 400;
  color: var(--neutral-600);
  margin-top: 6px;
  margin-bottom: 24px;
}

.box-wrapper {
  max-width: 400px;
  width: 100%;
  align-items: center;
  padding: 8px;
  border: 1px solid var(--neutral-400);
  border-radius: 12px;
  background: var(--neutral-100);
  display: flex;
  gap: 8px;
  transition:
    transform 0.12s ease,
    filter 0.12s ease;
}

.box-wrapper-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-600);
}

.box-wrapper-input:focus {
  outline: none;
}

.box-send-btn {
  width: var(--btn-height-df);
  padding-left: 0;
  padding-right: 0;
}

@media (max-width: 1100px) {
  .main-content {
    padding: 24px 16px;
  }

  .main-card {
    padding: 24px 16px;
  }

  .card-accent {
    width: 500px;
  }
}

@media (max-width: 768px) {
  .card-accent {
    width: 400px;
  }
}

@media (max-width: 390px) {
  .main-content {
    padding: 20px 12px;
  }

  .main-card {
    padding: 20px 12px;
  }

  .card-accent {
    width: 350px;
  }
}
</style>
