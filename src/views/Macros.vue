<script>
import config from '../config/publicVars.js'
import ItemVue from '../components/Item.vue'
import LoadWheel from '../components/LoadWheel.vue'

let observer = null

export default {
    data() {
        return {
            macros: [],
            macrosLoaded: false,
            menu: 'None', // None, CreateMacro
            newMacroName: '',
            validationErrors: {
                macroName: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'O nome do macro deve ter no mínimo 3 caracteres',
                        tooLong: 'O nome do macro deve ter no máximo 32 caracteres',
                        invalidChars: 'O nome do macro deve conter apenas letras, números e _',
                        duplicated: 'Já existe um macro com esse nome',
                    },
                },
            },
            creatingNewMacro: false,
        }
    },
    components: {
        ItemVue,
        LoadWheel
    },
    methods: {
        validateMacroName() {
            const macroName = this.newMacroName

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
        async createNewMacro() {
            this.validateMacroName()

            if (this.validationErrors.macroName.state) {
                return
            }
            else {
                this.creatingNewMacro = true
                const res = await fetch(`${config.API_URI}/macro/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        macroName: this.newMacroName
                    })
                })

                if (res.status == 201) {
                    window.location.href = `/macro/${this.$store.getters.user.id}/${this.newMacroName}`
                }
                else {
                    const data = await res.json()

                    this.validationErrors.macroName.state = true
                    this.validationErrors.macroName.actualMessage = data.errors[0].message
                    this.creatingNewMacro = false
                    return
                }
            }
        }
    },
    setup() {
        const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

        observer = new MutationObserver(() => {
            if (sideMenu.getAttribute('collapsed') == 'true') {
                if (window.innerWidth > 800) {
                    document.getElementById('Macros').style.marginLeft = '4em'
                    document.getElementById('Macros').style.width = 'calc(100% - 4em)'
                }
                else {
                    document.getElementById('Macros').style.marginLeft = '0'
                    document.getElementById('Macros').style.width = '100%'
                }
            }
            else {
                if (window.innerWidth > 800) {
                    document.getElementById('Macros').style.marginLeft = '23em'
                    document.getElementById('Macros').style.width = 'calc(100% - 24em)'
                }
                else {
                    document.getElementById('Macros').style.marginLeft = '0'
                    document.getElementById('Macros').style.width = '100%'
                }
            }
        })

        observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })

    },
    beforeMount() {
        fetch(`${config.API_URI}/macro/all`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.macros = []
                }
                else {
                    this.macros = data.macros
                }
                this.macrosLoaded = true
            })
    },
    watch: {
        newMacroName() {
            this.newMacroName = this.newMacroName.trim()
            this.validateMacroName()
        }
    },
    beforeRouteLeave(to, from, next) {
        observer.disconnect()
        next()
    },
}
</script>

<template>
    <div id="Macros" ref="macros">
        <div :class="`macros-list ${menu == 'None' ? '' : 'hidden-div'}`">
            <h1>Seus Macros</h1>
            <div class="list-category macros">
                <img v-if="macrosLoaded" class="add-macro-icon" src="../assets/img/add.svg" @click="menu = 'CreateMacro'">
                <ItemVue v-for="macro of macros" :key="macro" type="3" :description="macro.macro_name"
                    :href="`/macro/${macro.user_id}/${macro.macro_name}`" />
                <LoadWheel class="loading loading-macros" v-if="!macrosLoaded" />
            </div>
            <!-- <h1>Seus macros de campanhas</h1>
            <div class="list-category templates">
                <ItemVue type="3" description="teste" />
            </div> -->
        </div>
        <div :class="`macros-create-new-macro ${menu == 'CreateMacro' ? '' : 'hidden-div'}`">
            <div class="macros-create-new-macro-list">
                <div class="macros-create-new-macro-box" v-if="!creatingNewMacro">
                    <h1>Nome do macro</h1>
                    <p v-if="validationErrors.macroName.state">{{ validationErrors.macroName.actualMessage }}</p>
                    <input type="text" placeholder="Nome da ficha" @keyup="newMacroName = $event.target.value"
                        @change="newMacroName = $event.target.value" />
                    <button @click="createNewMacro()">Criar Macro</button>
                    <button @click="menu = 'None'">Voltar</button>
                </div>
                <div class="macros-create-new-macro-box" v-else>
                    <LoadWheel class="loading-new-macro" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#Macros {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    margin-left: 23em;
    margin-bottom: 4em;
    overflow: hidden;
    width: calc(100% - 24em);
    transition: all 0.5s linear;
    z-index: 2 !important;
}

.macros-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    padding: 0 1em;
    overflow-y: auto;
    z-index: 2 !important;
}

.macros-list h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.5em 0;
    color: var(--text);
}

.list-category {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.list-category .add-macro-icon {
    width: 4em;
    height: 4em;
    margin: 0.5em;
    cursor: pointer;
    filter: var(--primary-filter);
    transition: 0.3s;
}

.list-category .add-macro-icon:hover {
    filter: var(--secondary-filter);
}

.macros-create-new-macro {
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

.macros-create-new-macro-list {
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

.macros-create-new-macro-box {
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

.macros-create-new-macro-box h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.5em 0;
    color: var(--text);
}

.macros-create-new-macro-box p {
    font-size: 1em;
    font-weight: bold;
    margin: 0.5em 0;
    color: var(--text);
}

.macros-create-new-macro-box input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.macros-create-new-macro-box button {
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
    margin: 0.5em 0;
}

.macros-create-new-macro-box button:hover {
    background-color: var(--background-secondary);
}

.loading-macros {
    border: 10px solid var(--primary) !important;
    border-color: var(--primary) transparent var(--primary) transparent !important;
    width: 60px !important;
    height: 60px !important;
}

.loading-new-macro {
    border: 10px solid var(--background) !important;
    border-color: var(--background) transparent var(--background) transparent !important;
    width: 60px !important;
    height: 60px !important;
}

@media (max-width: 800px) {
    #Macros {
        margin-left: 0 !important;
        margin-top: 2em;
        width: 100% !important;
        justify-content: center;
        align-items: center;
    }

    .macros-list {
        align-items: center;
    }

    .macros-list h1 {
        width: 100%;
        text-align: center;
    }

    .list-category {
        justify-content: center !important;
    }

    .macros-create-new-macro {
        margin-left: 0;
        margin-top: 4em;
        width: 100% !important;
        justify-content: center;
        align-items: center;
    }

    .macros-create-new-macro-list {
        align-items: center;
        height: 100%;
    }

    .macros-create-new-macro-box {
        width: 85% !important;
        justify-content: center;
        align-items: center;
    }

    .macros-create-new-macro-box input {
        width: 85% !important;
        text-align: center;
    }

    .macros-create-new-macro-box p {
        width: 100% !important;
        text-align: center;
    }
}
</style>