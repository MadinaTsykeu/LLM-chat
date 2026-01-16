<template>
    <div class="main">
        <MainHeader />
        <MainCard />
    </div>
</template>

<script setup>
import MainHeader from './chats/MainHeader.vue';
import MainCard from './chats/MainCard.vue';

</script>

<style scoped>
.main {
    position: relative;
    overflow: hidden;
    height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    padding-top: 16px;
    background-color: #FFFFFF;
    border: 1px solid #F0F2F5;
    box-shadow: 0px 1px 3px 0px #19213D1A;
}
</style>