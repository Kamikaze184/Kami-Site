<script>
export default {
    data() {
        return {
            name: '',
            value: { items: [] },
            mobile: false,
            config: false
        }
    },
    methods: {
        toggleControlsOn() {
            if (this.$refs['sheet-list-controls'].style.display == 'flex') {
                return
            }
            else {
                this.$refs['sheet-list-controls'].style.display = 'flex'
            }
        },
        toggleControlsOff() {
            this.$refs['sheet-list-controls'].style.display = 'none'
            this.config = false
        },
        toggleConfig() {
            if (this.config) {
                this.config = false
            }
            else {
                this.config = true
            }
        }
    },
    mounted() {
        this.name = this.$refs['sheet-list'].getAttribute('name')
        this.value = JSON.parse(this.$refs['sheet-list'].getAttribute('value') || '{}')

        if (window.innerWidth < 768) {
            this.mobile = true
        }
        else {
            this.mobile = false
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        })
    }
}
</script>
<template>
    <div class="sheet-list-wrapper" ref="sheet-list">
        <div class="sheet-list" @click="toggleControlsOn()" v-if="!config">
            <div class="sheet-list-header">
                <textarea :value="name" placeholder="Insira um nome" />
            </div>
            <div class="sheet-list-body">
                <div class="sheet-list-body-item" v-for="item of value.items" :key="item">
                    <input type="number" :value="item.quantity">
                    <input type="text" :value="item.name">
                    <img src="../../assets/img/trash.svg">
                </div>
                <img class="sheet-list-body-add-item" src="../../assets/img/plus.svg">
            </div>
            <div class="sheet-list-footer" v-if="mobile">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-list-config" v-else>
            <div class="sheet-list-config-item">
                <p>Seção</p>
                <select>
                    <option value="1">Seção 1</option>
                    <option value="2">Seção 2</option>
                    <option value="3">Seção 3</option>
                </select>
            </div>
            <div class="sheet-list-config-item">
                <p>Posição</p>
                <div class="sheet-list-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg">
                    <input type="number" :value="1" disabled />
                    <img src="../../assets/img/navigateIcon.svg">
                </div>
            </div>
        </div>
        <div class="sheet-list-controls" ref="sheet-list-controls">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
    </div>
</template>
<style>
.sheet-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 19em;
    height: 10em;
    color: var(--text);
    margin: 5px 5px;
}

.sheet-list,
.sheet-list-config {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    height: 10em;
    width: 15em;
    color: var(--text);
    position: relative;
}

.sheet-list-config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    padding: 0;
    width: 100%;
}

.sheet-list-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
}

.sheet-list-config-item input,
.sheet-list-config-item select {
    margin: 0;
    padding: 5px 5px;
    width: 10em;
    height: 2em;
    border: none;
    border-radius: 5px;
    background-color: var(--background);
    color: var(--text);
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
    outline: none;
}

.sheet-list-config-item input {
    width: 3em;
    height: 2em;
    text-align: center;
    font-size: 1.2em;
    -webkit-appearance: none;
}

.sheet-list-config-item input::-webkit-outer-spin-button,
.sheet-list-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-list-config-item input[type=number] {
    -moz-appearance: textfield;
}

.sheet-list-config-item-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
}

.sheet-list-config-item-row img {
    width: 2em;
    height: 2em;
    margin: 0 5px;
    cursor: pointer;
    filter: var(--background-filter);
}

.sheet-list-config-item-row img:hover {
    filter: var(--background-filter-hover);
}

.sheet-list-config-item-row img:first-of-type {
    rotate: 180deg;
}

.sheet-list-controls {
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    width: 3em;
    height: 10em;
}

.sheet-list-controls img {
    width: 95%;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 10;
}

.sheet-list-controls img:hover {
    background-color: var(--secondary);
}

.sheet-list-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 3.5em;
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
    position: relative;
}

.sheet-list-header textarea {
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    text-align: center;
    font-weight: bold;
    font-size: 1.35em;
    color: var(--text);
    resize: none;
    outline: none;
    overflow-y: auto;
}

.sheet-list-header textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-list-header textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-list-header textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-list-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-weight: bold;
    margin: 0;
    padding: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.sheet-list-body-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 2em;
    box-sizing: border-box;
    text-align: center;
    font-weight: bold;
    margin: 7px;
    padding: 5px;
}

.sheet-list-body-item input {
    background-color: var(--background);
    border: none;
    text-align: center;
    font-weight: bold;
    color: var(--text);
    resize: none;
    outline: none;
    overflow-y: auto;
}

.sheet-list-body-item input:nth-child(1) {
    width: 3em;
    height: 2em !important;
    font-size: 1.2em;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.sheet-list-body-item input:nth-child(1)::-webkit-outer-spin-button,
.sheet-list-body-item input:nth-child(1)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-list-body-item input:nth-child(1)[type=number] {
    -moz-appearance: textfield;
}

.sheet-list-body-item input:nth-child(2) {
    width: 100%;
    height: 2em !important;
    font-size: 1.2em;
    border: none;
    margin: 0 3px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.sheet-list-body-item img,
.sheet-list-body-add-item {
    width: 1.5em;
    height: 1.5em;
    margin: 0;
    padding: 5px;
    border: 2px solid var(--background);
    background-color: var(--primary);
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    border-radius: 50%;
}

.sheet-list-body-add-item {
    margin: 5px;
}

.sheet-list-body-item img:hover,
.sheet-list-body-add-item:hover {
    background-color: var(--secondary);
}

.sheet-list-body::placeholder {
    color: var(--text);
    font-size: 0.8em;
    opacity: 0.5;
}

.sheet-list-body::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-list-body::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.sheet-list-body::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-list-footer {
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