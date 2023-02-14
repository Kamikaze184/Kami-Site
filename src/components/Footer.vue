<script>
export default {
    data() {
        return {}
    },
    methods: {
    }
}
</script>

<template>
    <div id="footer">
        <h4>{{ new Date().getFullYear() }} © Kami</h4>
    </div>
</template>

<style>
#footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--primary);
    border-top: 2px solid var(--background);
    height: 40px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-bottom: 0px;
    z-index: 10;
    color: var(--text);
}
</style>