<template>
  <div class="main-content">
    <img :src="BackgroundMain" alt="BackgroundMain" class="content-accent" />
    <div class="main-card">
      <img :src="BackgroundChat" alt="BackgroundChat" class="card-accent" />
      <div class="main-card-inner">
        <h2 class="d-4">Welcome back, Mauro</h2>
        <p class="p-small">Lorem ipsum dolor sit amet consectetur adipisicing elit sed</p>
        <ChatComposer variant="compact" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackgroundChat from '@icons/BackgroundChat.png';
import BackgroundMain from '@icons/BackgroundMain.png';
import ChatComposer from './ChatComposer.vue';
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
