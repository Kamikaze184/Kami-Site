<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            sections: [],
            newSection: {
                name: ''
            },
            validationErrors: {
                newSection: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome da seção não pode ser vazio',
                        length: 'O nome da seção deve ter entre 2 e 20 caracteres',
                        invalid: 'O nome da seção deve conter apenas letras e números',
                        alreadyExists: 'Já existe uma seção com esse nome'
                    }
                }
            }
        }
    },
    methods: {
        closeMenu() {
            eventEmitter.emit('close-sheet-menu')
        },
        validateSectionName() {
            const sectionName = this.newSection.name.trim()

            if (sectionName.length == 0) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.empty
                return
            }
            else if (sectionName.length < 2 || sectionName.length > 20) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.length
                return
            }
            else if (!sectionName.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.invalid
                return
            }
            else if (this.sections.find(section => section.name == sectionName)) {
                this.validationErrors.newSection.state = true
                this.validationErrors.newSection.actualMessage = this.validationErrors.newSection.messages.alreadyExists
                return
            }
            else {
                this.validationErrors.newSection.state = false
                this.validationErrors.newSection.actualMessage = ''
            }
        },
        createNewSection() {
            this.validateSectionName()

            if (this.validationErrors.newSection.state) {
                return
            }

            eventEmitter.emit('create-new-section', this.newSection.name)
            this.newSection.name = ''
        }
    },
    mounted() {
        eventEmitter.on('set-sections', (sections) => {
            this.sections = sections
        })
        eventEmitter.emit('get-sections')
    }
}
</script>
<template>
    <div id="sheet-add-section-menu" ref="sheet-add-section-menu">
        <div class="sheet-add-section-menu-list">
            <div class="sheet-add-section-menu-box">
                <div class="sheet-add-section-menu-item">
                    <div class="sheet-add-section-menu-item-title">
                        <h1>Criar nova seção</h1>
                    </div>
                </div>
                <div class="sheet-add-section-menu-item">
                    <div class="sheet-add-section-menu-item-title">
                        <h2>Nome da seção</h2>
                    </div>
                    <div class="sheet-add-section-menu-item-value">
                        <input v-model="newSection.name" type="text" placeholder="Não pode ser vazio"
                            @keyup="validateSectionName()" @change="validateSectionName()" />
                        <p v-if="validationErrors.newSection.state">{{ validationErrors.newSection.actualMessage }}</p>
                    </div>
                    <div class="sheet-add-section-menu-item-value">
                        <button @click="createNewSection()">Confirmar</button>
                    </div>
                </div>
                <div class="sheet-add-section-menu-item">
                    <button @click="closeMenu()">Voltar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
#sheet-add-section-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    margin-bottom: 4em;
    overflow: hidden;
    width: 100%;
    transition: all 0.5s linear;
    z-index: 2 !important;
}

.sheet-add-section-menu-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 95vh;
    padding: 0 1em;
    overflow: hidden;
    z-index: 2 !important;
}

.sheet-add-section-menu-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--primary);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 1em;
    width: 25em;
    height: 40em;
}

.sheet-add-section-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1em 0;
}

.sheet-add-section-menu-item-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.sheet-add-section-menu-item-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.sheet-add-section-menu-item-title h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.sheet-add-section-menu-item-title h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.sheet-add-section-menu-item-value input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.sheet-add-section-menu-item-value p {
    font-size: 1.1em;
    font-weight: bold;
    color: var( --cancel-secondary);
    margin: 0;
    text-align: center;
}

.sheet-add-section-menu-item button {
    font-size: 1em;
    font-weight: bold;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
    background-color: var(--background);
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s linear;
}

.sheet-add-section-menu-item button:hover {
    background-color: var(--background-secondary);
}

.sheet-delete-confirm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.sheet-delete-confirm p {
    font-size: 1em;
    font-weight: bold;
    color: var(--text);
    margin: 0;
}

.sheet-delete-confirm-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.sheet-delete-confirm-buttons button {
    font-size: 1em;
    font-weight: bold;
    width: 45%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    margin: 10px;
    outline: none;
    background-color: var(--background);
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s linear;
}

.danger-alert-button {
    color: var(--cancel-secondary) !important;
}

.danger-alert-button-secondary {
    background-color: var(--cancel-secondary) !important;
    color: var(--text) !important;
}
</style>