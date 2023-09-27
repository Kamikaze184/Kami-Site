<script>
export default {
    data() {
        return {
            value: '',
            mobile: false,
            config: false
        }
    },
    methods: {
        toggleControlsOn() {
            if (this.$refs['sheet-image-controls'].style.display == 'flex') {
                return
            }
            else {
                this.$refs['sheet-image-controls'].style.display = 'flex'
            }
        },
        toggleControlsOff() {
            this.$refs['sheet-image-controls'].style.display = 'none'
            this.expandImage(true)
            this.config = false
        },
        toggleConfig() {
            if (this.config) {
                this.config = false
            }
            else {
                this.config = true
            }
        },
        expandImage(forceClose = false) {
            try {
                if (this.$refs['sheet-image-body-img'].classList.contains('sheet-image-body-img-expanded') || forceClose) {
                    this.$refs['sheet-image-body-img'].classList.remove('sheet-image-body-img-expanded')
                }
                else {
                    this.$refs['sheet-image-body-img'].classList.add('sheet-image-body-img-expanded')
                }
            }
            catch (err) { }
        }
    },
    mounted() {
        this.value = this.$refs['sheet-image'].getAttribute('value')

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
    <div class="sheet-image-wrapper" ref="sheet-image">
        <div class="sheet-image" @click="toggleControlsOn()" v-if="!config">
            <div class="sheet-image-body">
                <img :src="value" ref="sheet-image-body-img" @click="expandImage()">
            </div>
            <div class="sheet-image-footer" @click="expandImage()">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-image-config" v-else>
            <div class="sheet-image-config-item">
                <p>Link da imagem</p>
                <input class="sheet-image-config-link" type="text" :value="value" />
            </div>
            <div class="sheet-image-config-item">
                <p>Seção</p>
                <select>
                    <option value="1">Seção 1</option>
                    <option value="2">Seção 2</option>
                    <option value="3">Seção 3</option>
                </select>
            </div>
            <div class="sheet-image-config-item">
                <p>Posição</p>
                <div class="sheet-image-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg">
                    <input type="number" :value="1" disabled />
                    <img src="../../assets/img/navigateIcon.svg">
                </div>
            </div>
        </div>
        <div class="sheet-image-controls" ref="sheet-image-controls">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
    </div>
</template>
<style>
.sheet-image-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 19em;
    height: 10em;
    color: var(--text);
    margin: 5px 5px;
}

.sheet-image,
.sheet-image-config {
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

.sheet-image-config {
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
}

.sheet-image-config::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-image-config::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.sheet-image-config::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-image-config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    padding: 0;
    width: 100%;
}

.sheet-image-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
}

.sheet-image-config-item input,
.sheet-image-config-item select {
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

.sheet-image-config-item input {
    width: 90% !important;
    height: 2em !important;
    font-size: 1em !important;
}

.sheet-image-config-link {
    width: 100%;
    height: 2em;
}

.sheet-image-config-item input::-webkit-outer-spin-button,
.sheet-image-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-image-config-item input[type=number] {
    -moz-appearance: textfield;
}

.sheet-image-config-item-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
}

.sheet-image-config-item-row img {
    width: 2em;
    height: 2em;
    margin: 0 5px;
    cursor: pointer;
    filter: var(--background-filter);
}

.sheet-image-config-item-row img:hover {
    filter: var(--background-filter-hover);
}

.sheet-image-config-item-row img:first-of-type {
    rotate: 180deg;
}

.sheet-image-controls {
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    width: 3em;
    height: 10em;
}

.sheet-image-controls img {
    width: 95%;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 10;
}

.sheet-image-controls img:hover {
    background-color: var(--secondary);
}

.sheet-image-body {
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

.sheet-image-body img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    border-radius: 10px !important;
    cursor: pointer;
}

.sheet-image-body-img-expanded {
    width: 22em !important;
    height: auto !important;
    object-fit: inherit !important;
    cursor: pointer;
    position: absolute;
    z-index: 5;
    top: 0;
}

.sheet-image-footer {
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
    position: absolute;
    bottom: 0;
    cursor: pointer;
}
</style>