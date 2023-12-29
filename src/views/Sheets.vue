<script>
import config from '../config/publicVars.js'
import ItemVue from '../components/Item.vue'
import LoadWheel from '../components/LoadWheel.vue'

let observer = null

export default {
    data() {
        return {
            sheets: [],
            sheetsLoaded: false,
            menu: 'None', // None, CreateSheet
            newSheetName: '',
            validationErrors: {
                sheetName: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'O nome da ficha deve ter no mínimo 3 caracteres',
                        tooLong: 'O nome da ficha deve ter no máximo 32 caracteres',
                        invalidChars: 'O nome de usuário deve conter apenas letras, números e _',
                        duplicated: 'Já existe uma ficha com esse nome',
                    },
                },
            },
            creatingNewSheet: false,
        }
    },
    components: {
        ItemVue,
        LoadWheel
    },
    methods: {
        validateSheetName() {
            const sheetName = this.newSheetName

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
        async createNewSheet() {
            this.validateSheetName()

            if (this.validationErrors.sheetName.state) {
                return
            }
            else {
                this.creatingNewSheet = true
                const res = await fetch(`${config.API_URI}/sheet/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        sheetName: this.newSheetName
                    })
                })

                if (res.status == 201) {
                    window.location.href = `/ficha/${this.$store.getters.user.id}/${this.newSheetName}`
                }
                else {
                    const data = await res.json()

                    this.validationErrors.sheetName.state = true
                    this.validationErrors.sheetName.actualMessage = data.errors[0].message
                    this.creatingNewSheet = false
                    return
                }
            }
        }
    },
    setup() {
        const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

        observer = new MutationObserver(() => {
            if (sideMenu.getAttribute('collapsed') == 'true') {
                document.getElementById('Sheets').style.marginLeft = '4em'
                document.getElementById('Sheets').style.width = 'calc(100% - 4em)'
            }
            else {
                document.getElementById('Sheets').style.marginLeft = '23em'
                document.getElementById('Sheets').style.width = 'calc(100% - 24em)'
            }
        })

        observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })

    },
    beforeMount() {
        fetch(`${config.API_URI}/sheet/all`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.sheets = data.sheets
                this.sheetsLoaded = true
            })

    },
    watch: {
        newSheetName() {
            this.newSheetName = this.newSheetName.trim()
            this.validateSheetName()
        }
    },
    beforeRouteLeave(to, from, next) {
        observer.disconnect()
        next()
    }
}
</script>

<template>
    <div id="Sheets" ref="sheets">
        <div :class="`sheets-list ${menu == 'None' ? '' : 'hidden-div'}`">
            <h1>Suas fichas</h1>
            <div class="list-category sheets">
                <img v-if="sheetsLoaded" class="add-sheet-icon" src="../assets/img/add.svg" @click="menu = 'CreateSheet'">
                <ItemVue v-for="sheet of sheets" :key="sheet" type="1" :description="sheet.sheet_name"
                    :href="`/ficha/${sheet.user_id}/${sheet.sheet_name}`" />
                <LoadWheel class="loading loading-sheets" v-if="!sheetsLoaded" />
            </div>
            <!-- <h1>Seus templates de fichas</h1>
            <div class="list-category templates">
                <img class="add-sheet-icon" src="../assets/img/add.svg">
                <ItemVue type="4" description="teste" />
            </div>
            <h1>Fichas dos jogadores em suas campanhas modificadas recentemente</h1>
            <div class="list-category templates">
                <ItemVue type="13" description="teste" />
            </div> -->
        </div>
        <div :class="`sheets-create-new-sheet ${menu == 'CreateSheet' ? '' : 'hidden-div'}`">
            <div class="sheets-create-new-sheet-list">
                <div class="sheets-create-new-sheet-box" v-if="!creatingNewSheet">
                    <h1>Nome da ficha</h1>
                    <p v-if="validationErrors.sheetName.state">{{ validationErrors.sheetName.actualMessage }}</p>
                    <input type="text" placeholder="Nome da ficha" @keyup="newSheetName = $event.target.value"
                        @change="newSheetName = $event.target.value" />
                    <button @click="createNewSheet()">Criar ficha</button>
                    <button @click="menu = 'None'">Voltar</button>
                </div>
                <div class="sheets-create-new-sheet-box" v-else>
                    <LoadWheel class="loading-new-sheet" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#Sheets {
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

.sheets-list {
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

.sheets-list h1 {
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

.list-category .add-sheet-icon {
    width: 4em;
    height: 4em;
    margin: 0.5em;
    cursor: pointer;
    filter: var(--primary-filter);
    transition: 0.3s;
}

.list-category .add-sheet-icon:hover {
    filter: var(--secondary-filter);
}

.sheets-create-new-sheet {
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

.sheets-create-new-sheet-list {
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

.sheets-create-new-sheet-box {
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

.sheets-create-new-sheet-box h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.5em 0;
    color: var(--text);
}

.sheets-create-new-sheet-box p {
    font-size: 1em;
    font-weight: bold;
    margin: 0.5em 0;
    color: var(--text);
}

.sheets-create-new-sheet-box input {
    font-size: 1em;
    width: 70%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.sheets-create-new-sheet-box button {
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

.sheets-create-new-sheet-box button:hover {
    background-color: var(--background-secondary);
}

.loading-sheets {
    border: 10px solid var(--primary) !important;
    border-color: var(--primary) transparent var(--primary) transparent !important;
    width: 60px !important;
    height: 60px !important;
}

.loading-new-sheet {
    border: 10px solid var(--background) !important;
    border-color: var(--background) transparent var(--background) transparent !important;
    width: 60px !important;
    height: 60px !important;
}

@media (max-width: 800px) {
    #Sheets {
        margin-left: 0;
        margin-top: 2em;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .sheets-list {
        align-items: center;
    }

    .sheets-list h1 {
        width: 100%;
        text-align: center;
    }

    .list-category {
        justify-content: center !important;
    }

    .sheets-create-new-sheet {
        margin-left: 0;
        margin-top: 4em;
        width: 100% !important;
        justify-content: center;
        align-items: center;
    }

    .sheets-create-new-sheet-list {
        align-items: center;
        height: 100%;
    }

    .sheets-create-new-sheet-box {
        width: 85% !important;
        justify-content: center;
        align-items: center;
    }

    .sheets-create-new-sheet-box input {
        width: 85% !important;
        text-align: center;
    }

    .sheets-create-new-sheet-box p {
        width: 100% !important;
        text-align: center;
    }
}
</style>