<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            name: '',
            value: { actual: 0, max: 0, min: 0, step: 1 },
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
                        empty: 'O nome do atributo não pode ser vazio',
                        tooLong: 'O nome do atributo não pode ter mais de 32 caracteres',
                        invalidChars: 'O nome do atributo não pode conter caracteres especiais',
                        alreadyExists: 'O nome do atributo já existe',
                    }
                },
                actual: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor atual não pode ser vazio',
                        biggerThanMax: 'O valor atual não pode ser maior que o valor máximo',
                        smallerThanMin: 'O valor atual não pode ser menor que o valor mínimo',
                        invalidChars: 'O valor atual deve conter apenas números inteiros',
                    }
                },
                max: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor máximo não pode ser vazio',
                        smallerThanActual: 'O valor máximo não pode ser menor que o valor atual',
                        invalidChars: 'O valor máximo deve conter apenas números inteiros',
                    }
                },
                min: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor mínimo não pode ser vazio',
                        biggerThanActual: 'O valor mínimo não pode ser maior que o valor atual',
                        invalidChars: 'O valor mínimo deve conter apenas números inteiros',
                    }
                },
                step: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O passo não pode ser vazio',
                        invalidChars: 'O passo deve conter apenas números inteiros positivos',
                        greaterThanMax: 'O passo não pode ser maior que o valor máximo',
                    }
                }
            },
            confirmComponentRemove: false,
            expanded: false,
            editMode: false,
            visualizeMode: true,
            firstLoad: {
                name: true,
                value: true
            }
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
        increaseValue() {
            if (this.value.actual < this.value.max) {
                if (this.value.actual + this.value.step > this.value.max) {
                    this.value.actual = this.value.max
                }
                else {
                    this.value.actual += this.value.step
                }
            }
        },
        decreaseValue() {
            if (this.value.actual > this.value.min) {
                if (this.value.actual - this.value.step < this.value.min) {
                    this.value.actual = this.value.min
                }
                else {
                    this.value.actual -= this.value.step
                }
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
        validateActual() {
            const actual = this.value.actual

            if (actual.toString() == '') {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.empty
            }
            else if (actual > this.value.max) {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.biggerThanMax
            }
            else if (actual < this.value.min) {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.smallerThanMin
            }
            else if (!actual.toString().match(/^(-?[0-9]+)$/gim)) {
                this.validationErrors.actual.state = true
                this.validationErrors.actual.actualMessage = this.validationErrors.actual.messages.invalidChars
            }
            else {
                this.validationErrors.actual.state = false
                this.validationErrors.actual.actualMessage = ''
            }
        },
        validateMax() {
            const max = this.value.max

            if (max.toString() == '') {
                this.validationErrors.max.state = true
                this.validationErrors.max.actualMessage = this.validationErrors.max.messages.empty
            }
            else if (max < this.value.actual) {
                this.validationErrors.max.state = true
                this.validationErrors.max.actualMessage = this.validationErrors.max.messages.smallerThanActual
            }
            else if (!max.toString().match(/^(-?[0-9]+)$/gim)) {
                this.validationErrors.max.state = true
                this.validationErrors.max.actualMessage = this.validationErrors.max.messages.invalidChars
            }
            else {
                this.validationErrors.max.state = false
                this.validationErrors.max.actualMessage = ''
            }
        },
        validateMin() {
            const min = this.value.min

            if (min.toString() == '') {
                this.validationErrors.min.state = true
                this.validationErrors.min.actualMessage = this.validationErrors.min.messages.empty
            }
            else if (min > this.value.actual) {
                this.validationErrors.min.state = true
                this.validationErrors.min.actualMessage = this.validationErrors.min.messages.biggerThanActual
            }
            else if (!min.toString().match(/^(-?[0-9]+)$/gim)) {
                this.validationErrors.min.state = true
                this.validationErrors.min.actualMessage = this.validationErrors.min.messages.invalidChars
            }
            else {
                this.validationErrors.min.state = false
                this.validationErrors.min.actualMessage = ''
            }
        },
        validateStep() {
            const step = this.value.step

            if (step.toString() == '') {
                this.validationErrors.step.state = true
                this.validationErrors.step.actualMessage = this.validationErrors.step.messages.empty
            }
            else if (step > this.value.max) {
                this.validationErrors.step.state = true
                this.validationErrors.step.actualMessage = this.validationErrors.step.messages.greaterThanMax
            }
            else if (!step.toString().match(/^[0-9]+$/gim)) {
                this.validationErrors.step.state = true
                this.validationErrors.step.actualMessage = this.validationErrors.step.messages.invalidChars
            }
            else {
                this.validationErrors.step.state = false
                this.validationErrors.step.actualMessage = ''
            }
        },
        removeComponent() {
            eventEmitter.emit('remove-component', this.$refs['sheet-bar'])
        },
        toggleVisualizeMode() {
            this.visualizeMode = true
            this.editMode = false
        },
        toggleEditMode() {
            this.visualizeMode = false
            this.editMode = true
        }
    },
    beforeMount() {
        this.mobile = window.innerWidth <= 800

        window.addEventListener('resize', () => {
            this.mobile = window.innerWidth <= 800
        })
    },
    mounted() {
        this.name = this.$refs['sheet-bar'].getAttribute('name')
        const valueString = JSON.parse(this.$refs['sheet-bar'].getAttribute('value') || '{}')

        this.value = {
            actual: Number(valueString.actual) || 0,
            max: Number(valueString.max) || 100,
            min: Number(valueString.min) || 0,
            step: Number(valueString.step) || 1
        }

        const position = this.$refs['sheet-bar'].getAttribute('position')

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

        eventEmitter.on('component-being-moved', async (component) => {
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
            if(this.firstLoad.name){
                this.firstLoad.name = false
                return
            }
            
            this.validateName()
            eventEmitter.emit('update-component', this.$refs['sheet-bar'], this.name, this.value)
        },
        value: {
            handler() {
                if(this.firstLoad.value){
                    this.firstLoad.value = false
                    return
                }
                
                this.validateActual()
                this.validateMax()
                this.validateMin()
                this.validateStep()
                eventEmitter.emit('update-component', this.$refs['sheet-bar'], this.name, this.value)
            },
            deep: true
        },
        section() {
            eventEmitter.emit('move-component', this.$refs['sheet-bar'], this.section, this.position)
        },
        position() {
            eventEmitter.emit('move-component', this.$refs['sheet-bar'], this.section, this.position)
        },
        validationErrors: {
            handler() {
                if (this.validationErrors.name.state || this.validationErrors.actual.state || this.validationErrors.max.state || this.validationErrors.min.state || this.validationErrors.step.state) {
                    const errors = {
                        name: {
                            state: this.validationErrors.name.state,
                            actualMessage: this.validationErrors.name.actualMessage
                        },
                        actual: {
                            state: this.validationErrors.actual.state,
                            actualMessage: this.validationErrors.actual.actualMessage
                        },
                        max: {
                            state: this.validationErrors.max.state,
                            actualMessage: this.validationErrors.max.actualMessage
                        },
                        min: {
                            state: this.validationErrors.min.state,
                            actualMessage: this.validationErrors.min.actualMessage
                        },
                        step: {
                            state: this.validationErrors.step.state,
                            actualMessage: this.validationErrors.step.actualMessage
                        }
                    }
                    eventEmitter.emit('invalid-component', this.$refs['sheet-bar'], errors)
                }
                else {
                    eventEmitter.emit('valid-component', this.$refs['sheet-bar'])
                }
            },
            deep: true
        }
    }
}
</script>
<template>
    <div class="sheet-bar-wrapper" ref="sheet-bar">
        <div class="sheet-bar" @click="toggleControlsOn()" v-if="!mobile && !config">
            <div class="sheet-bar-header">
                <input type="text" :value="name" class="sheet-bar-title" ref="sheet-bar-name"
                    @keyup="name = $refs['sheet-bar-name'].value">
                <h4>{{ `${value.actual}/${value.max}` }}</h4>
            </div>
            <div class="sheet-bar-body">
                <div class="sheet-bar-outer-display" v-if="value.actual > 0">
                    <div class="sheet-bar-inner-display" :style="{ width: ((value.actual / value.max) * 100) + '%' }"></div>
                </div>
                <div class="sheet-bar-outer-display negative-outer-display" v-else>
                    <div class="sheet-bar-inner-display negative-inner-display"
                        :style="{ width: Math.abs(((value.actual / value.min) * 100)) + '%' }"></div>
                </div>
            </div>
            <div class="sheet-bar-buttons">
                <img src="../../assets/img/plus.svg" @click="increaseValue()">
                <img src="../../assets/img/minus.svg" @click="decreaseValue()">
            </div>
            <div class="sheet-bar-errors">
                <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                <p v-if="validationErrors.actual.state">{{ validationErrors.actual.actualMessage }}</p>
                <p v-if="validationErrors.max.state">{{ validationErrors.max.actualMessage }}</p>
                <p v-if="validationErrors.min.state">{{ validationErrors.min.actualMessage }}</p>
                <p v-if="validationErrors.step.state">{{ validationErrors.step.actualMessage }}</p>
            </div>
        </div>
        <div class="sheet-bar-config" v-if="!mobile && config">
            <div class="sheet-bar-config-item">
                <p>Valor atual</p>
                <input type="number" :value="value.actual"
                    @change="value.actual = Number($refs['sheet-bar-config-actual'].value)" ref="sheet-bar-config-actual">
            </div>
            <div class="sheet-bar-config-item">
                <p>Valor máximo</p>
                <input type="number" :value="value.max" @change="value.max = Number($refs['sheet-bar-config-max'].value)"
                    ref="sheet-bar-config-max">
            </div>
            <div class="sheet-bar-config-item">
                <p>Valor mínimo</p>
                <input type="number" :value="value.min" @change="value.min = Number($refs['sheet-bar-config-min'].value)"
                    ref="sheet-bar-config-min">
            </div>
            <div class="sheet-bar-config-item">
                <p>Passo dos botões</p>
                <input type="number" :value="value.step" @change="value.step = Number($refs['sheet-bar-config-step'].value)"
                    ref="sheet-bar-config-step">
            </div>
            <div class="sheet-bar-config-item">
                <p>Seção</p>
                <select :value="section" @change="section = $refs['sheet-bar-config-section'].value"
                    ref="sheet-bar-config-section">
                    <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}</option>
                </select>
            </div>
            <div class="sheet-bar-config-item">
                <p>Posição</p>
                <div class="sheet-bar-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                    <input type="number" :value="position" disabled />
                    <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                </div>
            </div>
            <div class="sheet-bar-config-item">
                <button v-if="!confirmComponentRemove" @click="confirmComponentRemove = true">Remover</button>
                <p v-if="confirmComponentRemove">Tem certeza que deseja apagar este componente?</p>
                <div class="sheet-bar-confirm-remove-component" v-if="confirmComponentRemove">
                    <button class="sheet-bar-danger-alert" @click="removeComponent()">Confirmar</button>
                    <button @click="confirmComponentRemove = false">Cancelar</button>
                </div>
            </div>
        </div>
        <div :class="`sheet-bar-controls ${controls ? 'sheet-bar-show-controls' : 'sheet-bar-hide-controls'}`"
            ref="sheet-bar-controls" v-if="!mobile">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
        <!-- Mobile -->
        <div class="sheet-bar-mobile" v-if="mobile">
            <div class="sheet-bar-mobile-header" @click="expanded = true">
                <input type="text" :value="name" class="sheet-bar-mobile-title" ref="sheet-bar-name">
                <h4>{{ `${value.actual}/${value.max}` }}</h4>
            </div>
            <div class="sheet-bar-mobile-body" @click="expanded = true">
                <div class="sheet-bar-mobile-outer-display" v-if="value.actual > 0">
                    <div class="sheet-bar-mobile-inner-display"
                        :style="{ width: ((value.actual / value.max) * 100) + '%' }"></div>
                </div>
                <div class="sheet-bar-mobile-outer-display negative-outer-display" v-else>
                    <div class="sheet-bar-mobile-inner-display negative-inner-display"
                        :style="{ width: Math.abs(((value.actual / value.min) * 100)) + '%' }"></div>
                </div>
            </div>
            <div class="sheet-bar-mobile-buttons">
                <img src="../../assets/img/plus.svg" @click="increaseValue()">
                <img src="../../assets/img/minus.svg" @click="decreaseValue()">
            </div>
        </div>
        <div class="sheet-bar-mobile-expanded" v-if="mobile && expanded">
            <div class="sheet-bar-mobile-expanded-box">
                <div class="sheet-bar-mobile-expanded-controls">
                    <button @click="toggleVisualizeMode(); expanded = false;">Voltar</button>
                    <div class="sheet-bar-mobile-config-item-row">
                        <button @click="toggleVisualizeMode()"
                            ref="sheet-bar-mobile-toggle-visualize-mode-button"
                            :class="visualizeMode == true ? 'sheet-bar-mobile-expanded-button-active' : ''">Visualizar</button>
                        <button @click="toggleEditMode()" ref="sheet-bar-mobile-toggle-edit-mode-button"
                            :class="editMode == true ? 'sheet-bar-mobile-expanded-button-active' : ''">Editar</button>
                    </div>
                    <p v-if="editMode && !visualizeMode">Seção</p>
                    <select :value="section" @change="section = $refs['sheet-bar-mobile-section'].value"
                        ref="sheet-bar-mobile-section" v-if="editMode && !visualizeMode">
                        <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}
                        </option>
                    </select>
                    <p v-if="editMode && !visualizeMode">Posição</p>
                    <div class="sheet-bar-mobile-config-item-row" v-if="editMode && !visualizeMode">
                        <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                        <input type="number" :value="position" disabled />
                        <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                    </div>
                    <button class="sheet-bar-mobile-expanded-remove-button" v-if="editMode && !visualizeMode"
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
                <div class="sheet-bar-mobile-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="sheet-bar-mobile-header" @click="expanded = true">
                        <input type="text" :value="name" class="sheet-bar-mobile-title" ref="sheet-bar-name">
                        <h4>{{ `${value.actual}/${value.max}` }}</h4>
                    </div>
                    <div class="sheet-bar-mobile-body" @click="expanded = true">
                        <div class="sheet-bar-mobile-outer-display" v-if="value.actual > 0">
                            <div class="sheet-bar-mobile-inner-display"
                                :style="{ width: ((value.actual / value.max) * 100) + '%' }"></div>
                        </div>
                        <div class="sheet-bar-mobile-outer-display negative-outer-display" v-else>
                            <div class="sheet-bar-mobile-inner-display negative-inner-display"
                                :style="{ width: Math.abs(((value.actual / value.min) * 100)) + '%' }"></div>
                        </div>
                    </div>
                    <div class="sheet-bar-mobile-buttons">
                        <img src="../../assets/img/plus.svg" @click="increaseValue()">
                        <img src="../../assets/img/minus.svg" @click="decreaseValue()">
                    </div>
                </div>
                <div class="sheet-bar-mobile-expanded-edit-body" v-else-if="!visualizeMode && editMode">
                    <div class="sheet-bar-mobile-expanded-name">
                        <input v-model="name" placeholder="Insira um nome para o atributo" @keyup="validateName()"
                            @change="validateName()">
                    </div>
                    <div class="sheet-bar-mobile-expanded-value">
                        <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                        <label>Valor mínimo</label>
                        <p v-if="validationErrors.min.state">{{ validationErrors.min.actualMessage }}</p>
                        <input type="number" v-model="value.min" @keyup="validateAll()" @change="validateAll()">
                        <label>Valor máximo</label>
                        <p v-if="validationErrors.max.state">{{ validationErrors.max.actualMessage }}</p>
                        <input type="number" v-model="value.max" @keyup="validateAll()" @change="validateAll()">
                        <label>Valor atual</label>
                        <p v-if="validationErrors.actual.state">{{ validationErrors.actual.actualMessage }}</p>
                        <input type="number" v-model="value.actual" @keyup="validateAll()" @change="validateAll()">
                        <label>Passo dos botões + e -</label>
                        <p v-if="validationErrors.step.state">{{ validationErrors.step.actualMessage }}</p>
                        <input type="number" v-model="value.step" @keyup="validateAll()" @change="validateAll()">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.sheet-bar-show-controls {
    display: flex !important;
}

.sheet-bar-hide-controls {
    display: none !important;
}

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
    justify-content: flex-start;
    align-items: center;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    height: 10em;
    width: 15em;
    color: var(--text);
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
}

.sheet-bar-config::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-bar-config::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-bar-config::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-bar-confirm-remove-component {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 12em;
    height: 5em;
    margin-bottom: 5px;
}

.sheet-bar-config-item button {
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

.sheet-bar-config-item button:hover {
    background-color: var(--background-secondary);
}

.sheet-bar-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1em;
    color: var(--text);
    text-align: center;
}

.sheet-bar-danger-alert {
    color: var(--cancel-secondary) !important;
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
    appearance: none;
}

.sheet-bar-config-item input::-webkit-outer-spin-button,
.sheet-bar-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-bar-config-item input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
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
    appearance: textfield;
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 15em;
}

.sheet-bar-errors {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 15em;
    height: 4em;
    margin-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
}

.sheet-bar-errors p {
    margin: 5px;
    padding: 0;
    color: var(--text);
    font-weight: bold;
    font-size: 1em;
    text-align: center;
}

.sheet-bar-errors::-webkit-scrollbar-track {
    background-color: var(--primary);
    border-radius: 10px;
}

.sheet-bar-errors::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-bar-errors::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
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
}

.negative-outer-display {
    justify-content: flex-end !important;
}

.negative-inner-display {
    background-color: #910000 !important;
}

.sheet-bar-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 15em;
    height: 2em;
    margin-top: 10px;
}

.sheet-bar-buttons img {
    width: 2.5em;
    height: 2.5em;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

@media (max-width: 800px) {
    .sheet-bar-wrapper {
        width: 48%;
        height: 9em;
        margin: 4px 2px;
    }
}

.sheet-bar-mobile {
    width: 100%;
    height: 9em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2px 2px;
    transition: 0.3s;
}

.sheet-bar-mobile-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 2em;
}

.sheet-bar-mobile-value {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
}

.sheet-bar-mobile-header input {
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

.sheet-bar-mobile-value input {
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

.sheet-bar-mobile-value input::-webkit-outer-spin-button,
.sheet-bar-mobile-header input::-webkit-outer-spin-button,
.sheet-bar-mobile-value input::-webkit-inner-spin-button,
.sheet-bar-mobile-header input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-bar-mobile-value input[type=number],
.sheet-bar-mobile-header input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.sheet-bar-mobile-header h4 {
    grid-area: divisor;
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1.2em;
    color: var(--text);
    text-align: center;
}

.sheet-bar-mobile-title {
    grid-area: title;
}

.sheet-bar-mobile-actual-value {
    grid-area: actual;
}

.sheet-bar-mobile-max-value {
    grid-area: max;
}

.sheet-bar-mobile-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.sheet-bar-mobile-outer-display {
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

.sheet-bar-mobile-inner-display {
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
}

.sheet-bar-mobile-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 2em;
    margin-top: 10px;
}

.sheet-bar-mobile-buttons img {
    width: 2.5em;
    height: 2.5em;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    margin-right: 10px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

.sheet-bar-mobile-expanded {
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

.sheet-bar-mobile-expanded-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.sheet-bar-mobile-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.sheet-bar-mobile-expanded-controls button {
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

.sheet-bar-mobile-config-item-row {
    width: 100%;
    height: 3em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.sheet-bar-mobile-expanded-config-item-row button {
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

.sheet-bar-mobile-expanded-button-active {
    background-color: var(--background) !important;
    border: 2px solid var(--primary) !important;
    color: var(--text) !important;
}

.sheet-bar-mobile-expanded p {
    width: 100%;
    text-align: center;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 10px 0;
    padding: 0;
}

.sheet-bar-mobile-expanded select {
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

.sheet-bar-mobile-expanded input {
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

.sheet-bar-mobile-expanded input[type=number] {
    width: 3em;
    height: 3em;
    text-align: center;
    font-size: 1em;
    -webkit-appearance: none;
    appearance: none;
}

.sheet-bar-mobile-expanded input::-webkit-outer-spin-button,
.sheet-bar-mobile-expanded input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-bar-mobile-expanded input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.sheet-bar-mobile-config-item-row img {
    width: 3em;
    height: 3em;
    margin: 0 50px;
    cursor: pointer;
    filter: var(--primary-filter);
}

.sheet-bar-mobile-config-item-row img:first-of-type {
    rotate: 180deg;
}

.sheet-bar-mobile-expanded-remove-button {
    margin: 15px 0 !important;
}

.sheet-bar-mobile-expanded-visualize-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.sheet-bar-mobile-expanded-visualize-body .sheet-bar-mobile-title {
    background-color: unset !important;
}

.sheet-bar-mobile-expanded-name {
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

.sheet-bar-mobile-expanded-edit-body .sheet-bar-mobile-expanded-value p {
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

.sheet-bar-mobile-expanded-name h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.sheet-bar-mobile-expanded-value {
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

.sheet-bar-mobile-expanded-value p {
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

.sheet-bar-mobile-expanded-value input {
    width: 85% !important;
    border-radius: 10px !important;
    margin-bottom: 10px !important;
}

.sheet-bar-mobile-expanded-value label {
    width: 85% !important;
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    margin-top: 5px;
    padding: 0;
    color: var(--text);
    text-align: center;
}

.sheet-bar-mobile-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.sheet-bar-mobile-expanded-edit-body input {
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

.sheet-bar-mobile-expanded-edit-body textarea {
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