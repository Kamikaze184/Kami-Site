<script>
export default {
    name: 'NotFound',
    methods: {
        goHome() {
            window.location.href = '/'
        }
    }
}
</script>
<template>
    <div class="not-found">
        <h1>Página não encontrada</h1>
        <button @click="goHome()">Voltar para página inicial</button>
    </div>
</template>
<style>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10%
}

.not-found h1 {
    font-size: 3em;
    margin-bottom: 0.5em;
    color: var(--text);
}

.not-found button {
    padding: 0.8em 1.5em;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--primary);
    color: var(--text);
    font-size: 1.2em;
    font-weight: 700;
    cursor: pointer;
}

.not-found button:hover {
    background-color: var(--secondary);
}
</style>