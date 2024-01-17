<script>
import { eventEmitter } from '../../utils/EventEmitter.js'
import { validateDiceString } from '../..//utils/DiceRoller.js'

export default {
    data() {
        return {
            name: '',
            value: '',
            section: 0,
            position: 0,
            mobile: false,
            controls: false,
            config: false,
            validationErrors: {
                name: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome do componente não pode ser vazio',
                        tooLong: 'O nome do componente não pode ter mais de 32 caracteres',
                        invalidChars: 'O nome do componente não pode conter caracteres especiais',
                        alreadyExists: 'O nome do componente já existe',
                    }
                },
                value: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor do componente não pode ser vazio',
                        tooLong: 'O valor do componente não pode ter mais de 256 caracteres',
                        invalidFormat: 'O formato do valor do componente é inválido, siga o exemplo: 1d6+2',
                    }
                }
            },
            confirmComponentRemove: false,
            expanded: false,
            editMode: false,
            visualizeMode: true,
            readonly: false
        }
    },
    methods: {
        toggleControlsOn() {
            this.controls = true
        },
        toggleControlsOff() {
            this.controls = false
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
            else if (value.length > 256) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.tooLong
            }
            else if (!validateDiceString(value)) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.invalidFormat
            }
            else {
                this.validationErrors.value.state = false
                this.validationErrors.value.actualMessage = ''
            }
        },
        removeComponent() {
            eventEmitter.emit('macro-remove-component', this.$refs['macro-button'])
        },
        toggleVisualizeMode() {
            this.visualizeMode = true
            this.editMode = false
        },
        toggleEditMode() {
            this.visualizeMode = false
            this.editMode = true
        },
        roll() {
            eventEmitter.emit('macro-roll-dice', this.value, this.name)
        }
    },
    beforeMount() {
        this.mobile = window.innerWidth <= 800

        window.addEventListener('resize', () => {
            this.mobile = window.innerWidth <= 800
        })
    },
    mounted() {
        this.name = this.$refs['macro-button'].getAttribute('name')
        this.value = this.$refs['macro-button'].getAttribute('value')

        const position = this.$refs['macro-button'].getAttribute('position')

        this.section = position.split('-')[0]
        this.position = position.split('-')[1]

        this.readonly = this.$refs['macro-button'].getAttribute('readonly') == ''

        eventEmitter.on('macro-set-sections', (sections) => {
            this.sections = sections
        })
        eventEmitter.emit('macro-get-sections')

        eventEmitter.on('macro-set-max-position', (positions) => {
            this.maxPosition = positions
        })
        eventEmitter.emit('macro-get-max-position')

        eventEmitter.on('macro-component-being-moved', async (component) => {
            if (component.getAttribute('name') == this.name) {
                if (this.mobile) {
                    this.expanded = true
                    this.toggleEditMode()
                }
                else {
                    this.config = true
                    this.toggleControlsOn()
                }
            }
        })
    },
    watch: {
        name() {
            this.name = this.name.trim()
            this.validateName()
            eventEmitter.emit('macro-update-component', this.$refs['macro-button'], this.name, this.value)
        },
        value() {
            this.value = this.value.trim()

            this.validateValue()
            eventEmitter.emit('macro-update-component', this.$refs['macro-button'], this.name, this.value)
        },
        section() {
            eventEmitter.emit('macro-move-component', this.$refs['macro-button'], this.section, this.position)
        },
        position() {
            eventEmitter.emit('macro-move-component', this.$refs['macro-button'], this.section, this.position)
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
                    eventEmitter.emit('macro-invalid-component', this.$refs['macro-button'], errors)
                }
                else {
                    eventEmitter.emit('macro-valid-component', this.$refs['macro-button'])
                }
            },
            deep: true
        }
    }

}
</script>
<template>
    <div class="macro-button-wrapper" ref="macro-button">
        <div class="macro-button" @click="toggleControlsOn()" v-if="!mobile && !config">
            <div class="macro-button-header">
                <textarea :value="name" placeholder="Insira um nome" ref="macro-button-name"
                    @keyup="name = $refs['macro-button-name'].value" :disabled="readonly" />
            </div>
            <div class="macro-button-body">
                <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                <textarea :value="value" placeholder="Insira um valor" ref="macro-button-value"
                    @keyup="value = $refs['macro-button-value'].value" :disabled="readonly" />
                <div class="macro-button-roll-button">
                    <button @click="roll()">Jogar dado</button>
                </div>
            </div>
        </div>
        <div class="macro-button-config" v-if="!mobile && config && !readonly">
            <div class="macro-button-config-item">
                <p>Seção</p>
                <select :value="section" @change="section = $refs['macro-button-config-section'].value"
                    ref="macro-button-config-section">
                    <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}
                    </option>
                </select>
            </div>
            <div class="macro-button-config-item">
                <p>Posição</p>
                <div class="macro-button-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                    <input type="number" :value="position" disabled />
                    <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                </div>
            </div>
            <div class="macro-button-config-item">
                <button v-if="!confirmComponentRemove" @click="confirmComponentRemove = true">Remover</button>
                <p v-if="confirmComponentRemove">Tem certeza que deseja apagar este componente?</p>
                <div class="macro-button-confirm-remove-component" v-if="confirmComponentRemove">
                    <button class="macro-button-danger-alert" @click="removeComponent()">Confirmar</button>
                    <button @click="confirmComponentRemove = false">Cancelar</button>
                </div>
            </div>
        </div>
        <div :class="`macro-button-controls ${controls ? 'macro-button-show-controls' : 'macro-button-hide-controls'}`"
            ref="macro-button-controls" v-if="!mobile && !readonly">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
        <!-- Mobile -->
        <div class="macro-button-mobile" v-if="mobile">
            <div class="macro-button-mobile-name" @click="expanded = true">
                <h4>{{ name }}</h4>
            </div>
            <div class="macro-button-mobile-value" @click="expanded = true">
                <p>{{ value }}</p>
            </div>
            <div class="macro-button-mobile-roll-button">
                <button @click="roll()">Jogar dado</button>
            </div>
            <div class="macro-button-mobile-footer" @click="expanded = true">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="macro-button-mobile-expanded" v-if="mobile && expanded">
            <div class="macro-button-mobile-expanded-box">
                <button class="macro-button-mobile-back-button" @click="toggleVisualizeMode(); expanded = false;"
                    v-if="readonly">Voltar</button>
                <div class="macro-button-mobile-expanded-controls" v-if="!readonly">
                    <button @click="toggleVisualizeMode(); expanded = false;">Voltar</button>
                    <div class="macro-button-mobile-config-item-row">
                        <button @click="toggleVisualizeMode()" ref="macro-button-mobile-toggle-visualize-mode-button"
                            :class="visualizeMode == true ? 'macro-button-mobile-expanded-button-active' : ''">Visualizar</button>
                        <button @click="toggleEditMode()" ref="macro-button-mobile-toggle-edit-mode-button"
                            :class="editMode == true ? 'macro-button-mobile-expanded-button-active' : ''">Editar</button>
                    </div>
                    <p v-if="editMode && !visualizeMode">Seção</p>
                    <select :value="section" @change="section = $refs['macro-button-mobile-section'].value"
                        ref="macro-button-mobile-section" v-if="editMode && !visualizeMode">
                        <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}
                        </option>
                    </select>
                    <p v-if="editMode && !visualizeMode">Posição</p>
                    <div class="macro-button-mobile-config-item-row" v-if="editMode && !visualizeMode">
                        <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                        <input type="number" :value="position" disabled />
                        <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                    </div>
                    <button class="macro-button-mobile-expanded-remove-button" v-if="editMode && !visualizeMode"
                        @click="confirmComponentRemove = true">Remover
                        componente</button>
                    <div class="confirmation-pop-up" v-if="confirmComponentRemove">
                        <p>Tem certeza que deseja apagar esse componente?</p>
                        <div class="confirmation-pop-up-buttons">
                            <button
                                @click="removeComponent(); confirmComponentRemove = false; expanded = false;">Apagar</button>
                            <button @click="confirmComponentRemove = false">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="macro-button-mobile-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="macro-button-mobile-expanded-name">
                        <h4>{{ name }}</h4>
                    </div>
                    <div class="macro-button-mobile-expanded-value">
                        <p>{{ value }}</p>
                    </div>
                </div>
                <div class="macro-button-mobile-expanded-edit-body" v-else-if="!visualizeMode && editMode && !readonly">
                    <div class="macro-button-mobile-expanded-name">
                        <input v-model="name" placeholder="Insira um nome para o componente" @keyup="validateName()"
                            @change="validateName()">
                    </div>
                    <div class="macro-button-mobile-expanded-value">
                        <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                        <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                        <textarea v-model="value" placeholder="Insira um valor para o componente" @keyup="validateValue()"
                            @change="validateValue()"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.show-number-component {
    display: flex !important;
}

.hide-number-component {
    display: none !important;
}

.macro-button-show-controls {
    display: flex !important;
}

.macro-button-hide-controls {
    display: none !important;
}

.macro-button-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 19em;
    height: 10em;
    color: var(--text);
    margin: 5px 5px;
}

.macro-button,
.macro-button-config {
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

.macro-button-config {
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
}

.macro-button-config::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.macro-button-config::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.macro-button-config::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.macro-button-confirm-remove-component {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 12em;
    height: 5em;
    margin-bottom: 5px;
}

.macro-button-config-item button {
    margin: 5px 0;
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
    cursor: pointer;
}

.macro-button-config-item button:hover {
    background-color: var(--background-secondary);
}

.macro-button-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1em;
    color: var(--text);
    text-align: center;
}

.macro-button-danger-alert {
    color: var(--cancel-secondary) !important;
}

.macro-button-config-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    padding: 0;
    width: 100%;
}

.macro-button-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
}

.macro-button-config-item input,
.macro-button-config-item select {
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

.macro-button-config-item input {
    width: 3em;
    height: 2em;
    text-align: center;
    font-size: 1.2em;
    -webkit-appearance: none;
    appearance: none;
}

.macro-button-config-item input::-webkit-outer-spin-button,
.macro-button-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.macro-button-config-item input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.macro-button-config-item-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
}

.macro-button-config-item-row img {
    width: 2em;
    height: 2em;
    margin: 0 5px;
    cursor: pointer;
    filter: var(--background-filter);
}

.macro-button-config-item-row img:hover {
    filter: var(--background-filter-hover);
}

.macro-button-config-item-row img:first-of-type {
    rotate: 180deg;
}

.macro-button-controls {
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    width: 3em;
    height: 10em;
}

.macro-button-controls img {
    width: 95%;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 10;
}

.macro-button-controls img:hover {
    background-color: var(--secondary);
}

.macro-button-header {
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

.macro-button-header textarea {
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

.macro-button-header textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.macro-button-header textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
    border-radius: 10px;
}

.macro-button-header textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.macro-button-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-weight: bold;
    margin: 0;
}

.macro-button-body p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1em;
    color: var(--cancel);
    text-align: center;
}

.macro-button-roll-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30%;
}

.macro-button-roll-button button {
    width: 100%;
    height: 100%;
    background-color: var(--background);
    border: 2px solid var(--primary);
    border-radius: 10px;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    padding: 0;
    text-align: center;
    outline: none;
    cursor: pointer;
}

.macro-button-roll-button button:hover {
    background-color: var(--background-secondary);
}

.macro-button-body textarea {
    margin: 0;
    width: 100%;
    height: 70%;
    background-color: transparent;
    border: none;
    text-align: center;
    font-weight: bold;
    font-size: 2em;
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

.macro-button-body textarea::placeholder {
    color: var(--text);
    font-size: 0.8em;
    opacity: 0.5;
}

.macro-button-body textarea::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.macro-button-body textarea::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.macro-button-body textarea::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.macro-button-footer {
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

@media (max-width: 800px) {
    .macro-button-wrapper {
        width: 48%;
        height: 9em;
        margin: 4px 2px;
    }
}

.macro-button-mobile {
    width: 100%;
    height: 9em;
    background-color: var(--primary);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2px 2px;
    transition: 0.3s;
}

.macro-button-mobile-name {
    box-sizing: border-box;
    width: 100%;
    height: 25%;
    background-color: var(--background);
    border: 2px solid var(--primary);
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1em;
    font-weight: normal;
    color: var(--text);
    margin: 0;
    vertical-align: middle;
}

.macro-button-mobile-name h4 {
    font-size: 0.8em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.macro-button-mobile-value {
    height: 40%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text);
    margin: 0;
    padding: 0;
}

.macro-button-mobile-value p {
    font-size: unset;
    font-weight: bold;
    margin: 0;
    padding: 0px 5px;
    width: 100%;
    border: none;
    color: var(--text);
    overflow: hidden;
    text-align: center !important;
    text-overflow: ellipsis;
}

.macro-button-mobile-roll-button {
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text);
    margin: 0;
    padding: 0;
}

.macro-button-mobile-roll-button button {
    width: 100%;
    height: 100%;
    background-color: var(--background);
    border: 2px solid var(--primary);
    color: var(--text);
    font-size: 0.8em;
    font-weight: bold;
    margin: 0;
    padding: 0;
    text-align: center;
    outline: none;
    cursor: pointer;
}

.overflow {
    text-overflow: ellipsis;
    white-space: nowrap;
}

.macro-button-mobile-footer {
    width: 100%;
    height: 15%;
    box-sizing: border-box;
    background-color: var(--background);
    border: 2px solid var(--primary);
    border-radius: 0 0 10px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 0.8em;
    font-weight: normal;
    color: var(--text);
    margin: 0;
    vertical-align: middle;
}

.macro-button-mobile-footer p {
    font-size: 0.9em;
    font-weight: bold;
    margin: 0;
    width: 100%;
}

.macro-button-mobile-expanded {
    position: fixed;
    top: 66px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background);
    z-index: 2;
    padding-top: 5px;
    overflow-y: scroll;
}

.macro-button-mobile-expanded-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.macro-button-mobile-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.macro-button-mobile-expanded-controls button,
.macro-button-mobile-back-button {
    width: 100%;
    height: 3em;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 5px 0;
    padding: 0;
}

.macro-button-mobile-back-button {
    width: 90% !important;
}

.macro-button-mobile-config-item-row {
    width: 100%;
    height: 3em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.macro-button-mobile-expanded-config-item-row button {
    width: 48%;
    height: 3em;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 5px 0;
    padding: 0;
}

.macro-button-mobile-expanded-button-active {
    background-color: var(--background) !important;
    border: 2px solid var(--primary) !important;
    color: var(--text) !important;
}

.macro-button-mobile-expanded p {
    width: 100%;
    text-align: center;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 10px 0;
    padding: 0;
}

.macro-button-mobile-expanded select {
    width: 100%;
    height: 3em;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 5px 0;
    padding: 0;
}

.macro-button-mobile-expanded input {
    width: 100%;
    height: 3em;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 5px 0;
    padding: 0;
    text-align: center;
}

.macro-button-mobile-expanded input[type=number] {
    width: 3em;
    height: 3em;
    text-align: center;
    font-size: 1em;
    -webkit-appearance: none;
    appearance: none;
}

.macro-button-mobile-expanded input::-webkit-outer-spin-button,
.macro-button-mobile-expanded input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.macro-button-mobile-expanded input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.macro-button-mobile-config-item-row img {
    width: 3em;
    height: 3em;
    margin: 0 50px;
    cursor: pointer;
    filter: var(--primary-filter);
}

.macro-button-mobile-config-item-row img:first-of-type {
    rotate: 180deg;
}

.macro-button-mobile-expanded-remove-button {
    margin: 15px 0 !important;
}

.macro-button-mobile-expanded-visualize-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.macro-button-mobile-expanded-name {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 3em;
    background-color: var(--background);
    border: 2px solid var(--primary);
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: normal;
    color: var(--text);
    margin: 0;
    padding: 5px;
    vertical-align: middle;
}

.macro-button-mobile-expanded-edit-body .macro-button-mobile-expanded-value p {
    font-size: 0.9em;
    color: red;
    font-weight: bold;
    margin: 0;
    width: 100%;
    height: min-content;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    text-align: center !important;
}

.macro-button-mobile-expanded-name h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.macro-button-mobile-expanded-value {
    height: max-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    color: var(--text);
    margin: 0;
    padding: 0;
    background-color: var(--primary);
    border-radius: 0 0 10px 10px;
    margin-bottom: 70px;
}

.macro-button-mobile-expanded-value p {
    font-size: 2em;
    font-weight: bold;
    margin: 0;
    padding: 0px 15px;
    width: 90%;
    height: 100%;
    border: none;
    color: var(--text);
    text-align: justify !important;
    padding: 5px;
    overflow: hidden;
    word-break: break-all;
}

.macro-button-mobile-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.macro-button-mobile-expanded-edit-body input {
    width: 100%;
    height: 100%;
    background-color: var(--background);
    border: none;
    border-radius: 10px 10px 0 0;
    outline: none;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    padding: 0 5px;
    text-align: center;
}

.macro-button-mobile-expanded-edit-body textarea {
    width: 95%;
    height: 50vmax;
    background-color: var(--primary);
    border: none;
    border-radius: 0 0 10px 10px;
    outline: none;
    color: var(--text);
    font-size: 2em;
    font-weight: bold;
    margin: 0;
    padding: 5px;
    text-align: justify;
    resize: none;
}
</style>