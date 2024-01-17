<script>
import { eventEmitter } from '../../utils/EventEmitter.js'
import LoadWheel from '../LoadWheel.vue'

export default {
    data() {
        return {
            macroName: '',
            macroPublic: false,
            macroDeleteConfirm: false,
            validationErrors: {
                macroName: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'O nome do macro deve ter no mínimo 3 caracteres',
                        tooLong: 'O nome do macro deve ter no máximo 32 caracteres',
                        invalidChars: 'O nome do macro deve conter apenas letras, números e _',
                    },
                },
            },
            deletingMacro: false
        }
    },
    mounted() {
        this.macroName = this.$refs['macro-config-menu'].getAttribute('macro-name')
        this.macroPublic = this.$refs['macro-config-menu'].getAttribute('macro-visibility') === 'true'

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'macro-name') {
                        this.macroName = mutation.target.getAttribute('macro-name')
                    }
                    else if (mutation.attributeName === 'macro-visibility') {
                        this.macroPublic = mutation.target.getAttribute('macro-visibility') === 'true'
                    }
                }
            })
        })

        observer.observe(this.$refs['macro-config-menu'], {
            attributes: true,
            attributeFilter: ['macro-name', 'macro-visibility']
        })
    },
    methods: {
        closeMenu() {
            eventEmitter.emit('close-macro-menu')
            this.macroDeleteConfirm = false
        },
        validateMacroName() {
            const macroName = this.macroName

            if (macroName.length < 3) {
                this.validationErrors.macroName.state = true
                this.validationErrors.macroName.actualMessage = this.validationErrors.macroName.messages.tooShort
                return
            }
            else if (macroName.length > 32) {
                this.validationErrors.macroName.state = true
                this.validationErrors.macroName.actualMessage = this.validationErrors.macroName.messages.tooLong
                return
            }
            else if (!macroName.match(/^[a-zA-Z0-9_]{1,}(?: [a-zA-Z0-9_]+){0,}$/gim)) {
                this.validationErrors.macroName.state = true
                this.validationErrors.macroName.actualMessage = this.validationErrors.macroName.messages.invalidChars
                return
            }
            else {
                this.validationErrors.macroName.state = false
                this.validationErrors.macroName.actualMessage = ''
            }
        },
        saveMacroName() {
            this.validateMacroName()

            if (this.validationErrors.macroName.state) {
                return
            }
            else {
                eventEmitter.emit('macro-edit-macro-name', this.macroName)
            }
        },
        toggleMacroVisibility() {
            if (typeof this.macroPublic !== 'boolean') {
                return
            }
            else {
                eventEmitter.emit('macro-toggle-macro-visibility', this.macroPublic)
            }
        },
        deleteMacro() {
            if (this.macroDeleteConfirm) {
                this.deletingMacro = true
                eventEmitter.emit('macro-delete-macro')
            }
        }
    },
    watch: {
        macroName() {
            this.validateMacroName()
        },
        macroPublic() {
            this.toggleMacroVisibility()
        }
    },
    components: {
        LoadWheel
    }
}
</script>
<template>
    <div id="macro-config-menu" ref="macro-config-menu">
        <div class="macro-config-menu-list">
            <div class="macro-config-menu-box" v-if="!deletingMacro">
                <div class="macro-config-menu-item">
                    <div class="macro-config-menu-item-title">
                        <h1>Configurações do Macro</h1>
                    </div>
                </div>
                <div class="macro-config-menu-item">
                    <div class="macro-config-menu-item-title">
                        <h2>Nome do macro</h2>
                    </div>
                    <div class="macro-config-menu-item-value">
                        <p v-if="validationErrors.macroName.state">{{ validationErrors.macroName.actualMessage }}</p>
                        <input :value="macroName" type="text" placeholder="Não pode ser vazio"
                            @keyup="macroName = $event.target.value" @change="macroName = $event.target.value" />
                    </div>
                    <div class="macro-config-menu-item-value">
                        <button @click="saveMacroName()">Confirmar nome</button>
                    </div>
                </div>
                <div class="macro-config-menu-item">
                    <div class="macro-config-menu-item-title">
                        <h2>Visibilidade do macro</h2>
                    </div>
                    <div class="macro-config-menu-item-value">
                        <div class="macro-config-menu-item-row">
                            <h4>Privada</h4>
                            <div class="macro-config-menu-toggle-switch">
                                <input class="toggle-button" type="checkbox" v-model="macroPublic">
                                <span class="thumb" :class="macroPublic ? 'checked' : ''"
                                    @click="macroPublic ? macroPublic = false : macroPublic = true"></span>
                            </div>
                            <h4>Pública</h4>
                        </div>
                    </div>
                </div>

                <div class="macro-config-menu-item">
                    <button class="danger-alert-button" v-if="!macroDeleteConfirm" @click="macroDeleteConfirm = true">Apagar
                        macro</button>
                    <div class="macro-delete-confirm" v-else>
                        <p>Tem certeza que deseja apagar esse macro?</p>
                        <div class="macro-delete-confirm-buttons">
                            <button class="danger-alert-button-secondary" @click="deleteMacro()">Confirmar</button>
                            <button @click="macroDeleteConfirm = false">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="macro-config-menu-item">
                    <button @click="closeMenu()">Voltar</button>
                </div>
            </div>
            <div class="macro-config-menu-box" v-else>
                <LoadWheel />
            </div>
        </div>
    </div>
</template>
<style>
.macro-config-menu-toggle-switch {
    position: relative;
    display: inline-block;
    width: 4em;
    height: 25px;
    margin: 0;
    padding: 0;
}

.macro-config-menu-toggle-switch .toggle-button {
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

.macro-config-menu-toggle-switch .thumb {
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

.macro-config-menu-toggle-switch .checked {
    left: unset !important;
    right: 2px !important;
}

#macro-config-menu {
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

.macro-config-menu-list {
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

.macro-config-menu-box {
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

.macro-config-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1em 0;
}

.macro-config-menu-item-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.macro-config-menu-item-row h4 {
    font-size: 1em;
    font-weight: bold;
    color: var(--text);
    margin: 0 15px;
    margin-top: 5px;
}

.macro-config-menu-item-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-config-menu-item-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-config-menu-item-value p {
    font-size: 1em;
    font-weight: bold;
    color: var(--text);
    margin: 5px;
}

.macro-config-menu-item-title h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.macro-config-menu-item-title h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.macro-config-menu-item-value input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.macro-config-menu-item button {
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

.macro-config-menu-item button:hover {
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

.loading {
    height: 25px;
    width: 25px;
    border: 7px solid var(--primary);
    border-color: var(--primary) transparent var(--primary) transparent;
}

@media (max-width: 800px) {
    #macro-config-menu {
        margin-bottom: 0;
    }

    .macro-config-menu-box {
        width: 80%;
        height: 70%;
        text-align: center;
    }
}
</style>