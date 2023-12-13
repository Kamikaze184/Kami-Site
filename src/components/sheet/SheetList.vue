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
            confirmComponentRemove: false
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
        }
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
        <div class="sheet-list" @click="toggleControlsOn()" v-if="!config">
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
        <div class="sheet-list-config" v-else>
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
</style>