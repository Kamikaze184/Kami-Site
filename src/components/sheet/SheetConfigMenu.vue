<script>
import { eventEmitter } from '../../utils/EventEmitter.js'
import LoadWheel from '../LoadWheel.vue'

export default {
    data() {
        return {
            sheetName: '',
            sheetPublic: false,
            sheetDeleteConfirm: false,
            validationErrors: {
                sheetName: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'O nome da ficha deve ter no mínimo 3 caracteres',
                        tooLong: 'O nome da ficha deve ter no máximo 32 caracteres',
                        invalidChars: 'O nome da ficha deve conter apenas letras, números e _',
                    },
                },
            },
            deletingSheet: false
        }
    },
    mounted() {
        this.sheetName = this.$refs['sheet-config-menu'].getAttribute('sheet-name')
        this.sheetPublic = this.$refs['sheet-config-menu'].getAttribute('sheet-visibility') === 'true'

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'sheet-name') {
                        this.sheetName = mutation.target.getAttribute('sheet-name')
                    }
                    else if (mutation.attributeName === 'sheet-visibility') {
                        this.sheetPublic = mutation.target.getAttribute('sheet-visibility') === 'true'
                    }
                }
            })
        })

        observer.observe(this.$refs['sheet-config-menu'], {
            attributes: true,
            attributeFilter: ['sheet-name', 'sheet-visibility']
        })
    },
    methods: {
        closeMenu() {
            eventEmitter.emit('close-sheet-menu')
            this.sheetDeleteConfirm = false
        },
        validateSheetName() {
            const sheetName = this.sheetName

            if (sheetName.length < 3) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.tooShort
                return
            }
            else if (sheetName.length > 32) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.tooLong
                return
            }
            else if (!sheetName.match(/^[a-zA-Z0-9_]{1,}(?: [a-zA-Z0-9_]+){0,}$/gim)) {
                this.validationErrors.sheetName.state = true
                this.validationErrors.sheetName.actualMessage = this.validationErrors.sheetName.messages.invalidChars
                return
            }
            else {
                this.validationErrors.sheetName.state = false
                this.validationErrors.sheetName.actualMessage = ''
            }
        },
        saveSheetName() {
            this.validateSheetName()

            if (this.validationErrors.sheetName.state) {
                return
            }
            else {
                eventEmitter.emit('sheet-edit-sheet-name', this.sheetName)
            }
        },
        toggleSheetVisibility() {
            if (typeof this.sheetPublic !== 'boolean') {
                return
            }
            else {
                eventEmitter.emit('sheet-toggle-sheet-visibility', this.sheetPublic)
            }
        },
        deleteSheet() {
            if (this.sheetDeleteConfirm) {
                this.deletingSheet = true
                eventEmitter.emit('sheet-delete-sheet')
            }
        }
    },
    watch: {
        sheetName() {
            this.validateSheetName()
        },
        sheetPublic() {
            this.toggleSheetVisibility()
        }
    },
    components: {
        LoadWheel
    }
}
</script>
<template>
    <div id="sheet-config-menu" ref="sheet-config-menu">
        <div class="sheet-config-menu-list">
            <div class="sheet-config-menu-box" v-if="!deletingSheet">
                <div class="sheet-config-menu-item">
                    <div class="sheet-config-menu-item-title">
                        <h1>Configurações da Ficha</h1>
                    </div>
                </div>
                <div class="sheet-config-menu-item">
                    <div class="sheet-config-menu-item-title">
                        <h2>Nome da ficha</h2>
                    </div>
                    <div class="sheet-config-menu-item-value">
                        <p v-if="validationErrors.sheetName.state">{{ validationErrors.sheetName.actualMessage }}</p>
                        <input :value="sheetName" type="text" placeholder="Não pode ser vazio"
                            @keyup="sheetName = $event.target.value" @change="sheetName = $event.target.value" />
                    </div>
                    <div class="sheet-config-menu-item-value">
                        <button @click="saveSheetName()">Confirmar nome</button>
                    </div>
                </div>
                <div class="sheet-config-menu-item">
                    <div class="sheet-config-menu-item-title">
                        <h2>Visibilidade da ficha</h2>
                    </div>
                    <div class="sheet-config-menu-item-value">
                        <div class="sheet-config-menu-item-row">
                            <h4>Privada</h4>
                            <div class="sheet-config-menu-toggle-switch">
                                <input class="toggle-button" type="checkbox" v-model="sheetPublic">
                                <span class="thumb" :class="sheetPublic ? 'checked' : ''"
                                    @click="sheetPublic ? sheetPublic = false : sheetPublic = true"></span>
                            </div>
                            <h4>Pública</h4>
                        </div>
                    </div>
                </div>

                <div class="sheet-config-menu-item">
                    <button class="danger-alert-button" v-if="!sheetDeleteConfirm" @click="sheetDeleteConfirm = true">Apagar
                        ficha</button>
                    <div class="sheet-delete-confirm" v-else>
                        <p>Tem certeza que deseja apagar essa ficha?</p>
                        <div class="sheet-delete-confirm-buttons">
                            <button class="danger-alert-button-secondary" @click="deleteSheet()">Confirmar</button>
                            <button @click="sheetDeleteConfirm = false">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="sheet-config-menu-item">
                    <button @click="closeMenu()">Voltar</button>
                </div>
            </div>
            <div class="sheet-config-menu-box" v-else>
                <LoadWheel />
            </div>
        </div>
    </div>
</template>
<style>
.sheet-config-menu-toggle-switch {
    position: relative;
    display: inline-block;
    width: 4em;
    height: 25px;
    margin: 0;
    padding: 0;
}

.sheet-config-menu-toggle-switch .toggle-button {
    appearance: none;
    -webkit-appearance: none;
    width: 4em;
    height: 31px;
    background: var(--background);
    outline: none;
    border-radius: 20px;
    padding: 0;
    margin: 0;
}

.sheet-config-menu-toggle-switch .thumb {
    width: 25px;
    height: 25px;
    z-index: 1;
    border-radius: 100%;
    background-color: var(--primary);
    position: absolute;
    margin: 0;
    top: 3px;
    left: 2px;
    transition: all 0.5s linear;
}

.sheet-config-menu-toggle-switch .checked {
    left: unset !important;
    right: 2px !important;
}

#sheet-config-menu {
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

.sheet-config-menu-list {
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

.sheet-config-menu-box {
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

.sheet-config-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1em 0;
}

.sheet-config-menu-item-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.sheet-config-menu-item-row h4 {
    font-size: 1em;
    font-weight: bold;
    color: var(--text);
    margin: 0 15px;
    margin-top: 5px;
}

.sheet-config-menu-item-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.sheet-config-menu-item-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.sheet-config-menu-item-value p {
    font-size: 1em;
    font-weight: bold;
    color: var(--text);
    margin: 5px;
}

.sheet-config-menu-item-title h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.sheet-config-menu-item-title h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.sheet-config-menu-item-value input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.sheet-config-menu-item button {
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

.sheet-config-menu-item button:hover {
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

.loading {
    height: 25px;
    width: 25px;
    border: 7px solid var(--primary);
    border-color: var(--primary) transparent var(--primary) transparent;
}

@media (max-width: 800px) {
    #sheet-config-menu {
        margin-bottom: 0;
    }

    .sheet-config-menu-box {
        width: 80%;
        height: 70%;
        text-align: center;
    }
}
</style>