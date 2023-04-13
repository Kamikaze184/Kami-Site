<script>
export default {
    data() {
        return {
            name: '',
            value: '',
            mobile: false
        }
    },
    methods: {
    },
    mounted() {
        this.name = this.$refs['sheet-number'].getAttribute('name')
        this.value = this.$refs['sheet-number'].getAttribute('value')

        if (window.innerWidth > 768) {
            this.mobile = false
        }
        else {
            this.mobile = true
        }
    }
}
</script>
<template>
    <div class="sheet-number" ref="sheet-number">
        <div class="sheet-number-header">
            <p>{{ name }}</p>
        </div>
        <div class="sheet-number-body">
            <h1>{{ value }}</h1>
        </div>
        <div class="sheet-number-footer" v-if="mobile">
            <p>Clique para expandir</p>
        </div>
    </div>
</template>
<style>
.sheet-number {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    height: 10em;
    width: 15em;
    color: var(--text);
}

.sheet-number-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4em;
    background-color: var(--background);
    box-sizing: border-box;
    border: 2px solid var(--primary);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-align: center;
    font-weight: bold;
    margin: 0;
    padding: 5px;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: wrap;
    word-wrap: break-word;
    word-break: break-all;
    line-break: auto;
    position: relative;
}

.sheet-number-header p {
    margin: 0;
}

.sheet-number-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-weight: bold;
    margin: 0;
    padding: 5px;
}

.sheet-number-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2em;
    background-color: var(--background);
    box-sizing: border-box;
    border: 2px solid var(--primary);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 0.8em;
    margin: 0;
    padding: 5px;
}
</style>