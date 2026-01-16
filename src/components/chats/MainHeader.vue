<template>
    <header class="main-header">
        <h3 class="main-header-button">Chats</h3>
        <button class="new-chat-button">
            <span class="btn-plus">
                <img :src="Element" alt="Plus" />
            </span>
            <span>New Chat</span>
        </button>
    </header>
</template>

<script setup>
import Element from '@/assets/icons/Element.svg';

</script>

<style scoped>
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    padding-left: 24px;
    padding-right: 24px;
    border-bottom: 1px solid #E3E6EA;
}

.main-header-button {
    font-weight: 500;
    font-size: 16px;
}

.new-chat-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3.5px;
    width: 103px;
    height: 32px;
    border-radius: 8px;
    padding: 8px 16px;
    background: linear-gradient(180deg, #2B7AFB 0%, #2174FD 100%, #213BFD 100%);
    border: 1px solid;
    border-image-source: linear-gradient(180deg, #174BD2 0%, #1B5AC2 100%);
    color: #FFFFFF;
    transition: transform 0.12s ease, filter 0.12s ease;
}

.new-chat-button:hover {
    filter: brightness(1.03);
}

.new-chat-button:active {
    transform: translateY(1px);
}

.new-chat-button span {
    font-size: 12px;
    font-weight: 500;
}

.btn-plus {
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-plus img {
    width: 9px;
    height: 9px;
}
</style>