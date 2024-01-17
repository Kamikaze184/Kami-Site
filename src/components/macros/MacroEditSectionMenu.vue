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
            },
            confirmSectionRemove: false,
            confirmSectionClear: false
        }
    },
    methods: {
        closeMenu() {
            eventEmitter.emit('close-macro-menu')
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

            eventEmitter.emit('macro-edit-section', this.newSection.name)
            this.newSection.name = this.actualSection.name
        },
        deleteSection() {
            if (this.sections.length == 1) {
                return
            }
            else {
                eventEmitter.emit('macro-delete-section', this.actualSection)
                this.confirmSectionRemove = false
            }
        },
        clearSection() {
            eventEmitter.emit('macro-clear-section', this.actualSection)
            this.confirmSectionClear = false
        }
    },
    mounted() {
        eventEmitter.on('macro-set-sections', (sections) => {
            this.sections = sections
        })
        eventEmitter.emit('macro-get-sections')

        const macroEditSectionMenu = document.getElementById('macro-edit-section-menu')
        const observer = new MutationObserver((mutations) => {
            if (!macroEditSectionMenu.classList.contains('hidden-div')) {
                eventEmitter.on('macro-set-actual-section', (section) => {
                    this.actualSection = section
                    this.newSection.name = section.name
                })
                eventEmitter.emit('macro-get-actual-section')
            }
        })

        observer.observe(macroEditSectionMenu, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        })
    }
}
</script>
<template>
    <div id="macro-edit-section-menu" ref="macro-edit-section-menu">
        <div class="macro-edit-section-menu-list">
            <div class="macro-edit-section-menu-box">
                <div class="macro-edit-section-menu-item">
                    <div class="macro-edit-section-menu-item-title">
                        <h1>Editar seção</h1>
                    </div>
                </div>
                <div class="macro-edit-section-menu-item">
                    <div class="macro-edit-section-menu-item-title">
                        <h2>Nome da seção</h2>
                    </div>
                    <div class="macro-edit-section-menu-item-value">
                        <input v-model="newSection.name" type="text" placeholder="Não pode ser vazio"
                            @keyup="validateSection()" @change="validateSection()" />
                        <p v-if="validationErrors.section.state">{{ validationErrors.section.actualMessage }}</p>
                    </div>
                    <div class="macro-edit-section-menu-item-value">
                        <button @click="editSection()">Confirmar</button>
                    </div>
                </div>
                <div class="macro-edit-section-menu-item" v-if="this.sections.length > 1">
                    <div class="macro-edit-section-menu-item-title">
                        <h2>Remover seção</h2>
                    </div>
                    <div class="macro-edit-section-menu-item-value">
                        <button class="danger-alert-button" @click="confirmSectionRemove = true"
                            v-if="confirmSectionRemove == false">Remover seção</button>
                        <div class="macro-edit-section-menu-item-value" v-if="confirmSectionRemove">
                            <p class="macro-edit-section-menu-item-info">Tem certeza que deseja remover esta seção? Todos os
                                componentes dentro dela também serão removidos</p>
                            <button class="danger-alert-button" @click="deleteSection()"
                                style="margin: 5px;">Confirmar</button>
                            <button @click="confirmSectionRemove = false">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="macro-edit-section-menu-item" v-if="this.sections.length == 1">
                    <div class="macro-edit-section-menu-item-title">
                        <h2>Remover todos os componentes da seção</h2>
                    </div>
                    <div class="macro-edit-section-menu-item-value">
                        <button class="danger-alert-button" @click="confirmSectionClear = true"
                            v-if="confirmSectionClear == false">Remover</button>
                        <div class="macro-edit-section-menu-item-value" v-if="confirmSectionClear">
                            <p class="macro-edit-section-menu-item-info">Tem certeza que deseja remover todos os componentes desta seção?</p>
                            <button class="danger-alert-button" @click="clearSection()"
                                style="margin: 5px;">Confirmar</button>
                            <button @click="confirmSectionClear = false">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="macro-edit-section-menu-item">
                    <button @click="closeMenu()">Voltar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
#macro-edit-section-menu {
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

.macro-edit-section-menu-list {
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

.macro-edit-section-menu-box {
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

.macro-edit-section-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1em 0;
}

.macro-edit-section-menu-item-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-edit-section-menu-item-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-edit-section-menu-item-info {
    font-size: 1em;
    font-weight: bold;
    color: var(--text) !important;
    margin: 0;
    text-align: center;
}

.macro-edit-section-menu-item-title h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    text-align: center;
}

.macro-edit-section-menu-item-title h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    text-align: center;
}

.macro-edit-section-menu-item-value input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.macro-edit-section-menu-item-value p {
    font-size: 1.1em;
    font-weight: bold;
    color: var(--cancel-secondary);
    margin: 0;
    text-align: center;
}

.macro-edit-section-menu-item button {
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

.macro-edit-section-menu-item button:hover {
    background-color: var(--background-secondary);
}

.macro-delete-confirm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.macro-delete-confirm p {
    font-size: 1em;
    font-weight: bold;
    color: var(--text);
    margin: 0;
}

.macro-delete-confirm-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.macro-delete-confirm-buttons button {
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

@media (max-width: 800px) {
    #macro-edit-section-menu {
        margin-bottom: 0;
    }

    .macro-edit-section-menu-box {
        width: 80%;
        height: 70%;
        text-align: center;
    }
}</style>