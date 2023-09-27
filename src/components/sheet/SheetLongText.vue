<script>
export default {
    data() {
        return {
            name: '',
            value: '',
            mobile: false,
            config: false
        }
    },
    methods: {
        toggleControlsOn() {
            if (this.$refs['sheet-longtext-controls'].style.display == 'flex') {
                return
            }
            else {
                this.$refs['sheet-longtext-controls'].style.display = 'flex'
            }
        },
        toggleControlsOff() {
            this.$refs['sheet-longtext-controls'].style.display = 'none'
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
        this.name = this.$refs['sheet-longtext'].getAttribute('name')
        this.value = this.$refs['sheet-longtext'].getAttribute('value')

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
    <div class="sheet-longtext-wrapper" ref="sheet-longtext">
        <div class="sheet-longtext" @click="toggleControlsOn()" v-if="!config">
            <div class="sheet-longtext-header">
                <textarea :value="name" placeholder="Insira um nome" />
            </div>
            <div class="sheet-longtext-body">
                <textarea :value="value" placeholder="Insira um valor" />
            </div>
            <div class="sheet-longtext-footer" v-if="mobile">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-longtext-config" v-else>
            <div class="sheet-longtext-config-item">
                <p>Seção</p>
                <select>
                    <option value="1">Seção 1</option>
                    <option value="2">Seção 2</option>
                    <option value="3">Seção 3</option>
                </select>
            </div>
            <div class="sheet-longtext-config-item">
                <p>Posição</p>
                <div class="sheet-longtext-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg">
                    <input type="number" :value="1" disabled/>
                    <img src="../../assets/img/navigateIcon.svg">
                </div>
            </div>
        </div>
        <div class="sheet-longtext-controls" ref="sheet-longtext-controls">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
    </div>
</template>
<style>
.sheet-longtext-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 19em;
    height: 10em;
    color: var(--text);
    margin: 5px 5px;
}

.sheet-longtext,
.sheet-longtext-config {
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

.sheet-longtext-config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    padding: 0;
    width: 100%;
}

.sheet-longtext-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
}

.sheet-longtext-config-item input,
.sheet-longtext-config-item select {
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

.sheet-longtext-config-item input {
    width: 3em;
    height: 2em;
    text-align: center;
    font-size: 1.2em;
    -webkit-appearance: none;
}

.sheet-longtext-config-item input::-webkit-outer-spin-button,
.sheet-longtext-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-longtext-config-item input[type=number] {
    -moz-appearance: textfield;
}

.sheet-longtext-config-item-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
}

.sheet-longtext-config-item-row img {
    width: 2em;
    height: 2em;
    margin: 0 5px;
    cursor: pointer;
    filter: var(--background-filter);
}

.sheet-longtext-config-item-row img:hover {
    filter: var(--background-filter-hover);
}

.sheet-longtext-config-item-row img:first-of-type {
    rotate: 180deg;
}

.sheet-longtext-controls {
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    width: 3em;
    height: 10em;
}

.sheet-longtext-controls img {
    width: 95%;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 10;
}

.sheet-longtext-controls img:hover {
    background-color: var(--secondary);
}

.sheet-longtext-header {
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

.sheet-longtext-header textarea {
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

.sheet-longtext-header textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-longtext-header textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.sheet-longtext-header textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-longtext-body {
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

.sheet-longtext-body textarea {
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    text-align: justify;
    font-weight: bold;
    font-size: 1.3em;
    color: var(--text);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: wrap;
    word-wrap: break-word;
    word-break: break-all;
    line-break: auto;
    resize: none;
    outline: none;
    overflow-y: auto;
}

.sheet-longtext-body textarea::placeholder {
    color: var(--text);
    font-size: 0.8em;
    opacity: 0.5;
}

.sheet-longtext-body textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-longtext-body textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-longtext-body textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-longtext-footer {
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