<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            actualSection: {
                name: '',
                type: 0,
                position: 0
            },
            sections: [],
            newSection: {
                name: ''
            },
            validationErrors: {
                section: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome da seção não pode ser vazio',
                        length: 'O nome da seção deve ter entre 2 e 20 caracteres',
                        invalid: 'O nome da seção deve conter apenas letras e números',
                        alreadyExists: 'Já existe uma seção com esse nome'
                    }
                },
            }
        }
    },
    methods: {
        closeMenu() {
            eventEmitter.emit('close-sheet-menu')
        },
        validateSection() {
            const sectionName = this.newSection.name.trim()

            if (sectionName.length == 0) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.empty
                return
            }
            else if (sectionName.length < 2 || sectionName.length > 20) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.length
                return
            }
            else if (!sectionName.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim)) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.invalid
                return
            }
            else if (this.sections.find(section => section.name == sectionName && section.position != this.actualSectionIndex)) {
                this.validationErrors.section.state = true
                this.validationErrors.section.actualMessage = this.validationErrors.section.messages.alreadyExists
                return
            }
            else {
                this.validationErrors.section.state = false
                this.validationErrors.section.actualMessage = ''
            }
        },
        editSection() {
            this.validateSection()

            if (this.validationErrors.section.state) {
                return
            }

            eventEmitter.emit('edit-section', this.newSection.name)
            this.newSection.name = this.actualSection.name
        }
    },
    mounted() {
        eventEmitter.on('set-sections', (sections) => {
            this.sections = sections
        })
        eventEmitter.emit('get-sections')

        const sheetEditSectionMenu = document.getElementById('sheet-edit-section-menu')
        const observer = new MutationObserver((mutations) => {
            if (!sheetEditSectionMenu.classList.contains('hidden-div')) {
                eventEmitter.on('set-actual-section', (section) => {
                    this.actualSection = section
                    this.newSection.name = section.name
                })
                eventEmitter.emit('get-actual-section')
            }
        })

        observer.observe(sheetEditSectionMenu, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        })
    }
}
</script>
<template>
    <div id="sheet-edit-section-menu" ref="sheet-edit-section-menu">
        <div class="sheet-edit-section-menu-list">
            <div class="sheet-edit-section-menu-box">
                <div class="sheet-edit-section-menu-item">
                    <div class="sheet-edit-section-menu-item-title">
                        <h1>Editar seção</h1>
                    </div>
                </div>
                <div class="sheet-edit-section-menu-item">
                    <div class="sheet-edit-section-menu-item-title">
                        <h2>Nome da seção</h2>
                    </div>
                    <div class="sheet-edit-section-menu-item-value">
                        <input v-model="newSection.name" type="text" placeholder="Não pode ser vazio"
                            @keyup="validateSection()" @change="validateSection()" />
                        <p v-if="validationErrors.section.state">{{ validationErrors.section.actualMessage }}</p>
                    </div>
                    <div class="sheet-edit-section-menu-item-value">
                        <button @click="editSection()">Confirmar</button>
                    </div>
                </div>
                <div class="sheet-edit-section-menu-item">
                    <button @click="closeMenu()">Voltar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
#sheet-edit-section-menu {
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

.sheet-edit-section-menu-list {
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

.sheet-edit-section-menu-box {
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

.sheet-edit-section-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1em 0;
}

.sheet-edit-section-menu-item-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.sheet-edit-section-menu-item-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.sheet-edit-section-menu-item-title h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.sheet-edit-section-menu-item-title h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.sheet-edit-section-menu-item-value input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.sheet-edit-section-menu-item-value p {
    font-size: 1.1em;
    font-weight: bold;
    color: var(--cancel-secondary);
    margin: 0;
    text-align: center;
}

.sheet-edit-section-menu-item button {
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

.sheet-edit-section-menu-item button:hover {
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