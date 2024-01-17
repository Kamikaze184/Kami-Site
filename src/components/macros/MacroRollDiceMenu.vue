<script>
import { eventEmitter } from '../../utils/EventEmitter.js'
import { validateDiceString } from '../..//utils/DiceRoller.js'

export default {
    data() {
        return {
            roll: {
                name: '',
                value: '',
            },
            validationErrors: {
                name: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O nome do componente não pode ser vazio',
                        tooLong: 'O nome do componente não pode ter mais de 32 caracteres',
                        invalidChars: 'O nome do componente não pode conter caracteres especiais',
                        alreadyExists: 'O nome do componente já existe',
                    }
                },
                value: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        empty: 'O valor do componente não pode ser vazio',
                        tooLong: 'O valor do componente não pode ter mais de 256 caracteres',
                        invalidFormat: 'O formato do valor do componente é inválido, siga o exemplo: 1d6+2',
                    }
                }
            }
        }
    },
    methods: {
        closeMenu() {
            eventEmitter.emit('close-macro-menu')
            this.validationErrors = {
                name: '',
                value: ''
            }
        },
        validateName() {
            if (this.roll.name != '') {
                const name = this.roll.name

                if (name.length > 32) {
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
            }
            else {
                this.validationErrors.name.state = false
                this.validationErrors.name.actualMessage = ''
            }
        },
        validateValue() {
            const value = this.roll.value

            if (value == '') {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.empty
            }
            else if (value.length > 256) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.tooLong
            }
            else if (!validateDiceString(value)) {
                this.validationErrors.value.state = true
                this.validationErrors.value.actualMessage = this.validationErrors.value.messages.invalidFormat
            }
            else {
                this.validationErrors.value.state = false
                this.validationErrors.value.actualMessage = ''
            }
        },
        rollDice() {
            if (this.validationErrors.name.state || this.validationErrors.value.state) {
                return
            }
            else {
                eventEmitter.emit('macro-roll-dice', this.roll.value, this.roll.name != '' ? this.roll.name : 'Rolagem manual')
                this.closeMenu()
            }
        }
    }
}
</script>
<template>
    <div id="macro-roll-dice-menu" ref="macro-roll-dice-menu">
        <div class="macro-roll-dice-menu-list">
            <div class="macro-roll-dice-menu-box">
                <div class="macro-roll-dice-menu-item">
                    <div class="macro-roll-dice-menu-item-title">
                        <h1>Rolar dado manualmente</h1>
                    </div>
                </div>
                <div class="macro-roll-dice-menu-item">
                    <div class="macro-roll-dice-menu-item-title">
                        <h2>Nome do dado (Opcional)</h2>
                    </div>
                    <div class="macro-roll-dice-menu-item-value">
                        <input type="text" v-model="roll.name" @keyup="validateName()" @change="validateName()"
                            placeholder="Rolagem manual">
                        <p v-if="validationErrors.name.state">{{ validationErrors.name.actualMessage }}</p>
                    </div>
                </div>
                <div class="macro-roll-dice-menu-item">
                    <div class="macro-roll-dice-menu-item-title">
                        <h2>Valor do dado</h2>
                    </div>
                    <div class="macro-roll-dice-menu-item-value">
                        <input type="text" v-model="roll.value" @keyup="validateValue()" @change="validateValue()"
                            placeholder="1d20">
                        <p v-if="validationErrors.value.state">{{ validationErrors.value.actualMessage }}</p>
                    </div>
                </div>
                <div class="macro-roll-dice-menu-item">
                    <button @click="rollDice()">Rolar</button>
                </div>
                <div class="macro-roll-dice-menu-item">
                    <button @click="closeMenu()">Voltar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
#macro-roll-dice-menu {
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

.macro-roll-dice-menu-list {
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

.macro-roll-dice-menu-box {
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

.macro-roll-dice-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1em 0;
}

.macro-roll-dice-menu-item-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-roll-dice-menu-item-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 5px
}

.macro-roll-dice-menu-item-value p {
    font-size: 1.1em;
    font-weight: bold;
    color: var(--cancel-secondary);
    margin: 0;
    text-align: center;
}

.macro-roll-dice-menu-item-title h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    text-align: center;
}

.macro-roll-dice-menu-item-title h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.macro-roll-dice-menu-item-value input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.macro-roll-dice-menu-item-value select {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.macro-roll-dice-menu-item button {
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

.macro-roll-dice-menu-item button:hover {
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
    #macro-roll-dice-menu {
        margin-bottom: 0;
    }

    .macro-roll-dice-menu-box {
        width: 80%;
        height: 80%;
        text-align: center;
    }
}
</style>