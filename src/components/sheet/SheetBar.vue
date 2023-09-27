<script>
export default {
    data() {
        return {
            name: '',
            value: { actual: 0, max: 0 },
            mobile: false,
            config: false
        }
    },
    methods: {
        toggleControlsOn() {
            if (this.$refs['sheet-bar-controls'].style.display == 'flex') {
                return
            }
            else {
                this.$refs['sheet-bar-controls'].style.display = 'flex'
            }
        },
        toggleControlsOff() {
            this.$refs['sheet-bar-controls'].style.display = 'none'
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
        this.name = this.$refs['sheet-bar'].getAttribute('name')
        this.value = JSON.parse(this.$refs['sheet-bar'].getAttribute('value') || '{}')

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
    <div class="sheet-bar-wrapper" ref="sheet-bar">
        <div class="sheet-bar" @click="toggleControlsOn()" v-if="!config">
            <div class="sheet-bar-header">
                <input type="text" :value="name" class="sheet-bar-title">
                <h4>{{ `${value.actual}/${value.max}` }}</h4>
            </div>
            <div class="sheet-bar-body">
                <div class="sheet-bar-outer-display">
                    <div class="sheet-bar-inner-display" :style="{ width: ((value.actual / value.max) * 100) + '%' }"></div>
                </div>
            </div>
        </div>
        <div class="sheet-bar-config" v-else>
            <div class="sheet-bar-config-item">
                <p>Seção</p>
                <select>
                    <option value="1">Seção 1</option>
                    <option value="2">Seção 2</option>
                    <option value="3">Seção 3</option>
                </select>
            </div>
            <div class="sheet-bar-config-item">
                <p>Posição</p>
                <div class="sheet-bar-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg">
                    <input type="number" :value="1" disabled />
                    <img src="../../assets/img/navigateIcon.svg">
                </div>
            </div>
        </div>
        <div class="sheet-bar-controls" ref="sheet-bar-controls">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
    </div>
</template>
<style>
.sheet-bar-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 19em;
    height: 10em;
    color: var(--text);
    margin: 5px 5px;
}

.sheet-bar-config {
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

.sheet-bar {
    width: 15em;
}

.sheet-bar-config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    padding: 0;
    width: 100%;
}

.sheet-bar-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
}

.sheet-bar-config-item input,
.sheet-bar-config-item select {
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

.sheet-bar-config-item input {
    width: 3em;
    height: 2em;
    text-align: center;
    font-size: 1.2em;
    -webkit-appearance: none;
}

.sheet-bar-config-item input::-webkit-outer-spin-button,
.sheet-bar-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-bar-config-item input[type=number] {
    -moz-appearance: textfield;
}

.sheet-bar-config-item-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
}

.sheet-bar-config-item-row img {
    width: 2em;
    height: 2em;
    margin: 0 5px;
    cursor: pointer;
    filter: var(--background-filter);
}

.sheet-bar-config-item-row img:hover {
    filter: var(--background-filter-hover);
}

.sheet-bar-config-item-row img:first-of-type {
    rotate: 180deg;
}

.sheet-bar-controls {
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    width: 3em;
    height: 10em;
}

.sheet-bar-controls img {
    width: 95%;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 10;
}

.sheet-bar-controls img:hover {
    background-color: var(--secondary);
}

.sheet-bar-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 0;
    width: 15em;
    height: 2em;
}

.sheet-bar-value {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
}

.sheet-bar-header input {
    margin: 0;
    padding: 0;
    height: 100%;
    border: none;
    border-radius: 5px;
    background-color: transparent;
    color: var(--text);
    text-align: left !important;
    font-weight: bold;
    font-size: 1.2em;
    outline: none;
    text-align: left;
    width: 60%;
}

.sheet-bar-value input {
    margin: 0;
    padding: 0;
    height: 100%;
    border: none;
    color: var(--text);
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
    outline: none;
}

.sheet-bar-value input::-webkit-outer-spin-button,
.sheet-bar-header input::-webkit-outer-spin-button,
.sheet-bar-value input::-webkit-inner-spin-button,
.sheet-bar-header input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-bar-value input[type=number],
.sheet-bar-header input[type=number] {
    -moz-appearance: textfield;
}

.sheet-bar-header h4 {
    grid-area: divisor;
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1.2em;
    color: var(--text);
    text-align: center;
}

.sheet-bar-title {
    grid-area: title;
}

.sheet-bar-actual-value {
    grid-area: actual;
}

.sheet-bar-max-value {
    grid-area: max;
}


.sheet-bar-body {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 15em;
}

.sheet-bar-outer-display {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 95%;
    height: 1em;
    border-radius: 5px;
    background-color: var(--primary);
    border: 2px solid var(--primary);
    margin: 0;
    padding: 0;
}

.sheet-bar-inner-display {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 0%;
    height: 100%;
    border-radius: 5px;
    background-color: var(--background);
    margin: 0;
    padding: 0;
    transition: all 0.5s linear;
}</style>