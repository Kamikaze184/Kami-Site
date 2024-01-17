<script>
import { eventEmitter } from '../../utils/EventEmitter.js'

export default {
    data() {
        return {
            sectionAttributes: [],
            newComponent: {
                name: '',
                type: 0
            },
            validationErrors: {
                newComponentName: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome do componente não pode ser vazio',
                        tooLong: 'O nome do componente não pode ter mais de 32 caracteres',
                        invalidChars: 'O nome do componente não pode conter caracteres especiais',
                        alreadyExists: 'O nome do componente já existe',
                    }
                }
            }
        }
    },
    methods: {
        closeMenu() {
            eventEmitter.emit('close-macro-menu')
            this.newComponent = {
                name: '',
                type: 0
            }
        },
        validateComponentName() {
            const componentTitle = this.newComponent.name.trim()

            if (componentTitle.length == 0) {
                this.validationErrors.newComponentName.state = true
                this.validationErrors.newComponentName.actualMessage = this.validationErrors.newComponentName.messages.empty
                return
            }
            else if (componentTitle.length > 32) {
                this.validationErrors.newComponentName.state = true
                this.validationErrors.newComponentName.actualMessage = this.validationErrors.newComponentName.messages.tooLong
                return
            }
            else if (!componentTitle.match(/^[a-zA-Z0-9 ]{1,}(?: [a-zA-Z0-9 ]+){0,}$/gim)) {
                this.validationErrors.newComponentName.state = true
                this.validationErrors.newComponentName.actualMessage = this.validationErrors.newComponentName.messages.invalidChars
                return
            }
            else if (this.sectionAttributes.find(attribute => attribute.name == componentTitle)) {
                this.validationErrors.newComponentName.state = true
                this.validationErrors.newComponentName.actualMessage = this.validationErrors.newComponentName.messages.alreadyExists
                return
            }
            else {
                this.validationErrors.newComponentName.state = false
                this.validationErrors.newComponentName.actualMessage = ''
            }
        },
        createNewComponent(){
            this.validateComponentName()
            
            if (this.validationErrors.newComponentName.state) {
                return
            }

            eventEmitter.emit('macro-create-new-component', this.newComponent)
            this.newComponent = {
                name: '',
                type: 0
            }
        }
    },
    mounted(){
        eventEmitter.on('macro-set-section-attributes', (sectionAttributes) => {
            this.sectionAttributes = sectionAttributes
        })
        eventEmitter.emit('macro-get-section-attributes')
    }
}
</script>
<template>
    <div id="macro-add-comp-menu" ref="macro-add-comp-menu">
        <div class="macro-add-comp-menu-list">
            <div class="macro-add-comp-menu-box">
                <div class="macro-add-comp-menu-item">
                    <div class="macro-add-comp-menu-item-title">
                        <h1>Adicionar novo componente</h1>
                    </div>
                </div>
                <div class="macro-add-comp-menu-item">
                    <div class="macro-add-comp-menu-item-title">
                        <h2>Nome do componente</h2>
                    </div>
                    <div class="macro-add-comp-menu-item-value">
                        <input type="text" v-model="newComponent.name" @keyup="validateComponentName()"
                            @change="validateComponentName()">
                        <p v-if="validationErrors.newComponentName.state">{{ validationErrors.newComponentName.actualMessage }}</p>
                    </div>
                </div>
                <div class="macro-add-comp-menu-item">
                    <button @click="createNewComponent()">Confirmar</button>
                </div>
                <div class="macro-add-comp-menu-item">
                    <button @click="closeMenu()">Voltar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
#macro-add-comp-menu {
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

.macro-add-comp-menu-list {
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

.macro-add-comp-menu-box {
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

.macro-add-comp-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1em 0;
}

.macro-add-comp-menu-item-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-add-comp-menu-item-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-add-comp-menu-item-value p {
    font-size: 1.1em;
    font-weight: bold;
    color: var( --cancel-secondary);
    margin: 0;
    text-align: center;
}

.macro-add-comp-menu-item-title h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    text-align: center;
}

.macro-add-comp-menu-item-title h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.macro-add-comp-menu-item-value input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.macro-add-comp-menu-item-value select {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.macro-add-comp-menu-item button {
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

.macro-add-comp-menu-item button:hover {
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
    #macro-add-comp-menu {
        margin-bottom: 0;
    }

    .macro-add-comp-menu-box {
        width: 80%;
        height: 70%;
        text-align: center;
    }
}
</style>