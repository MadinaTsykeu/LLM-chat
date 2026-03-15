<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
}

@media (max-width: 768px) {
  .app-container {
    display: block;
  }
}
</style>
