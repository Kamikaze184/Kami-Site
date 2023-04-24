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
            if (this.$refs['sheet-number-controls'].style.display == 'flex') {
                return
            }
            else {
                this.$refs['sheet-number-controls'].style.display = 'flex'
            }
        },
        toggleControlsOff() {
            this.$refs['sheet-number-controls'].style.display = 'none'
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
        this.name = this.$refs['sheet-number'].getAttribute('name')
        this.value = this.$refs['sheet-number'].getAttribute('value')

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
    <div class="sheet-number-wrapper" ref="sheet-number">
        <div class="sheet-number" @click="toggleControlsOn()" v-if="!config">
            <div class="sheet-number-header">
                <textarea :value="name" placeholder="Insira um nome" />
            </div>
            <div class="sheet-number-body">
                <textarea :value="value" placeholder="Insira um valor" />
            </div>
            <div class="sheet-number-footer" v-if="mobile">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-number-config" v-else>
            <div class="sheet-number-config-item">
                <p>Sessão</p>
                <select>
                    <option value="1">Sessão 1</option>
                    <option value="2">Sessão 2</option>
                    <option value="3">Sessão 3</option>
                </select>
            </div>
            <div class="sheet-number-config-item">
                <p>Posição</p>
                <input type="number" :value="1" />
            </div>
        </div>
        <div class="sheet-number-controls" ref="sheet-number-controls">
            <img class="sheet-controls-config" src="../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
    </div>
</template>
<style>
.sheet-number-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 19em;
    height: 10em;
    color: var(--text);
    cursor: pointer;
    margin: 0px 5px;
}

.sheet-number,
.sheet-number-config {
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
    position: relative;
}

.sheet-number-config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    padding: 0;
}

.sheet-number-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
}

.sheet-number-config-item input, .sheet-number-config-item select {
    margin: 0;
    padding: 5px 5px;
    width: 10em;
    height: 1.5em;
    border: none;
    border-radius: 5px;
    background-color: var(--background);
    color: var(--text);
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
    outline: none;
}

.sheet-number-controls {
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    width: 3em;
    height: 10em;
}

.sheet-number-controls img {
    width: 95%;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 10;
}

.sheet-number-controls img:hover {
    background-color: var(--secondary);
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
    position: relative;
}

.sheet-number-header textarea {
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
    color: var(--text);
    resize: none;
    outline: none;
    overflow-y: auto;
}

.sheet-number-header textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-number-header textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.sheet-number-header textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
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

.sheet-number-body textarea {
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    text-align: center;
    font-weight: bold;
    font-size: 2.5em;
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

.sheet-number-body textarea::placeholder {
    color: var(--text);
    font-size: 0.8em;
    opacity: 0.5;
}

.sheet-number-body textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-number-body textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.sheet-number-body textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-number-footer {
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