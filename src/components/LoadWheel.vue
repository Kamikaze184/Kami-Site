<script></script>

<template>
    <div class="loading"></div>
</template>

<style>
.loading {
    content: " ";
    display: block;
    width: 50px;
    height: 50px;
    margin: 0;
    border-radius: 50%;
    border: 10px solid var(--primary);
    border-color: var(--primary) transparent var(--primary) transparent;
    animation: load 2s linear infinite;
}

@keyframes load {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>