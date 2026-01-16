<template>
    <div class="main-content">
        <img :src="BackgroundMain" alt="BackgroundMain" class="content-accent" />
        <div class="main-card">
            <img :src="BackgroundChat" alt="BackgroundChat" class="card-accent" />
            <h2>Welcome back, Mauro</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed</p>

            <div class="box-wrapper">
                <input class="box-wrapper-input" type="text" placeholder="How can I help you?" />
                <button class="box-wrapper-button">
                    <img :src="SendIcon" alt="Send" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import SendIcon from '@/assets/icons/Send.svg';
import BackgroundChat from '@/assets/icons/BackgroundChat.png';
import BackgroundMain from '@/assets/icons/BackgroundMain.png';
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
}

.main-card>*:not(.card-accent) {
    position: relative;
    z-index: 1;
}

.main-card>h2,
.main-card>p,
.main-card>.box-wrapper {
    position: relative;
    z-index: 1;
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
    border: 1px solid rgba(227, 230, 234, 1);
    border-radius: 16px;
    box-shadow: 0px 2px 4px 0px rgba(25, 33, 61, 0.08);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
}

.main-card h2 {

    font-size: 22px;
    font-weight: 500;
    margin: 0;
    color: #19213D;

}

.main-card p {
    font-weight: 400;
    font-size: 14px;
    color: #666F8D;
    margin-top: 6px;
    margin-bottom: 24px;
}

.box-wrapper {
    max-width: 400px;
    width: 100%;
    align-items: center;
    padding: 8px;
    border: 1px solid #D1D5DB;
    border-radius: 12px;
    background: #fff;
    display: flex;
    gap: 8px;
    transition: transform 0.12s ease, filter 0.12s ease;
}

.box-wrapper-button:hover {
    filter: brightness(1.03);
}

.box-wrapper-button:active {
    transform: translateY(1px);
}

.box-wrapper-input {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #666F8D;

}

.box-wrapper-input:focus {
    outline: none;
}

.box-wrapper-button {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        linear-gradient(180deg,
            rgba(43, 122, 251, 1) 0%,
            rgba(33, 116, 253, 1) 100%) padding-box,
        linear-gradient(180deg,
            rgba(23, 75, 210, 1) 0%,
            rgba(27, 90, 194, 1) 100%) border-box;
    border: 1px solid transparent;

    box-shadow:
        inset 0px 2px 1px rgba(255, 255, 255, 0.22),
        inset 0px -2px 0.3px rgba(14, 56, 125, 0.18),
        0px 2px 5px rgba(20, 88, 201, 0.17);
}
</style>