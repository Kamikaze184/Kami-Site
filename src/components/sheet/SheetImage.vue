<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            value: '',
            section: 0,
            position: 0,
            mobile: false,
            controls: false,
            config: false,
            validationErrors: {
                value: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor do atributo não pode ser vazio',
                        invalidImageURL: 'O valor do atributo deve ser um URL de imagem válido'
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
        validateValue() {
            const value = this.value

            if (value == '') {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.empty
            }
            else if (!value.match(/https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)/gi)) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.invalidImageURL
            }
            else {
                this.validationErrors.value.state = false
                this.validationErrors.value.actualMessage = ''
            }
        },
        removeComponent() {
            eventEmitter.emit('remove-component', this.$refs['sheet-image'])
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
        this.value = this.$refs['sheet-image'].getAttribute('value')

        const position = this.$refs['sheet-image'].getAttribute('position')

        this.section = position.split('-')[0]
        this.position = position.split('-')[1]

        this.readonly = this.$refs['sheet-image'].getAttribute('readonly') == ''

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
        value() {
            this.value = this.value.trim()
            this.validateValue()
            eventEmitter.emit('update-component', this.$refs['sheet-image'], this.name, this.value)
        },
        section() {
            eventEmitter.emit('move-component', this.$refs['sheet-image'], this.section, this.position)
        },
        position() {
            eventEmitter.emit('move-component', this.$refs['sheet-image'], this.section, this.position)
        },
        validationErrors: {
            handler() {
                if (this.validationErrors.value.state) {
                    const errors = {
                        value: {
                            state: this.validationErrors.value.state,
                            actualMessage: this.validationErrors.value.actualMessage
                        }
                    }
                    eventEmitter.emit('invalid-component', this.$refs['sheet-image'], errors)
                }
                else {
                    eventEmitter.emit('valid-component', this.$refs['sheet-image'])
                }
            },
            deep: true
        }
    }
}
</script>
<template>
    <div class="sheet-image-wrapper" ref="sheet-image">
        <div class="sheet-image" @click="toggleControlsOn()" v-if="!mobile && !config">
            <div class="sheet-image-body">
                <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                <img :src="value" ref="sheet-image-body-img" @click="expandImage()">
            </div>
            <div class="sheet-image-footer" @click="expandImage()">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-image-config" v-if="!mobile && config && !readonly">
            <div class="sheet-image-config-item">
                <p>Link da imagem</p>
                <input class="sheet-image-config-link" ref="sheet-image-config-value" type="text" :value="value"
                    @keyup="value = $refs['sheet-image-config-value'].value"
                    @change="value = $refs['sheet-image-config-value'].value" />
            </div>
            <div class="sheet-image-config-item">
                <p>Seção</p>
                <select :value="section" @change="section = $refs['sheet-image-config-section'].value"
                    ref="sheet-image-config-section">
                    <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}</option>
                </select>
            </div>
            <div class="sheet-image-config-item">
                <p>Posição</p>
                <div class="sheet-image-config-item-row">
                    <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                    <input type="number" :value="position" disabled />
                    <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                </div>
            </div>
            <div class="sheet-image-config-item">
                <button v-if="!confirmComponentRemove" @click="confirmComponentRemove = true">Remover</button>
                <p v-if="confirmComponentRemove">Tem certeza que deseja apagar este componente?</p>
                <div class="sheet-image-confirm-remove-component" v-if="confirmComponentRemove">
                    <button class="sheet-image-danger-alert" @click="removeComponent()">Confirmar</button>
                    <button @click="confirmComponentRemove = false">Cancelar</button>
                </div>
            </div>
        </div>
        <div :class="`sheet-image-controls ${controls ? 'sheet-image-show-controls' : 'sheet-image-hide-controls'}`"
            ref="sheet-image-controls" v-if="!mobile && !readonly">
            <img class="sheet-controls-config" src="../../assets/img/setting.svg" @click="toggleConfig()">
            <img class="sheet-controls-remove" src="../../assets/img/cancel.svg" @click="toggleControlsOff()">
        </div>
        <!-- Mobile -->
        <div class="sheet-image-mobile" v-if="mobile" @click="expanded = true">
            <div class="sheet-image-mobile-value">
                <img :src="value">
            </div>
            <div class="sheet-image-mobile-footer">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-image-mobile-expanded" v-if="mobile && expanded">
            <div class="sheet-image-mobile-expanded-box">
                <button class="sheet-image-mobile-back-button" @click="toggleVisualizeMode(); expanded = false;">Voltar</button>
                <div class="sheet-image-mobile-expanded-controls" v-if="!readonly">
                    <button @click="toggleVisualizeMode(); expanded = false;">Voltar</button>
                    <div class="sheet-image-mobile-config-item-row">
                        <button @click="toggleVisualizeMode()" ref="sheet-image-mobile-toggle-visualize-mode-button"
                            :class="visualizeMode == true ? 'sheet-image-mobile-expanded-button-active' : ''">Visualizar</button>
                        <button @click="toggleEditMode()" ref="sheet-image-mobile-toggle-edit-mode-button"
                            :class="editMode == true ? 'sheet-image-mobile-expanded-button-active' : ''">Editar</button>
                    </div>
                    <p v-if="editMode && !visualizeMode">Seção</p>
                    <select :value="section" @change="section = $refs['sheet-image-mobile-section'].value"
                        ref="sheet-image-mobile-section" v-if="editMode && !visualizeMode">
                        <option v-for="item in sections" :key="item" :value="sections.indexOf(item)">{{ item.name }}
                        </option>
                    </select>
                    <p v-if="editMode && !visualizeMode">Posição</p>
                    <div class="sheet-image-mobile-config-item-row" v-if="editMode && !visualizeMode">
                        <img src="../../assets/img/navigateIcon.svg" @click="previousPosition()">
                        <input type="number" :value="position" disabled />
                        <img src="../../assets/img/navigateIcon.svg" @click="nextPosition()">
                    </div>
                    <button class="sheet-image-mobile-expanded-remove-button" v-if="editMode && !visualizeMode"
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
                <div class="sheet-image-mobile-expanded-visualize-body" v-if="visualizeMode && !editMode">
                    <div class="sheet-image-mobile-expanded-name">
                        <h4>{{ value }}</h4>
                    </div>
                    <div class="sheet-image-mobile-expanded-value">
                        <img :src="value">
                    </div>
                </div>
                <div class="sheet-image-mobile-expanded-edit-body" v-else-if="!visualizeMode && editMode && !readonly">
                    <div class="sheet-image-mobile-expanded-name">
                        <input v-model="value" placeholder="Insira um nome para o atributo" @keyup="validateValue()"
                            @change="validateValue()">
                    </div>
                    <div class="sheet-image-mobile-expanded-value">
                        <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                        <img :src="value">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.sheet-image-show-controls {
    display: flex !important;
}

.sheet-image-hide-controls {
    display: none !important;
}

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

.sheet-image-confirm-remove-component {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 12em;
    height: 5em;
    margin-bottom: 5px;
}

.sheet-image-config-item button {
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

.sheet-image-config-item button:hover {
    background-color: var(--background-secondary);
}

.sheet-image-config-item p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 1em;
    color: var(--text);
    text-align: center;
}

.sheet-image-danger-alert {
    color: var(--cancel-secondary) !important;
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
    appearance: textfield;
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

.sheet-image-body p {
    margin: 5px;
    padding: 0;
    font-size: 1em;
    font-weight: bold;
    color: var(--text);
    text-align: center;
}

.sheet-image-body img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    border-radius: 10px !important;
    cursor: pointer;
    transition: all 0.2s linear;
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

@media (max-width: 800px) {
    .sheet-image-wrapper {
        width: 48%;
        height: 9em;
        margin: 4px 2px;
    }
}

.sheet-image-mobile {
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

.sheet-image-mobile-name {
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

.sheet-image-mobile-name h4 {
    font-size: 0.8em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.sheet-image-mobile-value {
    height: 90%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text);
    margin: 0;
    padding: 0;
}

.sheet-image-mobile-value img {
    width: 95%;
    height: 95%;
    object-fit: scale-down;
    border-radius: 10px !important;
    cursor: pointer;
    transition: all 0.2s linear;
}

.sheet-image-mobile-value p {
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

.sheet-image-mobile-footer {
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

.sheet-image-mobile-footer p {
    font-size: 0.9em;
    font-weight: bold;
    margin: 0;
    width: 100%;
}

.sheet-image-mobile-expanded {
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

.sheet-image-mobile-expanded-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.sheet-image-mobile-expanded-controls {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.sheet-image-mobile-expanded-controls button, .sheet-image-mobile-back-button {
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

.sheet-image-mobile-back-button {
    width: 90% !important;
}
.sheet-image-mobile-config-item-row {
    width: 100%;
    height: 3em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.sheet-image-mobile-expanded-config-item-row button {
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

.sheet-image-mobile-expanded-button-active {
    background-color: var(--background) !important;
    border: 2px solid var(--primary) !important;
    color: var(--text) !important;
}

.sheet-image-mobile-expanded p {
    width: 100%;
    text-align: center;
    color: var(--text);
    font-size: 1em;
    font-weight: bold;
    margin: 10px 0;
    padding: 0;
}

.sheet-image-mobile-expanded select {
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

.sheet-image-mobile-expanded input {
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

.sheet-image-mobile-expanded input[type=number] {
    width: 3em;
    height: 3em;
    text-align: center;
    font-size: 1em;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

}

.sheet-image-mobile-expanded input::-webkit-outer-spin-button,
.sheet-image-mobile-expanded input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.sheet-image-mobile-expanded input[type=number] {
    -moz-appearance: textfield;
    -webkit-appearance: textfield;
    appearance: textfield;
}

.sheet-image-mobile-config-item-row img {
    width: 3em;
    height: 3em;
    margin: 0 50px;
    cursor: pointer;
    filter: var(--primary-filter);
}

.sheet-image-mobile-config-item-row img:first-of-type {
    rotate: 180deg;
}

.sheet-image-mobile-expanded-remove-button {
    margin: 15px 0 !important;
}

.sheet-image-mobile-expanded-visualize-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    border: none;
}

.sheet-image-mobile-expanded-visualize-body img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    border-radius: 10px !important;
    cursor: pointer;
    transition: all 0.2s linear;
    margin: 3px;
}

.sheet-image-mobile-expanded-name {
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

.sheet-image-mobile-expanded-visualize-body .sheet-image-mobile-expanded-name {
    height: min-content;
    width: 100%;
}

.sheet-image-mobile-expanded-edit-body .sheet-image-mobile-expanded-value p {
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

.sheet-image-mobile-expanded-name h4 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.sheet-image-mobile-expanded-value {
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

.sheet-image-mobile-expanded-value p {
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

.sheet-image-mobile-expanded-edit-body {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}

.sheet-image-mobile-expanded-edit-body img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    border-radius: 10px !important;
    cursor: pointer;
    transition: all 0.2s linear;
    margin: 3px;

}

.sheet-image-mobile-expanded-edit-body input {
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

.sheet-image-mobile-expanded-edit-body textarea {
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