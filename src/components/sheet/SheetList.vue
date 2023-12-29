<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            name: '',
            value: { items: [] },
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
                quantity: {
                    messages: {
                        empty: 'A quantidade não pode ser vazia',
                        tooLong: 'A quantidade não pode ter mais de 32 caracteres',
                        invalidChars: 'A quantidade deve conter apenas números'
                    },
                    indexes: {}
                },
                value: {
                    messages: {
                        empty: 'O item não pode ser vazio',
                        tooLong: 'O valor do atributo não pode ter mais de 1024 caracteres',
                        invalidChars: 'O valor do atributo não pode conter caracteres especiais',
                    },
                    indexes: {}
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
        validateQuantity() {
            try {
                for (let index in this.value.items) {
                    const value = this.value.items[index].quantity

                    if (value == '') {
                        this.validationErrors.quantity.indexes[index] = {}
                        this.validationErrors.quantity.indexes[index].state = true
                        this.validationErrors.quantity.indexes[index].actualMessage = this.validationErrors.quantity.messages.empty
                    }
                    else if (value.length > 32) {
                        this.validationErrors.quantity.indexes[index] = {}
                        this.validationErrors.quantity.indexes[index].state = true
                        this.validationErrors.quantity.indexes[index].actualMessage = this.validationErrors.quantity.messages.tooLong
                    }
                    else if (!value.match(/^[0-9]{1,}(?: [0-9]+){0,}$/gim)) {
                        this.validationErrors.quantity.indexes[index] = {}
                        this.validationErrors.quantity.indexes[index].state = true
                        this.validationErrors.quantity.indexes[index].actualMessage = this.validationErrors.quantity.messages.invalidChars
                    }
                    else {
                        this.validationErrors.quantity.indexes[index] = {}
                        this.validationErrors.quantity.indexes[index].state = false
                        this.validationErrors.quantity.indexes[index].actualMessage = ''
                    }
                }
            }
            catch (err) {
                //ignore
            }
        },
        validateValue() {
            try {
                for (let index in this.value.items) {
                    const value = this.value.items[index].name

                    if (value == '') {
                        this.validationErrors.value.indexes[index] = {}
                        this.validationErrors.value.indexes[index].state = true
                        this.validationErrors.value.indexes[index].actualMessage = this.validationErrors.value.messages.empty
                    }
                    else if (value.length > 1024) {
                        this.validationErrors.value.indexes[index] = {}
                        this.validationErrors.value.indexes[index].state = true
                        this.validationErrors.value.indexes[index].actualMessage = this.validationErrors.value.messages.tooLong
                    }
                    else if (!value.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                        this.validationErrors.value.indexes[index] = {}
                        this.validationErrors.value.indexes[index].state = true
                        this.validationErrors.value.indexes[index].actualMessage = this.validationErrors.value.messages.invalidChars
                    }
                    else {
                        this.validationErrors.value.indexes[index] = {}
                        this.validationErrors.value.indexes[index].state = false
                        this.validationErrors.value.indexes[index].actualMessage = ''
                    }
                }
            }
            catch (err) {
                //ignore 
            }
        },
        addItem() {
            this.value.items.push({ quantity: 1, name: '' })
        },
        removeItem(index) {
            this.value.items.splice(index, 1)
        },
        getListErrorState(item) {
            let state = 0
            if (this.validationErrors.quantity.indexes[this.value.items.indexOf(item)] && this.validationErrors.quantity.indexes[this.value.items.indexOf(item)].state) {
                state += 1
            }

            if (this.validationErrors.value.indexes[this.value.items.indexOf(item)] && this.validationErrors.value.indexes[this.value.items.indexOf(item)].state) {
                state += 1
            }

            return `sheet-list-body-item-error-state-${state}`
        },
        removeComponent() {
            eventEmitter.emit('remove-component', this.$refs['sheet-list'])
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
        this.name = this.$refs['sheet-list'].getAttribute('name')
        this.value = JSON.parse(this.$refs['sheet-list'].getAttribute('value') || '{"items": []}')

        const position = this.$refs['sheet-list'].getAttribute('position')

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
            this.name = this.name.trim()
            this.validateName()
            eventEmitter.emit('update-component', this.$refs['sheet-list'], this.name, this.value)
        },
        value: {
            handler() {
                this.validateQuantity()
                this.validateValue()
                eventEmitter.emit('update-component', this.$refs['sheet-list'], this.name, this.value)
            },
            deep: true
        },
        section() {
            eventEmitter.emit('move-component', this.$refs['sheet-list'], this.section, this.position)
        },
        position() {
            eventEmitter.emit('move-component', this.$refs['sheet-list'], this.section, this.position)
        },
        validationErrors: {
            handler() {
                let errorState = false

                const errors = {
                    name: {
                    },
                    value: {
                    },
                    quantity: {

                    }
                }

                if (this.validationErrors.name.state) {
                    errors.name = {
                        state: this.validationErrors.name.state,
                        actualMessage: this.validationErrors.name.actualMessage
                    }

                    errorState = true
                }

                for (let index in this.validationErrors.value.indexes) {
                    if (this.validationErrors.value.indexes[index].state) {
                        errors.value[index] = {
                            state: this.validationErrors.value.indexes[index].state,
                            actualMessage: this.validationErrors.value.indexes[index].actualMessage
                        }

                        errorState = true
                    }
                }

                for (let index in this.validationErrors.quantity.indexes) {
                    if (this.validationErrors.quantity.indexes[index].state) {
                        errors.quantity[index] = {
                            state: this.validationErrors.quantity.indexes[index].state,
                            actualMessage: this.validationErrors.quantity.indexes[index].actualMessage
                        }

                        errorState = true
                    }
                }

                if (errorState) {
                    eventEmitter.emit('invalid-component', this.$refs['sheet-list'], errors)
                }
                else {
                    eventEmitter.emit('valid-component', this.$refs['sheet-list'])
                }
            },
            deep: true
        }
    }
}
</script>
<template>
    <div class="sheet-list-wrapper" ref="sheet-list">
        <div class="sheet-list" @click="toggleControlsOn()" v-if="!mobile && !config">
            <div class="sheet-list-header">
                <textarea :value="name" placeholder="Insira um nome" ref="sheet-list-name"
                    @keyup="name = $refs['sheet-list-name'].value" />
            </div>
            <div class="sheet-list-body">
                <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                <div v-for="item of value.items" :key="item" :class="'sheet-list-body-item ' + getListErrorState(item)">
                    <div class="sheet-list-body-item-error-wrapper">
                        <p
                            v-if="validationErrors.quantity.indexes[value.items.indexOf(item)] && validationErrors.quantity.indexes[value.items.indexOf(item)].state">
                            {{ validationErrors.quantity.indexes[value.items.indexOf(item)].actualMessage }}</p>
                        <p
                            v-if="validationErrors.value.indexes[value.items.indexOf(item)] && validationErrors.value.indexes[value.items.indexOf(item)].state">
                            {{ validationErrors.value.indexes[value.items.indexOf(item)].actualMessage }}</p>
                    </div>
                    <div class="sheet-list-body-item-wrapper">
                        <input type="number" :value="item.quantity"
                            :ref="`sheet-list-quantity-${value.items.indexOf(item)}`"
                            @keyup="value.items[value.items.indexOf(item)].quantity = $refs[`sheet-list-quantity-${value.items.indexOf(item)}`][0].value">
                        <input type="text" :value="item.name" :ref="`sheet-list-name-${value.items.indexOf(item)}`"
                            @keyup="value.items[value.items.indexOf(item)].name = $refs[`sheet-list-name-${value.items.indexOf(item)}`][0].value">
                        <img src="../../assets/img/trash.svg" @click="removeItem(value.items.indexOf(item))">
                    </div>
                </div>
                <img class="sheet-list-body-add-item" src="../../assets/img/plus.svg" @click="addItem()">
            </div>
            <div class="sheet-list-footer" v-if="mobile">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-list-config" v-if="!mobile && config">
            <div class="sheet-list-config-item">
                <p>Seção</p>
                <select :value="section" @change="section = $refs['sheet-list-config-section'].value"
                    ref="sheet-list-config-section">
                    <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}</option>
                </select>
            </div>
            <div class="sheet-list-config-item">
                <p>Posição</p>
                <div class="sheet-list-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                    <input type="number" :value="position" disabled />
                    <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                </div>
            </div>
            <div class="sheet-list-config-item">
                <button v-if="!confirmComponentRemove" @click="confirmComponentRemove = true">Remover</button>
                <p v-if="confirmComponentRemove">Tem certeza que deseja apagar este componente?</p>
                <div class="sheet-list-confirm-remove-component" v-if="confirmComponentRemove">
                    <button class="sheet-list-danger-alert" @click="removeComponent()">Confirmar</button>
                    <button @click="confirmComponentRemove = false">Cancelar</button>
                </div>
            </div>
        </div>
        <div :class="`sheet-list-controls ${controls ? 'sheet-list-show-controls' : 'sheet-list-hide-controls'}`"
            ref="sheet-list-controls" v-if="!mobile">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
        <!-- Mobile -->
        <div class="sheet-list-mobile" v-if="mobile" @click="expanded = true">
            <div class="sheet-list-mobile-name">
                <h4>{{ name }}</h4>
            </div>
            <div class="sheet-list-mobile-value">
                <div v-for="item of value.items" :key="item" class="sheet-list-mobile-body-item">
                    <div class="sheet-list-mobile-body-item-wrapper" v-if="value.items.indexOf(item) < 2">
                        <input type="number" :value="item.quantity"
                            :ref="`sheet-list-quantity-${value.items.indexOf(item)}`"
                            @keyup="value.items[value.items.indexOf(item)].quantity = $refs[`sheet-list-quantity-${value.items.indexOf(item)}`][0].value">
                        <input type="text" :value="item.name" :ref="`sheet-list-name-${value.items.indexOf(item)}`"
                            @keyup="value.items[value.items.indexOf(item)].name = $refs[`sheet-list-name-${value.items.indexOf(item)}`][0].value">
                    </div>
                </div>
            </div>
            <div class="sheet-list-mobile-footer">
                <p>Mais {{ value.items.length - 2 }} ite{{ (value.items.length - 2) > 1 ? 'ns' : 'm' }}. Clique para
                    expandir</p>
            </div>
        </div>
        <div class="sheet-list-mobile-expanded" v-if="mobile && expanded">
            <div class="sheet-list-mobile-expanded-box">
                <div class="sheet-list-mobile-expanded-controls">
                    <button @click="toggleVisualizeMode(); expanded = false;">Voltar</button>
                    <div class="sheet-list-mobile-config-item-row">
                        <button @click="toggleVisualizeMode()"
                            ref="sheet-list-mobile-toggle-visualize-mode-button"
                            :class="visualizeMode == true ? 'sheet-list-mobile-expanded-button-active' : ''">Visualizar</button>
                        <button @click="toggleEditMode()" ref="sheet-list-mobile-toggle-edit-mode-button"
                            :class="editMode == true ? 'sheet-list-mobile-expanded-button-active' : ''">Editar</button>
                    </div>
                    <p v-if="editMode && !visualizeMode">Seção</p>
                    <select :value="section" @change="section = $refs['sheet-list-mobile-section'].value"
                        ref="sheet-list-mobile-section" v-if="editMode && !visualizeMode">
                        <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}
                        </option>
                    </select>
                    <p v-if="editMode && !visualizeMode">Posição</p>
                    <div class="sheet-list-mobile-config-item-row" v-if="editMode && !visualizeMode">
                        <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                        <input type="number" :value="position" disabled />
                        <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                    </div>
                    <button class="sheet-list-mobile-expanded-remove-button" v-if="editMode && !visualizeMode"
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
                <div class="sheet-list-mobile-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="sheet-list-mobile-expanded-name">
                        <h4>{{ name }}</h4>
                    </div>
                    <div class="sheet-list-mobile-expanded-value">
                        <div v-for="item of value.items" :key="item" class="sheet-list-mobile-body-item">
                            <div class="sheet-list-mobile-body-item-wrapper">
                                <input type="number" :value="item.quantity"
                                    :ref="`sheet-list-quantity-${value.items.indexOf(item)}`" disabled>
                                <input type="text" :value="item.name" :ref="`sheet-list-name-${value.items.indexOf(item)}`"
                                    disabled>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sheet-list-mobile-expanded-edit-body" v-else-if="!visualizeMode && editMode">
                    <div class="sheet-list-mobile-expanded-name">
                        <input v-model="name" placeholder="Insira um nome para o atributo" @keyup="validateName()"
                            @change="validateName()">
                    </div>
                    <div class="sheet-list-mobile-expanded-value">
                        <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                        <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                        <div v-for="item of value.items" :key="item"
                            :class="'sheet-list-body-item ' + getListErrorState(item)">
                            <div class="sheet-list-body-item-error-wrapper">
                                <p
                                    v-if="validationErrors.quantity.indexes[value.items.indexOf(item)] && validationErrors.quantity.indexes[value.items.indexOf(item)].state">
                                    {{ validationErrors.quantity.indexes[value.items.indexOf(item)].actualMessage }}</p>
                                <p
                                    v-if="validationErrors.value.indexes[value.items.indexOf(item)] && validationErrors.value.indexes[value.items.indexOf(item)].state">
                                    {{ validationErrors.value.indexes[value.items.indexOf(item)].actualMessage }}</p>
                            </div>
                            <div class="sheet-list-body-item-wrapper">
                                <input type="number" :value="item.quantity"
                                    :ref="`sheet-list-quantity-${value.items.indexOf(item)}`"
                                    @keyup="value.items[value.items.indexOf(item)].quantity = $refs[`sheet-list-quantity-${value.items.indexOf(item)}`][0].value">
                                <input type="text" :value="item.name" :ref="`sheet-list-name-${value.items.indexOf(item)}`"
                                    @keyup="value.items[value.items.indexOf(item)].name = $refs[`sheet-list-name-${value.items.indexOf(item)}`][0].value">
                                <img src="../../assets/img/trash.svg" @click="removeItem(value.items.indexOf(item))">
                            </div>
                        </div>
                        <img class="sheet-list-body-add-item" src="../../assets/img/plus.svg" @click="addItem()">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.sheet-list-show-controls {
    display: flex !important;
}

.sheet-list-hide-controls {
    display: none !important;
}

.sheet-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 38em;
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
    width: 33em;
    color: var(--text);
    position: relative;
}

.sheet-list-config {
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
}

.sheet-list-config::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
}

.sheet-list-config::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
}

.sheet-list-config::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
}

.sheet-list-confirm-remove-component {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 12em;
    height: 5em;
    margin-bottom: 5px;
}

.sheet-list-config-item button {
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

.sheet-list-config-item button:hover {
    background-color: var(--background-secondary);
}

.sheet-list-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1em;
    color: var(--text);
    text-align: center;
}

.sheet-list-danger-alert {
    color: var(--cancel-secondary) !important;
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
    appearance: none;
}

.sheet-list-config-item input::-webkit-outer-spin-button,
.sheet-list-config-item input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-list-config-item input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2em;
    box-sizing: border-box;
    text-align: center;
    font-weight: bold;
    margin: 7px;
    padding: 5px;
}

.sheet-list-body-item-error-state-1 {
    height: 5em !important;
}

.sheet-list-body-item-error-state-2 {
    height: 7em !important;
}

.sheet-list-body-item-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 2em;
    box-sizing: border-box;
    text-align: center;
    font-weight: bold;
}

.sheet-list-body-item-error-wrapper p {
    margin: 5px;
    padding: 0;
    font-size: 1em;
    color: var(--cancel);
    text-align: center;
    font-weight: bold;

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
    appearance: textfield;
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

@media (max-width: 800px) {
    .sheet-list-wrapper {
        width: 97%;
        height: 9em;
        margin: 4px 2px;
    }

    .sheet-list {
        width: 100%;
        height: 9em;
    }

    .sheet-list-body-item {
        height: 2.5em;
    }

    .sheet-list-body-item-wrapper {
        margin: 10px !important;
    }
}

.sheet-list-mobile {
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

.sheet-list-mobile-name {
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

.sheet-list-mobile-name h4 {
    font-size: 0.8em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.sheet-list-mobile-value {
    height: 60%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text);
    margin: 0;
    padding: 0;
}

.sheet-list-mobile-value p {
    font-size: unset;
    font-weight: bold;
    margin: 0;
    padding: 0px 5px;
    width: 100%;
    border: none;
    color: var(--text);
    overflow: hidden;
    text-align: center !important;
}

.overflow {
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sheet-list-mobile-body-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.sheet-list-mobile-body-item-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 98%;
    margin: 2px 0px;
}

.sheet-list-mobile-body-item input {
    background-color: var(--background);
    border: none;
    text-align: center;
    font-weight: bold;
    color: var(--text);
    resize: none;
    outline: none;
    overflow-y: auto;
}

.sheet-list-mobile-body-item input:nth-child(1) {
    width: 3em;
    height: 2em !important;
    font-size: 1em;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.sheet-list-mobile-body-item input:nth-child(1)::-webkit-outer-spin-button,
.sheet-list-mobile-body-item input:nth-child(1)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-list-mobile-body-item input:nth-child(1)[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.sheet-list-mobile-body-item input:nth-child(2) {
    width: 100%;
    height: 2em !important;
    font-size: 1em;
    border: none;
    margin: 0 3px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.sheet-list-mobile-footer {
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

.sheet-list-mobile-footer p {
    font-size: 0.9em;
    font-weight: bold;
    margin: 0;
    width: 100%;
}

.sheet-list-mobile-expanded {
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

.sheet-list-mobile-expanded-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.sheet-list-mobile-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.sheet-list-mobile-expanded-controls button {
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

.sheet-list-mobile-config-item-row {
    width: 100%;
    height: 3em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.sheet-list-mobile-expanded-config-item-row button {
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

.sheet-list-mobile-expanded-button-active {
    background-color: var(--background) !important;
    border: 2px solid var(--primary) !important;
    color: var(--text) !important;
}

.sheet-list-mobile-expanded p {
    width: 100%;
    text-align: center;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 10px 0;
    padding: 0;
}

.sheet-list-mobile-expanded select {
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

.sheet-list-mobile-expanded input {
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

.sheet-list-mobile-expanded input[type=number] {
    width: 3em;
    height: 3em;
    text-align: center;
    font-size: 1em;
    -webkit-appearance: none;
    appearance: none;
}

.sheet-list-mobile-expanded input::-webkit-outer-spin-button,
.sheet-list-mobile-expanded input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-list-mobile-expanded input[type=number] {
    -moz-appearance: textfield;
    appearance: none;
}

.sheet-list-mobile-config-item-row img {
    width: 3em;
    height: 3em;
    margin: 0 50px;
    cursor: pointer;
    filter: var(--primary-filter);
}

.sheet-list-mobile-config-item-row img:first-of-type {
    rotate: 180deg;
}

.sheet-list-mobile-expanded-remove-button {
    margin: 15px 0 !important;
}

.sheet-list-mobile-expanded-visualize-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.sheet-list-mobile-expanded-value input[type="number"] {
    width: 15%;
    height: 3em !important;
    background-color: var(--background);
    border: none;
    border-radius: 10px 0 0 10px;
    outline: none;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    padding: 0 5px;
    text-align: center;
}

.sheet-list-mobile-expanded-value input[type="text"] {
    width: 78%;
    height: 3em !important;
    background-color: var(--background);
    border: none;
    border-radius: 0px 10px 10px 0px;
    outline: none;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    margin-left: 3px;
    margin-right: 3px;
    padding: 0 5px;
    padding-left: 10px;
    text-align: justify;
}

.sheet-list-mobile-expanded-name {
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

.sheet-list-mobile-expanded-edit-body .sheet-list-mobile-expanded-value p {
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

.sheet-list-mobile-expanded-name h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.sheet-list-mobile-expanded-value {
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

.sheet-list-mobile-expanded-value p {
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

.sheet-list-mobile-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.sheet-list-mobile-expanded-edit-body input {
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

.sheet-list-mobile-expanded-edit-body textarea {
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