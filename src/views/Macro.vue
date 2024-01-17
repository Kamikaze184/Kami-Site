<script>
import { createVNode, render } from 'vue'
import { eventEmitter } from '../utils/EventEmitter.js'
import config from '../config/publicVars.js'
import socket from '../services/websocket.service'
import { diceRoller, formatDiceStringOutput } from '../utils/DiceRoller.js'
import MacroConfigMenu from '../components/macros/MacroConfigMenu.vue'
import MacroAddCompMenu from '../components/macros/MacroAddCompMenu.vue'
import MacroAddSectionMenu from '../components/macros/MacroAddSectionMenu.vue'
import MacroEditSectionMenu from '../components/macros/MacroEditSectionMenu.vue'
import MacroRollDiceMenu from '../components/macros/MacroRollDiceMenu.vue'
import LoadWheel from '../components/LoadWheel.vue'
import lastUseStore from '../utils/LastUseStore'


import ButtonComp from '../components/macros/ButtonComp.vue'

let observer = null
let unsigned = null
let isMacroOwner = null

const componentList = [ButtonComp]

export default {
    name: 'Macro',
    data() {
        return {
            unsigned: false,
            isMacroOwner: false,
            mobile: false,
            lastWindowWidth: window.innerWidth,
            macroName: this.$route.params.macroName,
            userId: this.$route.params.userId,
            macro: {},
            macroLoaded: false,
            actualSectionIndex: 0,
            actualSectionName: 'Carregando...',
            sections: [],
            macrosErrorState: {},
            macroValidationErrors: [],
            menu: 'None', // None, AddSection, AddComp, Config, EditSection, RollDice, ShowErrors
            savingMacro: false,
            sentMacroUpdate: false,
            diceHistory: []
        }
    },
    components: {
        ButtonComp,
        MacroConfigMenu,
        MacroAddCompMenu,
        MacroAddSectionMenu,
        MacroEditSectionMenu,
        MacroRollDiceMenu,
        LoadWheel
    },
    beforeMount() {
        const { userId, macroName } = this.$route.params

        fetch(`${config.API_URI}/macro/one?userId=${userId}&macroName=${macroName}`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            cache: 'no-cache'
        })
            .then(res => res.json())
            .then(data => {
                if (data.macro) {
                    if (this.$store.state.user.id == userId) {
                        isMacroOwner = true
                    }
                    else {
                        isMacroOwner = false
                    }

                    this.isMacroOwner = isMacroOwner
                    this.unsigned = unsigned

                    this.macro = data.macro
                    this.macroLoaded = true

                    lastUseStore.set('macros', `${this.macro.user_id}-${this.macro.macro_name}`, {
                        id: this.macro.id,
                        name: this.macro.macro_name,
                        userid: this.macro.user_id,
                        username: this.macro.user.username,
                        lastUse: Date.now()
                    })

                    socket.emit('open-macro', this.macro.id)
                }
                else {
                    window.location.href = '/login'
                }
            })
            .catch(err => {
                console.log(err)
            })

        this.mobile = window.innerWidth <= 800

        window.addEventListener('resize', this.handleResize)
    },
    watch: {
        macroLoaded() {
            if (this.macroLoaded) {
                this.actualSectionIndex = 0
                this.actualSectionName = this.macro.macros.sections[0].name

                this.sections = this.getMacroSections()
                this.loadMacros()
            }
        },
        actualSectionIndex() {
            this.loadMacros()
        },
        macro: {
            handler() {
                this.sections = this.getMacroSections()
            },
            deep: true
        }
    },
    methods: {
        loadMacros() {
            render(null, this.$refs['macro-body'])
            this.$refs['macro-body'].innerHTML = ''

            const components = this.macro.macros.sections[this.actualSectionIndex].macros.map((macro, index) => {
                let component = null

                component = createVNode(
                    componentList[macro.type],
                    {
                        name: macro.name,
                        value: macro.value,
                        position: `${this.actualSectionIndex}-${index}`,
                        readonly: !isMacroOwner,
                    }
                )

                this.macrosErrorState[`${this.actualSectionIndex}-${index}`] = {
                    state: false,
                    errors: {}
                }

                return component
            })

            render(createVNode('div', { class: 'macro-body-components' }, components), this.$refs['macro-body'])
        },
        nextSection() {
            if (this.actualSectionIndex == this.macro.macros.sections.length - 1) {
                this.actualSectionIndex = 0
            }
            else {
                this.actualSectionIndex++
            }

            this.actualSectionName = this.macro.macros.sections[this.actualSectionIndex].name
        },
        previousSection() {
            if (this.actualSectionIndex == 0) {
                this.actualSectionIndex = this.macro.macros.sections.length - 1
            }
            else {
                this.actualSectionIndex--
            }

            this.actualSectionName = this.macro.macros.sections[this.actualSectionIndex].name
        },
        reDefinePosition() {
            this.macro.macros.sections.forEach((section, sectionIndex) => {
                section.position = sectionIndex

                section.macros.forEach((macro, macroIndex) => {
                    macro.position = macroIndex
                })
            })

            this.macrosErrorState = {}

            this.loadMacros()
        },
        getMacroSections() {
            return this.macro.macros.sections.map(section => { return { name: section.name, position: section.position, type: section.type } })
        },
        createNewSection(sectionName) {
            const newSection = {
                macros: [],
                name: sectionName,
                position: this.macro.macros.sections.length,
                type: 0
            }

            this.macro.macros.sections.push(newSection)
            this.actualSectionIndex = this.macro.macros.sections.length - 1
            this.actualSectionName = this.macro.macros.sections[this.actualSectionIndex].name
            this.sections = this.getMacroSections()
            eventEmitter.emit('macro-set-sections', this.sections)

            this.reDefinePosition()
        },
        editSection(sectionName) {
            this.macro.macros.sections[this.actualSectionIndex].name = sectionName
            this.actualSectionName = this.macro.macros.sections[this.actualSectionIndex].name
            this.sections = this.getMacroSections()
            eventEmitter.emit('macro-set-sections', this.sections)
        },
        openAddNewSectionMenu() {
            if (this.isMacroOwner) {
                eventEmitter.emit('macro-set-sections', this.sections)
                this.menu = 'AddSection'
            }
        },
        openEditSectionMenu() {
            if (this.isMacroOwner) {
                eventEmitter.emit('macro-set-section', this.sections)
                this.menu = 'EditSection'
            }
        },
        openAddCompMenu() {
            if (this.isMacroOwner) {
                eventEmitter.emit('macro-set-section-macros', this.macro.macros.sections[this.actualSectionIndex].macros)
                this.menu = 'AddComp'
            }
        },
        createNewComponent(component) {
            let value = '1d12'

            const newComponent = {
                name: component.name,
                value: value,
                type: 0,
                position: this.macro.macros.sections[this.actualSectionIndex].macros.length
            }

            this.macro.macros.sections[this.actualSectionIndex].macros.push(newComponent)
            this.reDefinePosition()
        },
        async saveMacro() {
            if (this.isMacroOwner == false) {
                return
            }
            else {
                const errors = []
                const editedComponents = {}

                Object.keys(this.macrosErrorState).forEach((key) => {
                    if (this.macrosErrorState[key].state) {
                        Object.keys(this.macrosErrorState[key]).forEach((errorKey) => {
                            if (errorKey != 'state') {
                                errors.push({
                                    type: 'component',
                                    position: key,
                                    message: this.macrosErrorState[key][errorKey]
                                })
                            }
                        })
                    }
                    else {
                        const sectionIndex = key.split('-')[0]
                        const componentIndex = key.split('-')[1]

                        editedComponents[key] = {
                            type: 'normal',
                            value: this.macro.macros.sections[sectionIndex].macros[componentIndex].value
                        }
                    }
                })

                if (errors.length > 0) {
                    errors.forEach(error => {
                        if (error.type == 'component') {
                            const sectionIndex = error.position.split('-')[0]
                            const componentIndex = error.position.split('-')[1]

                            this.macro.macros.sections[sectionIndex].macros[componentIndex].name

                            Object.keys(error.message).forEach(errorKey => {
                                if (error.message[errorKey].state) {
                                    this.macrosValidationErrors.push(`No componente "${this.macro.macros.sections[sectionIndex].macros[componentIndex].name}": ${error.message[errorKey].actualMessage}`)
                                }
                            })
                        }
                    })

                    this.menu = 'ShowErrors'
                    return
                }
                else {
                    this.savingMacro = true
                    const updatedMacro = {
                        ...this.macro,
                        macro_name: this.macroName,
                        macros: {
                            sections: this.macro.macros.sections.map((section) => {
                                return {
                                    ...section,
                                    macros: section.macros.map((macro) => {
                                        return macro
                                    })
                                }
                            })
                        }
                    }

                    updatedMacro.socketIdentifier = socket.id

                    const res = await fetch(`${config.API_URI}/macro/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                        body: JSON.stringify(updatedMacro)
                    })

                    if (res.status == 200) {
                        if (this.macro.macro_name != updatedMacro.macro_name) {
                            eventEmitter.emit('add-notification', `Macro ${this.macroName} renomeada e salvo`, 'As alterações foram salvas com sucesso', 'Trivial')
                            window.location.href = `/ficha/${this.userId}/${this.macroName}`
                        }
                        else {
                            eventEmitter.emit('add-notification', `Macro ${this.macroName} salvo`, 'As alterações foram salvas com sucesso', 'Trivial')
                            this.macroSavedSuccess = true
                        }
                    }
                    else if (res.status == 400) {
                        const data = await res.json()

                        this.macroValidationErrors = data.errors.map(error => error.message)
                        this.menu = 'ShowErrors'
                    }
                    else if (res.status == 401) {
                        eventEmitter.emit('add-notification', 'Erro ao salvar o macro', 'Você não tem permissão para salvar esse macro', 'Trivial')
                        localStorage.removeItem('token')
                        window.location.href = '/login'
                    }
                    else {
                        this.macroValidationErrors = ['Erro desconhecido ao tentar salvar o macro, tente novamente mais tarde']
                        this.menu = 'ShowErrors'
                    }

                    this.savingMacro = false
                }
            }
        },
        async deleteMacro() {
            if (this.isMacroOwner == false) {
                return
            }
            else {
                const res = await fetch(`${config.API_URI}/macro/delete?id=${this.macro.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                })

                if (res.status == 200) {
                    lastUseStore.delete('macros', `${this.macro.user_id}-${this.macro.macro_name}`)
                    eventEmitter.emit('add-notification', `Macro ${this.macroName} apagado`, 'O macro foi apagado com sucesso', 'Trivial')
                    window.location.href = `/macros`
                }
                else if (res.status == 401) {
                    eventEmitter.emit('add-notification', 'Erro ao apagar o macro', 'Você não tem permissão para apagar esse macro', 'Trivial')
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
                else {
                    this.macroValidationErrors = ['Erro desconhecido ao tentar apagar o macro, tente novamente mais tarde']
                    this.menu = 'ShowErrors'
                }
            }
        },
        handleResize() {
            if (this.lastWindowWidth != window.innerWidth) {
                this.mobile = window.innerWidth <= 800
                setTimeout(() => { eventEmitter.emit('resize') }, 100)
            }
        }
    },
    setup() {
        if (!unsigned) {
            const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

            observer = new MutationObserver(() => {
                if (sideMenu.getAttribute('collapsed') == 'true') {
                    document.getElementById('Macro').style.marginLeft = '0em'
                    document.getElementById('Macro').style.width = '100%'

                    if (window.innerWidth > 800) {
                        setTimeout(() => { document.querySelector('.macro-body').style.marginLeft = '50px' }, 150)
                    }
                }
                else {
                    document.getElementById('Macro').style.marginLeft = '22em'
                    document.getElementById('Macro').style.width = 'calc(100% - 22em)'

                    if (window.innerWidth > 800) {
                        setTimeout(() => { document.querySelector('.macro-body').style.marginLeft = '0px' }, 150)
                    }
                }
            })

            observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })
        }
    },
    mounted() {
        eventEmitter.on('resize', () => {
            if (this.mobile && window.innerWidth < 800 || !this.mobile && window.innerWidth >= 800) {
                this.loadMacros()
            }
        })

        eventEmitter.on('macro-roll-dice', (diceString, diceName) => {
            const diceResult = diceRoller(diceString)

            this.diceHistory.unshift({ name: diceName, value: formatDiceStringOutput(diceResult) })
        })

        eventEmitter.on('macro-remove-component', (component) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.macro.macros.sections[sectionIndex].macros.splice(componentIndex, 1)

            delete this.macrosErrorState[`${sectionIndex}-${componentIndex}`]

            this.reDefinePosition()
        })

        eventEmitter.on('macro-update-component', (component, name, value) => {
            if (name && value) {
                const sectionIndex = component.getAttribute('position').split('-')[0]
                const componentIndex = component.getAttribute('position').split('-')[1]

                this.macro.macros.sections[sectionIndex].macros[componentIndex].name = name
                this.macro.macros.sections[sectionIndex].macros[componentIndex].value = value
            }
        })

        eventEmitter.on('macro-move-component', (component, section, position) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]


            if (sectionIndex == section && componentIndex == position) {
                return
            }

            if (sectionIndex != section) {
                const component = this.macro.macros.sections[sectionIndex].macros[componentIndex]

                this.macro.macros.sections[sectionIndex].macros.splice(componentIndex, 1)
                this.macro.macros.sections[section].macros.splice(position, 0, component)
            }

            if (position != componentIndex) {
                const component = this.macro.macros.sections[sectionIndex].macros[componentIndex]

                this.macro.macros.sections[sectionIndex].macros.splice(componentIndex, 1)
                this.macro.macros.sections[sectionIndex].macros.splice(position, 0, component)
            }

            this.reDefinePosition()

            if (position != componentIndex) {
                eventEmitter.emit('macro-component-being-moved', component)
            }
        })

        eventEmitter.on('macro-invalid-component', (component, errors) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.macrosErrorState[`${sectionIndex}-${componentIndex}`] = {
                state: true,
                errors: errors
            }
        })

        eventEmitter.on('macro-valid-component', (component) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.macrosErrorState[`${sectionIndex}-${componentIndex}`] = {
                state: false,
                errors: {}
            }
        })

        eventEmitter.on('macro-edit-macro-name', (macroName) => {
            this.macroName = macroName
            this.menu = 'None'
        })

        eventEmitter.on('macro-get-sections', () => {
            eventEmitter.emit('macro-set-sections', this.sections)
        })

        eventEmitter.on('macro-get-max-position', () => {
            eventEmitter.emit('macro-set-max-position', this.macro.macros.sections[this.actualSectionIndex].macros.length - 1)
        })

        eventEmitter.on('close-macro-menu', () => {
            this.menu = 'None'
        })

        eventEmitter.on('macro-create-new-section', (sectionName) => {
            this.menu = 'None'
            this.createNewSection(sectionName)
        })

        eventEmitter.on('macro-create-new-component', (component) => {
            this.menu = 'None'
            this.createNewComponent(component)
        })

        eventEmitter.on('macro-edit-section', (sectionName) => {
            this.menu = 'None'
            this.editSection(sectionName)
        })

        eventEmitter.on('macro-get-actual-section', () => {
            eventEmitter.emit('macro-set-actual-section', this.macro.macros.sections[this.actualSectionIndex])
        })

        eventEmitter.on('macro-delete-macro', () => {
            this.deleteMacro()
        })

        eventEmitter.on('macro-toggle-macro-visibility', (macro_visibility) => {
            this.macro.is_public = macro_visibility
        })

        eventEmitter.on('macro-delete-section', (section) => {
            this.menu = 'None'
            this.macro.macros.sections.splice(section.position, 1)
            this.actualSectionIndex = 0
            this.actualSectionName = this.macro.macros.sections[this.actualSectionIndex].name
            this.sections = this.getMacroSections()
            eventEmitter.emit('macro-set-sections', this.sections)
            this.reDefinePosition()
        })

        eventEmitter.on('macro-clear-section', (section) => {
            this.menu = 'None'
            this.macro.macros.sections[section.position].macros = []
            this.reDefinePosition()
        })

        socket.on('macro-updated', (macro, socketIdentifier) => {
            if (macro.id == this.macro.id && socketIdentifier != socket.id) {
                this.macro = macro

                if (macro.macro_name != this.macroName) {
                    window.location.href = `/macro/${this.userId}/${macro.macro_name}`
                }
                else if (!macro.is_public && !this.isMacroOwner) {
                    if (this.unsigned) {
                        window.location.href = '/login'
                    }
                    else {
                        window.location.href = '/macros'
                    }
                }
                else {
                    eventEmitter.emit('add-notification', 'Macro atualizado', 'O macro foi atualizado em outro dispositivo', 'Trivial')
                    if (macro.macros.sections[this.actualSectionIndex] == undefined) {
                        this.actualSectionIndex = 0
                    }
                    else if (macro.macros.sections[this.actualSectionIndex].name != this.actualSectionName) {
                        this.actualSectionName = macro.macros.sections[this.actualSectionIndex].name
                    }

                    this.sections = this.getMacroSections()
                    this.loadMacros()
                }
            }
        })

        socket.on('macro-deleted', (macroId) => {
            if (macroId == this.macro.id) {
                window.location.href = '/macros'
            }
        })

        if (unsigned) {
            document.getElementById('Macro').style.marginLeft = '0 !important'
            document.getElementById('Macro').style.width = '100% !important'
        }
    },
    beforeRouteEnter(to, from, next) {
        if (localStorage.getItem('token')) {
            unsigned = false
        }
        else {
            unsigned = true
            isMacroOwner = false
        }

        next()
    },
    beforeRouteLeave(to, from, next) {
        try {
            window.removeEventListener('resize', this.handleResize)
            observer.disconnect()
            eventEmitter.off('resize')
            //socket.emit('close-macro', this.macro.id)
        }
        catch (err) { }
        window.location.href = to.path
    }
}
</script>
<template>
    <div id="Macro" ref="macro" :style="unsigned ? 'margin-left: 0 !important; width: 100% !important;' : ''">
        <div class="macro" ref="macro" v-if="!mobile" :class="menu == 'None' ? '' : 'hidden-div'">
            <div class="macro-tool-bar">
                <h2>Macro: {{ macroName }}</h2>
                <div class="macro-tool-bar-buttons" v-if="isMacroOwner">
                    <button class="macro-tool-bar-item" @click="menu = 'Config'">
                        <img src="../assets/img/setting.svg">
                        <h4>Configurações</h4>
                    </button>
                    <button class="macro-tool-bar-item" @click="saveMacro()" v-if="!savingMacro">
                        <img src="../assets/img/save.svg">
                        <h4>Salvar</h4>
                    </button>
                    <button class="macro-tool-bar-item" disabled v-else>
                        <LoadWheel class="loading loading-saving-macro" />
                    </button>
                    <button class="macro-tool-bar-item" @click="openAddNewSectionMenu()">
                        <img src="../assets/img/add-section.svg">
                        <h4>Adicionar seção</h4>
                    </button>
                    <button class="macro-tool-bar-item" @click="openAddCompMenu()">
                        <img src="../assets/img/add-component.svg">
                        <h4>Adicionar componente</h4>
                    </button>
                    <button class="macro-tool-bar-item" @click="menu = 'RollDice'">
                        <img src="../assets/img/dice.svg">
                        <h4>Rolar dado manualmente</h4>
                    </button>
                </div>
                <div class="macro-tool-bar-buttons" v-else="isMacroOwner">
                    <router-link to="/">Inicio</router-link>
                    <router-link to="/comandos">Comandos</router-link>
                    <router-link to="/tutoriais">Tutoriais</router-link>
                    <router-link to="/login">Login</router-link>
                </div>
            </div>
            <div class="macro-history" v-if="diceHistory.length > 0">
                <h2>Rolagens:</h2>
                <div class="macro-history-body">
                    <div class="macro-history-body-item" v-for="dice of diceHistory" :key="dice">
                        <div class="macro-history-body-item-name">
                            <h4>{{ dice.name }}</h4>
                        </div>
                        <div class="macro-history-body-item-value">
                            <h4>{{ dice.value }}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="macro-section" index="0" ref="section">
                <img src="../assets/img/navigateIcon.svg" class="previous-section" @click="previousSection()">
                <h1 @click="openEditSectionMenu()">{{ actualSectionName }}</h1>
                <p @click="openEditSectionMenu()" v-if="isMacroOwner">Clique para Editar</p>
                <img src="../assets/img/navigateIcon.svg" class="next-section" @click="nextSection()">
            </div>
            <div class="macro-body" ref="macro-body">
            </div>
        </div>
        <div class="macro-mobile" ref="macro" :class="menu == 'None' ? '' : 'hidden-div'" v-else>
            <div class="macro-title-mobile">
                <h2>Macro: {{ macroName }}</h2>
            </div>
            <div class="macro-tool-bar-mobile" v-if="isMacroOwner">
                <button class="macro-tool-bar-mobile-item" @click="menu = 'Config'">
                    <img src="../assets/img/setting.svg">
                </button>
                <button class="macro-tool-bar-mobile-item" @click="saveMacro()" v-if="!savingMacro">
                    <img src="../assets/img/save.svg">
                </button>
                <button class="macro-tool-bar-mobile-item" disabled v-else>
                    <LoadWheel class="loading loading-saving-macro-mobile" />
                </button>
                <button class="macro-tool-bar-mobile-item" @click="openAddNewSectionMenu()">
                    <img src="../assets/img/add-section.svg">
                </button>
                <button class="macro-tool-bar-mobile-item" @click="openAddCompMenu()">
                    <img src="../assets/img/add-component.svg">
                </button>
                <button class="macro-tool-bar-mobile-item" @click="menu = 'RollDice'">
                    <img src="../assets/img/dice.svg">
                </button>
            </div>
            <div class="macro-history-mobile" v-if="diceHistory.length > 0">
                <h2>Rolagens:</h2>
                <div class="macro-history-body-mobile">
                    <div class="macro-history-body-item-mobile" v-for="dice of diceHistory" :key="dice">
                        <div class="macro-history-body-item-name-mobile">
                            <h4>{{ dice.name }}</h4>
                        </div>
                        <div class="macro-history-body-item-value-mobile">
                            <h4>{{ dice.value }}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="macro-section-mobile" index="0" ref="section">
                <img src="../assets/img/navigateIcon.svg" class="previous-section" @click="previousSection()">
                <h1 @click="openEditSectionMenu()">{{ actualSectionName }}</h1>
                <p @click="openEditSectionMenu()" v-if="isMacroOwner">Clique para Editar</p>
                <img src="../assets/img/navigateIcon.svg" class="next-section" @click="nextSection()">
            </div>
            <div class="macro-body-mobile" ref="macro-body">

            </div>
        </div>
        <MacroConfigMenu :class="menu == 'Config' ? '' : 'hidden-div'" :macro-name="macroName"
            :macro-visibility="macro.is_public" v-if="isMacroOwner" />
        <MacroAddSectionMenu :class="menu == 'AddSection' ? '' : 'hidden-div'" v-if="isMacroOwner" />
        <MacroAddCompMenu :class="menu == 'AddComp' ? '' : 'hidden-div'" v-if="isMacroOwner" />
        <MacroEditSectionMenu :class="menu == 'EditSection' ? '' : 'hidden-div'" v-if="isMacroOwner" />
        <MacroRollDiceMenu :class="menu == 'RollDice' ? '' : 'hidden-div'" />
        <div :class="`macro-show-validation-errors ${menu == 'ShowErrors' ? '' : 'hidden-div'}`" v-if="isMacroOwner">
            <div class="macro-show-validation-errors-list">
                <div class="macro-show-validation-errors-box">
                    <h1>Erros de validação ao tentar salvar o macro</h1>
                    <p v-for="error of macroValidationErrors" :key="error">{{ error }}</p>
                    <button @click="menu = 'None'">Voltar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.hidden-div {
    display: none !important;
}

#Macro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    margin-left: 22em;
    margin-bottom: 4em;
    overflow: hidden;
    width: calc(100% - 22em);
    transition: all 0.5s linear;
    z-index: 2 !important;
    padding: 0;
}

.macro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 3 !important;
}

.macro-tool-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 4em;
    background-color: var(--primary);
    margin: 0;
    padding: 2px 60px;
    position: static;
}

.macro-tool-bar h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
}

.macro-tool-bar-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 60%;
    height: 100%;
    margin: 0;
    padding: 0;
    padding-right: 7em;
}

.macro-tool-bar-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 10em;
    height: 3.5em;
    background-color: var(--background);
    margin: 5px;
    padding: 5px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: 0.3s all linear;
    position: relative;
}

.macro-tool-bar-buttons a {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 8em;
    height: 2em;
    background-color: var(--background);
    margin: 5px;
    padding: 5px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: 0.3s all linear;
    position: relative;
    text-decoration: none;
    color: var(--text);
    font-weight: bold;
    font-size: 1.2em;
}

.macro-tool-bar-buttons a:hover {
    background-color: var(--background-secondary);
}

.macro-tool-bar-item h4 {
    font-size: 1.2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    margin-left: 0.2em;
    z-index: 1;
}

.macro-tool-bar-item img {
    width: 3em;
    height: 3em;
    margin: 0;
    padding: 0;
    filter: var(--primary-filter);
    opacity: 0.7;
    transition: 0.3s all linear;
    position: absolute;
    z-index: 0;
}

.macro-tool-bar-item:hover {
    background-color: var(--background-secondary);
}

.macro-tool-bar-item:hover>img {
    filter: var(--background-filter);
}

.macro-history {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    overflow: hidden;
    z-index: 2 !important;
    padding: 0 30px;
    height: 6em;
    background-color: var(--primary);
}

.macro-history-body {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 0;
    margin: 0 60px 0 0 !important;
    overflow: hidden;
    z-index: 2 !important;
    height: 5em;
    background-color: var(--primary);
    overflow-x: auto;
}

.macro-history-body::-webkit-scrollbar {
    height: 1em;
    border-radius: 10px;
}

.macro-history-body::-webkit-scrollbar-track {
    background-color: var(--background-secondary);
}

.macro-history-body::-webkit-scrollbar-thumb {
    background-color: var(--background);
    border-radius: 10px;
}

.macro-history-body-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: max-content;
    height: 3em;
    background-color: var(--background);
    margin: 3px;
    padding: 2px 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s all linear;
    position: relative;
    color: var(--text);
    overflow-x: auto;
    overflow-y: hidden;
}

.macro-history-body-item-name {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: max-content;
    height: 2em;
    background-color: var(--background);
    margin: 0;
    margin-bottom: 2px;
    padding: 0;
    border: none;
    transition: 0.3s all linear;
    position: relative;
    color: var(--text);
    overflow-x: auto;
    overflow-y: hidden;
}

.macro-history-body-item-value {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: max-content;
    height: 2em;
    background-color: var(--background);
    margin: 0;
    padding: 0;
    border: none;
    transition: 0.3s all linear;
    position: relative;
    color: var(--text);
    overflow-x: auto;
    overflow-y: hidden;
}

.macro-history h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    margin-right: 5px;
    padding: 0;
    text-align: center;
    width: 6em;
}

.macro-section {
    display: grid;
    grid-template-columns: 15% 70% 15%;
    grid-template-rows: 70% 30%;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    grid-template-areas:
        "previous title next"
        "previous expand next"
    ;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color: var(--primary);
    margin: 0;
    margin-bottom: 1em;
    padding: 0;
    position: static;
}

.macro-section h1 {
    grid-area: title;
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    cursor: pointer;
}

.macro-section p {
    grid-area: expand;
    font-size: 0.8em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    background-color: var(--background);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 2px 10px;
    cursor: pointer;
}

.macro-section img {
    grid-area: previous;
    width: 100%;
    height: 2.5em;
    margin: 0;
    padding: 0;
    rotate: 180deg;
    filter: var(--background-filter);
    cursor: pointer;
    transition: 0.3s all linear;
}

.macro-section img:hover {
    filter: var(--background-secondary-filter)
}

.macro-section img.next-section {
    grid-area: next;
    rotate: 0deg;
}

.macro-body {
    transition: all 0.5s linear;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
}

.macro-body-components {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    align-content: space-between;
    width: 92%;
    height: 100%;
    margin: 0;
    padding: 0;
    padding-bottom: 0.5em;
}

.macro-show-validation-errors {
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

.macro-show-validation-errors-list {
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

.macro-show-validation-errors-box {
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
    overflow-y: auto;
}

.macro-show-validation-errors-box h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 1em;
    padding: 0;
    text-align: center;
}

.macro-show-validation-errors-box p {
    font-size: 1.1em;
    font-weight: bold;
    color: var(--text);
    margin: 10px;
    padding: 0;
    text-align: center;
}

.macro-show-validation-errors-box button {
    width: 12em;
    height: 3em;
    background-color: var(--background);
    color: var(--text);
    font-weight: bold;
    font-size: 1em;
    margin: 5px;
    padding: 5px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: 0.3s all linear;
}

.macro-show-validation-errors-box button:hover {
    background-color: var(--background-secondary);
}

.loading-saving-macro {
    height: 25px !important;
    width: 25px !important;
    border: 7px solid var(--primary) !important;
    border-color: var(--primary) transparent var(--primary) transparent !important;
}

.macro-mobile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0;
    margin-top: calc(3.5em + 2px);
    padding: 0;
    overflow: hidden;
    z-index: 2 !important;
}

.macro-title-mobile {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 3.5em;
    padding: 8px 0 0 0;
    background-color: var(--background);
    border-bottom: 2px solid var(--primary);
    margin: 0;
    position: fixed !important;
    top: 0 !important;
    left: 0;
    z-index: 2;
}

.macro-title-mobile h2 {
    font-size: 1.2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    margin-right: 1em;
}

.macro-tool-bar-mobile {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color: var(--background);
    border-top: 2px solid var(--primary);
    margin: 0;
    position: fixed !important;
    bottom: 0 !important;
    left: 0;
    z-index: 2;
}

.macro-tool-bar-mobile-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 3em;
    height: 3em;
    background-color: var(--primary);
    border: 2px solid var(--primary);
    border-radius: 25%;
    margin: 0;
    padding: 2px;
    box-shadow: 0px 0px 3px 0px var(--primary);
}

.macro-tool-bar-mobile-item img {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    filter: var(--background-filter);
    transition: 0.3s all linear;
}

.loading-saving-macro-mobile {
    height: 20px !important;
    width: 20px !important;
    border: 5px solid var(--background) !important;
    border-color: var(--background) transparent var(--background) transparent !important;
}

.macro-history-mobile {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin: 0;
    overflow: hidden;
    height: 6.5em;
    background-color: var(--primary);
}

.macro-history-mobile h2 {
    font-size: 1em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    margin-right: 5px;
    padding: 0;
    text-align: center;
    width: 100%;
}

.macro-history-body-mobile {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-content: flex-start;
    align-items: center;
    width: 95%;
    padding: 0;
    padding: 0 10px;
    margin: 0;
    overflow: hidden;
    height: 5em;
    background-color: var(--primary);
    overflow-x: auto;
}

.macro-history-body-mobile::-webkit-scrollbar {
    height: 1em;
    border-radius: 10px;
}

.macro-history-body-mobile::-webkit-scrollbar-track {
    background-color: var(--background-secondary);
}

.macro-history-body-mobile::-webkit-scrollbar-thumb {
    background-color: var(--background);
    border-radius: 10px;
}

.macro-history-body-item-mobile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: max-content;
    height: 3em;
    background-color: var(--background);
    margin: 3px;
    padding: 2px 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s all linear;
    position: relative;
    color: var(--text);
    overflow-x: auto;
    overflow-y: hidden;
}

.macro-history-body-item-name-mobile {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: max-content;
    height: 2em;
    background-color: var(--background);
    margin: 0;
    padding: 0;
    border: none;
    transition: 0.3s all linear;
    position: relative;
    color: var(--text);
    overflow-x: auto;
    overflow-y: hidden;
}

.macro-history-body-item-value-mobile {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: max-content;
    height: 2em;
    background-color: var(--background);
    margin: 0;
    padding: 0;
    border: none;
    transition: 0.3s all linear;
    position: relative;
    color: var(--text);
    overflow-x: auto;
    overflow-y: hidden;
}

.macro-section-mobile {
    display: grid;
    grid-template-columns: 15% 70% 15%;
    grid-template-rows: 70% 30%;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    grid-template-areas:
        "previous title next"
        "previous expand next"
    ;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color: var(--primary);
    margin: 0;
    margin-bottom: 1em;
}

.macro-section-mobile h1 {
    grid-area: title;
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    cursor: pointer;
}

.macro-section-mobile p {
    grid-area: expand;
    font-size: 0.8em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    background-color: var(--background);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 2px 10px;
    cursor: pointer;
}

.macro-section-mobile img {
    grid-area: previous;
    width: 100%;
    height: 2.5em;
    margin: 0;
    padding: 0;
    rotate: 180deg;
    filter: var(--background-filter);
    cursor: pointer;
    transition: 0.3s all linear;
}

.macro-section-mobile img.next-section {
    grid-area: next;
    rotate: 0deg;
}

.macro-body-mobile {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    align-content: space-between;
    width: 100%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
}

@media (max-width: 800px) {
    #Macro {
        margin-left: 0;
        margin-top: 7px;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .macro-tool-bar {
        justify-content: center;
    }

    .macro-tool-bar-buttons {
        justify-content: center;
    }

    .macro-section {
        grid-template-columns: 10% 80% 10%;
    }

    .macro-section h1 {
        font-size: 1.2em;
    }

    .macro-section p {
        font-size: 0.7em;
    }

    .macro-section img {
        width: 100%;
        height: 2em;
    }

    .macro-body {
        margin-left: 0;
    }

    .macro-body-components {
        width: 100%;
    }

    .macro-show-validation-errors-box {
        width: 90%;
        height: 90%;
    }
}
</style>
