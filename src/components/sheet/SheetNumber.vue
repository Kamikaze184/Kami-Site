<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            name: '',
            value: '',
            section: 0,
            position: 0,
            mobile: false,
            config: false,
            validationErrors: {
                name: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome do atributo não pode ser vazio',
                        tooLong: 'O nome do atributo não pode ter mais de 32 caracteres',
                        invalidChars: 'O nome do atributo não pode conter caracteres especiais',
                        alreadyExists: 'O nome do atributo já existe',
                    }
                },
                value: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor do atributo não pode ser vazio',
                        tooLong: 'O valor do atributo não pode ter mais de 1024 caracteres',
                        invalidChars: 'O valor do atributo só pode conter números',
                    }
                }
            },
            confirmComponentRemove: false
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
        },
        nextPosition() {
            if (this.position < this.maxPosition) {
                this.position++
            }
            else {
                this.position = 0
            }
        },
        previousPosition() {
            if (this.position > 0) {
                this.position--
            }
            else {
                this.position = this.maxPosition
            }
        },
        validateName() {
            const name = this.name

            if (name == '') {
                this.validationErrors.name.state = true
                this.validationErrors.name.actualMessage = this.validationErrors.name.messages.empty
            }
            else if (name.length > 32) {
                this.validationErrors.name.state = true
                this.validationErrors.name.actualMessage = this.validationErrors.name.messages.tooLong
            }
            else if (!name.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                this.validationErrors.name.state = true
                this.validationErrors.name.actualMessage = this.validationErrors.name.messages.invalidChars
            }
            else {
                this.validationErrors.name.state = false
                this.validationErrors.name.actualMessage = ''
            }
        },
        validateValue() {
            const value = this.value

            if (value == '') {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.empty
            }
            else if (value.length > 1024) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.tooLong
            }
            else if (!value.match(/^(-?[0-9]+)$/gim)) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.invalidChars
            }
            else {
                this.validationErrors.value.state = false
                this.validationErrors.value.actualMessage = ''
            }
        },
    },
    mounted() {
        this.name = this.$refs['sheet-number'].getAttribute('name')
        this.value = this.$refs['sheet-number'].getAttribute('value')

        const position = this.$refs['sheet-number'].getAttribute('position')

        this.section = position.split('-')[0]
        this.position = position.split('-')[1]

        eventEmitter.on('set-sections', (sections) => {
            this.sections = sections
        })
        eventEmitter.emit('get-sections')

        eventEmitter.on('set-max-position', (positions) => {
            this.maxPosition = positions
        })
        eventEmitter.emit('get-max-position')

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
    },
    watch: {
        name() {
            this.name = this.name.trim()
            this.validateName()
            eventEmitter.emit('update-component', this.$refs['sheet-number'], this.name, this.value)
        },
        value() {
            this.value = this.value.trim()
            this.validateValue()
            eventEmitter.emit('update-component', this.$refs['sheet-number'], this.name, this.value)
        },
        section() {
            eventEmitter.emit('move-component', this.$refs['sheet-number'], this.section, this.position)
        },
        position() {
            eventEmitter.emit('move-component', this.$refs['sheet-number'], this.section, this.position)
        },
        validationErrors: {
            handler() {
                if (this.validationErrors.name.state || this.validationErrors.value.state) {
                    const errors = {
                        name: {
                            state: this.validationErrors.name.state,
                            actualMessage: this.validationErrors.name.actualMessage
                        },
                        value: {
                            state: this.validationErrors.value.state,
                            actualMessage: this.validationErrors.value.actualMessage
                        }
                    }
                    eventEmitter.emit('invalid-component', this.$refs['sheet-number'], errors)
                }
                else {
                    eventEmitter.emit('valid-component', this.$refs['sheet-number'])
                }
            },
            deep: true
        }
    }

}
</script>
<template>
    <div class="sheet-number-wrapper" ref="sheet-number">
        <div class="sheet-number" @click="toggleControlsOn()" v-if="!config">
            <div class="sheet-number-header">
                <textarea :value="name" placeholder="Insira um nome" ref="sheet-number-name"
                    @keyup="name = $refs['sheet-number-name'].value" />
            </div>
            <div class="sheet-number-body">
                <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                <textarea :value="value" placeholder="Insira um valor" ref="sheet-number-value"
                    @keyup="value = $refs['sheet-number-value'].value" />
            </div>
            <div class="sheet-number-footer" v-if="mobile">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-number-config" v-else>
            <div class="sheet-number-config-item">
                <p>Seção</p>
                <select :value="section" @change="section = $refs['sheet-number-config-section'].value"
                    ref="sheet-number-config-section">
                    <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}</option>
                </select>
            </div>
            <div class="sheet-number-config-item">
                <p>Posição</p>
                <div class="sheet-number-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                    <input type="number" :value="position" disabled />
                    <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                </div>
            </div>
        </div>
        <div class="sheet-number-controls" ref="sheet-number-controls">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
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
    margin: 5px 5px;
}

.sheet-number,
.sheet-number-config {
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

.sheet-number-config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    padding: 0;
    width: 100%;
}

.sheet-number-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
}

.sheet-number-config-item input,
.sheet-number-config-item select {
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

.sheet-number-config-item input {
    width: 3em;
    height: 2em;
    text-align: center;
    font-size: 1.2em;
    -webkit-appearance: none;
}

.sheet-number-config-item input::-webkit-outer-spin-button,
.sheet-number-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-number-config-item input[type=number] {
    -moz-appearance: textfield;
}

.sheet-number-config-item-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
}

.sheet-number-config-item-row img {
    width: 2em;
    height: 2em;
    margin: 0 5px;
    cursor: pointer;
    filter: var(--background-filter);
}

.sheet-number-config-item-row img:hover {
    filter: var(--background-filter-hover);
}

.sheet-number-config-item-row img:first-of-type {
    rotate: 180deg;
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

.sheet-number-header textarea {
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

.sheet-number-header textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-number-header textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-number-header textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-number-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-weight: bold;
    margin: 0;
    padding: 5px;
}

.sheet-number-body p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1em;
    color: var(--cancel);
    text-align: center;
}

.sheet-number-body textarea {
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    text-align: center;
    font-weight: bold;
    font-size: 3em;
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