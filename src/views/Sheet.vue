<script>
import { createVNode, render } from 'vue'
import ItemVue from '../components/Item.vue'
import LoadWheel from '../components/LoadWheel.vue'
import SheetBar from '../components/sheet/SheetBar.vue'
import SheetNumber from '../components/sheet/SheetNumber.vue'
import SheetLongText from '../components/sheet/SheetLongText.vue'
import SheetList from '../components/sheet/SheetList.vue'
import SheetImage from '../components/sheet/SheetImage.vue'
import SheetConfigMenu from '../components/sheet/SheetConfigMenu.vue'
import SheetAddSectionMenu from '../components/sheet/SheetAddSectionMenu.vue'
import SheetAddCompMenu from '../components/sheet/SheetAddCompMenu.vue'
import SheetEditSectionMenu from '../components/sheet/SheetEditSectionMenu.vue'
import { eventEmitter } from '../utils/EventEmitter.js'
import config from '../config/publicVars.js'

const componentList = [SheetLongText, SheetNumber, SheetImage, SheetList, SheetBar]

let observer = null
let unsigned = null
let isSheetOwner = null

export default {
    data() {
        return {
            unsigned: false,
            isSheetOwner: false,
            mobile: false,
            lastWindowWidth: window.innerWidth,
            sheetName: this.$route.params.sheetName,
            userId: this.$route.params.userId,
            sheet: {},
            sheetLoaded: false,
            actualSectionIndex: 0,
            actualSectionName: 'Carregando...',
            sections: [],
            componentsErrorState: {},
            sheetValidationErrors: [],
            menu: 'None', // None, AddSection, AddComp, Config, EditSection, ShowErrors
            savingSheet: false
        }
    },
    components: {
        ItemVue,
        LoadWheel,
        SheetBar,
        SheetNumber,
        SheetLongText,
        SheetList,
        SheetImage,
        SheetConfigMenu,
        SheetAddSectionMenu,
        SheetAddCompMenu,
        SheetEditSectionMenu,
        SheetLongText
    },
    beforeMount() {
        const { userId, sheetName } = this.$route.params

        fetch(`${config.API_URI}/sheet/one?userId=${userId}&sheetName=${sheetName}`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            cache: 'no-cache'
        })
            .then(response => response.json())
            .then(data => {
                if (data.sheet) {
                    if (this.$store.state.user.id == userId) {
                        isSheetOwner = true
                    }
                    else {
                        isSheetOwner = false
                    }

                    this.isSheetOwner = isSheetOwner
                    this.unsigned = unsigned


                    if (data.sheet.legacy == true) {
                        const sheet = {
                            attributes: { sections: [{ attributes: [], name: 'Info', position: 0, type: 0 }] },
                            id: data.sheet.id,
                            sheet_name: data.sheet.sheet_name,
                            user_id: data.sheet.user_id,
                            sheet_name: data.sheet.sheet_name,
                            sheet_passoword: data.sheet.sheet_password,
                            is_public: data.sheet.is_public,
                            legacy: false,
                            user: data.sheet.user
                        }

                        let position = 0
                        for (let attribute of Object.keys(data.sheet.attributes)) {
                            sheet.attributes.sections[0].attributes.push({
                                name: attribute,
                                value: data.sheet.attributes[attribute],
                                type: isNaN(Number(data.sheet.attributes[attribute])) ? 0 : 1,
                                position: position
                            })

                            position++
                        }

                        this.sheet = sheet
                        this.sheetLoaded = true
                    }
                    else {
                        this.sheet = data.sheet
                        this.sheetLoaded = true
                    }
                }
                else {
                    window.location.href = '/login'
                }
            })
            .catch(error => {
                console.log(error)
            })

        this.mobile = window.innerWidth <= 800

        window.addEventListener('resize', this.handleResize)
    },
    watch: {
        sheetLoaded() {
            if (this.sheetLoaded) {
                this.actualSectionIndex = 0
                this.actualSectionName = this.sheet.attributes.sections[0].name

                this.sections = this.getSheetSections()
                this.loadAttributes()
            }
        },
        actualSectionIndex() {
            this.loadAttributes()
        },
        sheet: {
            handler() {
                this.sections = this.getSheetSections()
            },
            deep: true
        }
    },
    methods: {
        loadAttributes() {
            render(null, this.$refs['sheet-body'])
            this.$refs['sheet-body'].innerHTML = ''

            const components = this.sheet.attributes.sections[this.actualSectionIndex].attributes.map((attribute, index) => {
                if (typeof attribute.value == 'object') {
                    attribute.value = JSON.stringify(attribute.value)
                }

                let component = null

                component = createVNode(
                    componentList[attribute.type],
                    {
                        name: attribute.type == 2 ? undefined : attribute.name,
                        value: attribute.value,
                        position: `${this.actualSectionIndex}-${index}`,
                        readonly: !isSheetOwner,
                    }
                )

                this.componentsErrorState[`${this.actualSectionIndex}-${index}`] = {
                    state: false,
                    errors: {}
                }

                return component
            })

            render(createVNode('div', { class: 'sheet-body-components' }, components), this.$refs['sheet-body'])
        },
        nextSection() {
            if (this.actualSectionIndex == this.sheet.attributes.sections.length - 1) {
                this.actualSectionIndex = 0
            }
            else {
                this.actualSectionIndex++
            }

            this.actualSectionName = this.sheet.attributes.sections[this.actualSectionIndex].name
        },
        previousSection() {
            if (this.actualSectionIndex == 0) {
                this.actualSectionIndex = this.sheet.attributes.sections.length - 1
            }
            else {
                this.actualSectionIndex--
            }

            this.actualSectionName = this.sheet.attributes.sections[this.actualSectionIndex].name
        },
        reDefinePosition() {
            this.sheet.attributes.sections.forEach((section, sectionIndex) => {
                section.position = sectionIndex

                section.attributes.forEach((attribute, attributeIndex) => {
                    attribute.position = attributeIndex
                })
            })

            this.componentsErrorState = {}

            this.loadAttributes()
        },
        getSheetSections() {
            return this.sheet.attributes.sections.map(section => { return { name: section.name, position: section.position, type: section.type } })
        },
        createNewSection(sectionName) {
            const newSection = {
                attributes: [],
                name: sectionName,
                position: this.sheet.attributes.sections.length,
                type: 0
            }

            this.sheet.attributes.sections.push(newSection)
            this.actualSectionIndex = this.sheet.attributes.sections.length - 1
            this.actualSectionName = this.sheet.attributes.sections[this.actualSectionIndex].name
            this.sections = this.getSheetSections()
            eventEmitter.emit('set-sections', this.sections)

            this.reDefinePosition()
        },
        editSection(sectionName) {
            this.sheet.attributes.sections[this.actualSectionIndex].name = sectionName
            this.actualSectionName = this.sheet.attributes.sections[this.actualSectionIndex].name
            this.sections = this.getSheetSections()
            eventEmitter.emit('set-sections', this.sections)
        },
        openAddNewSectionMenu() {
            if (this.isSheetOwner) {
                eventEmitter.emit('set-sections', this.sections)
                this.menu = 'AddSection'
            }
        },
        openEditSectionMenu() {
            if (this.isSheetOwner) {
                eventEmitter.emit('set-section', this.sections)
                this.menu = 'EditSection'
            }
        },
        openAddCompMenu() {
            if (this.isSheetOwner) {
                eventEmitter.emit('set-section-attributes', this.sheet.attributes.sections[this.actualSectionIndex].attributes)
                this.menu = 'AddComp'
            }
        },
        createNewComponent(component) {
            let value = 'Clique para alterar'

            if (component.type == 2) {
                value = 'https://www.kamiapp.com.br/assets/img/logo.webp'
            }
            else if (component.type == 3) {
                value = { items: [] }
            }
            else if (component.type == 4) {
                value = { actual: 10, max: 100, min: 0, step: 1 }
            }

            const newComponent = {
                name: component.name,
                value: value,
                type: component.type,
                position: this.sheet.attributes.sections[this.actualSectionIndex].attributes.length
            }

            this.sheet.attributes.sections[this.actualSectionIndex].attributes.push(newComponent)
            this.reDefinePosition()
        },
        async saveSheet() {
            if (this.isSheetOwner == false) {
                return
            }
            else {
                const errors = []
                const editedComponents = {}

                Object.keys(this.componentsErrorState).forEach((key) => {
                    if (this.componentsErrorState[key].state) {
                        Object.keys(this.componentsErrorState[key]).forEach((errorKey) => {
                            if (errorKey != 'state') {
                                errors.push({
                                    type: 'component',
                                    position: key,
                                    message: this.componentsErrorState[key][errorKey]
                                })
                            }
                        })
                    }
                    else {
                        const sectionIndex = key.split('-')[0]
                        const componentIndex = key.split('-')[1]

                        if (this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].type == 1) {
                            editedComponents[key] = {
                                type: 'number',
                                value: this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value
                            }
                        }
                        else if (this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].type == 4) {
                            editedComponents[key] = {
                                type: 'bar',
                                value: JSON.stringify(this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value)
                            }
                        }
                        else {
                            editedComponents[key] = {
                                type: 'text',
                                value: this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value
                            }
                        }
                    }
                })

                if (errors.length > 0) {
                    errors.forEach(error => {
                        if (error.type == 'component') {
                            const sectionIndex = error.position.split('-')[0]
                            const componentIndex = error.position.split('-')[1]

                            this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name

                            Object.keys(error.message).forEach(errorKey => {
                                if (error.message[errorKey].state) {
                                    this.sheetValidationErrors.push(`No componente "${this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name}": ${error.message[errorKey].actualMessage}`)
                                }
                            })
                        }
                    })

                    this.menu = 'ShowErrors'
                    return
                }
                else {
                    this.savingSheet = true
                    const updatedSheet = {
                        ...this.sheet,
                        sheet_name: this.sheetName,
                        attributes: {
                            sections: this.sheet.attributes.sections.map((section) => {
                                return {
                                    ...section,
                                    attributes: section.attributes.map((attribute) => {
                                        if (attribute.type == 1) {
                                            return {
                                                ...attribute,
                                                value: parseInt(attribute.value)
                                            }
                                        }
                                        else if (attribute.type == 3 || attribute.type == 4) {
                                            if (typeof attribute.value == 'string') {
                                                return {
                                                    ...attribute,
                                                    value: JSON.parse(attribute.value)
                                                }
                                            }
                                            else {
                                                return attribute
                                            }
                                        }
                                        else {
                                            return attribute
                                        }
                                    })
                                }
                            })
                        },
                        legacy: false
                    }

                    const res = await fetch(`${config.API_URI}/sheet/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                        body: JSON.stringify(updatedSheet)
                    })

                    if (res.status == 200) {
                        if (this.sheet.sheet_name != updatedSheet.sheet_name) {
                            window.location.href = `/ficha/${this.userId}/${this.sheetName}`
                        }

                        this.sheetSavedSuccess = true
                    }
                    else if (res.status == 400) {
                        const data = await res.json()

                        this.sheetValidationErrors = data.errors.map(error => error.message)
                        this.menu = 'ShowErrors'
                    }
                    else if (res.status == 401) {
                        localStorage.removeItem('token')
                        window.location.href = '/login'
                    }
                    else {
                        this.sheetValidationErrors = ['Erro desconhecido ao tentar salvar a ficha, tente novamente mais tarde']
                        this.menu = 'ShowErrors'
                    }

                    this.savingSheet = false
                }
            }
        },
        async deleteSheet() {
            if (this.isSheetOwner == false) {
                return
            }
            else {
                const res = await fetch(`${config.API_URI}/sheet/delete?id=${this.sheet.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                })

                if (res.status == 200) {
                    window.location.href = `/fichas`
                }
                else if (res.status == 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
                else {
                    this.sheetValidationErrors = ['Erro desconhecido ao tentar deletar a ficha, tente novamente mais tarde']
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
                    document.getElementById('Sheet').style.marginLeft = '0em'
                    document.getElementById('Sheet').style.width = '100%'

                    if (window.innerWidth > 800) {
                        setTimeout(() => { document.querySelector('.sheet-body').style.marginLeft = '50px' }, 150)
                    }
                }
                else {
                    document.getElementById('Sheet').style.marginLeft = '22em'
                    document.getElementById('Sheet').style.width = 'calc(100% - 22em)'

                    if (window.innerWidth > 800) {
                        setTimeout(() => { document.querySelector('.sheet-body').style.marginLeft = '0px' }, 150)
                    }
                }
            })

            observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })
        }
    },
    mounted() {
        eventEmitter.on('resize', () => {
            if (this.mobile && window.innerWidth < 800 || !this.mobile && window.innerWidth >= 800) {
                this.loadAttributes()
            }
        })

        eventEmitter.on('remove-component', (component) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.sheet.attributes.sections[sectionIndex].attributes.splice(componentIndex, 1)

            delete this.componentsErrorState[`${sectionIndex}-${componentIndex}`]

            this.reDefinePosition()
        })

        eventEmitter.on('update-component', (component, name, value) => {
            if (component.classList[0] == 'sheet-image-wrapper') {
                if (value) {
                    const sectionIndex = component.getAttribute('position').split('-')[0]
                    const componentIndex = component.getAttribute('position').split('-')[1]

                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name = name
                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value = value
                }
            }
            else {
                if (name && value) {
                    const sectionIndex = component.getAttribute('position').split('-')[0]
                    const componentIndex = component.getAttribute('position').split('-')[1]

                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].name = name
                    this.sheet.attributes.sections[sectionIndex].attributes[componentIndex].value = value
                }
            }
        })

        eventEmitter.on('move-component', (component, section, position) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]


            if (sectionIndex == section && componentIndex == position) {
                return
            }

            if (sectionIndex != section) {
                const component = this.sheet.attributes.sections[sectionIndex].attributes[componentIndex]

                this.sheet.attributes.sections[sectionIndex].attributes.splice(componentIndex, 1)
                this.sheet.attributes.sections[section].attributes.splice(position, 0, component)
            }

            if (position != componentIndex) {
                const component = this.sheet.attributes.sections[sectionIndex].attributes[componentIndex]

                this.sheet.attributes.sections[sectionIndex].attributes.splice(componentIndex, 1)
                this.sheet.attributes.sections[sectionIndex].attributes.splice(position, 0, component)
            }

            this.reDefinePosition()

            if (position != componentIndex) {
                eventEmitter.emit('component-being-moved', component)
            }
        })

        eventEmitter.on('invalid-component', (component, errors) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.componentsErrorState[`${sectionIndex}-${componentIndex}`] = {
                state: true,
                errors: errors
            }
        })

        eventEmitter.on('valid-component', (component) => {
            const sectionIndex = component.getAttribute('position').split('-')[0]
            const componentIndex = component.getAttribute('position').split('-')[1]

            this.componentsErrorState[`${sectionIndex}-${componentIndex}`] = {
                state: false,
                errors: {}
            }
        })

        eventEmitter.on('edit-sheet-name', (sheetName) => {
            this.sheetName = sheetName
            this.menu = 'None'
        })

        eventEmitter.on('get-sections', () => {
            eventEmitter.emit('set-sections', this.sections)
        })

        eventEmitter.on('get-max-position', () => {
            eventEmitter.emit('set-max-position', this.sheet.attributes.sections[this.actualSectionIndex].attributes.length - 1)
        })

        eventEmitter.on('close-sheet-menu', () => {
            this.menu = 'None'
        })

        eventEmitter.on('create-new-section', (sectionName) => {
            this.menu = 'None'
            this.createNewSection(sectionName)
        })

        eventEmitter.on('create-new-component', (component) => {
            this.menu = 'None'
            this.createNewComponent(component)
        })

        eventEmitter.on('edit-section', (sectionName) => {
            this.menu = 'None'
            this.editSection(sectionName)
        })

        eventEmitter.on('get-actual-section', () => {
            eventEmitter.emit('set-actual-section', this.sheet.attributes.sections[this.actualSectionIndex])
        })

        eventEmitter.on('delete-sheet', () => {
            this.deleteSheet()
        })

        eventEmitter.on('toggle-sheet-visibility', (sheet_visibility) => {
            this.sheet.is_public = sheet_visibility
        })

        if (unsigned) {
            document.getElementById('Sheet').style.marginLeft = '0 !important'
            document.getElementById('Sheet').style.width = '100% !important'
        }
    },
    beforeRouteEnter(to, from, next) {
        if (localStorage.getItem('token')) {
            unsigned = false
        }
        else {
            unsigned = true
            isSheetOwner = false
        }

        next()
    },
    beforeRouteLeave(to, from, next) {
        try {
            window.removeEventListener('resize', this.handleResize)
            observer.disconnect()
            eventEmitter.off('resize')
        }
        catch(err){}
        window.location.href = to.path
    }
}
</script>

<template>
    <div id="Sheet" ref="sheet" :style="unsigned ? 'margin-left: 0 !important; width: 100% !important;' : ''">
        <div class="sheet" ref="sheet" v-if="!mobile" :class="menu == 'None' ? '' : 'hidden-div'">
            <div class="sheet-tool-bar">
                <h2>Ficha: {{ sheetName }}</h2>
                <div class="sheet-tool-bar-buttons" v-if="isSheetOwner">
                    <button class="sheet-tool-bar-item" @click="menu = 'Config'">
                        <img src="../assets/img/setting.svg">
                        <h4>Configurações</h4>
                    </button>
                    <button class="sheet-tool-bar-item" @click="saveSheet()" v-if="!savingSheet">
                        <img src="../assets/img/save.svg">
                        <h4>Salvar</h4>
                    </button>
                    <button class="sheet-tool-bar-item" disabled v-else>
                        <LoadWheel class="loading loading-saving-sheet" />
                    </button>
                    <button class="sheet-tool-bar-item" @click="openAddNewSectionMenu()">
                        <img src="../assets/img/add-section.svg">
                        <h4>Adicionar seção</h4>
                    </button>
                    <button class="sheet-tool-bar-item" @click="openAddCompMenu()">
                        <img src="../assets/img/add-component.svg">
                        <h4>Adicionar componente</h4>
                    </button>
                </div>
                <div class="sheet-tool-bar-buttons" v-else="isSheetOwner">
                    <router-link to="/">Inicio</router-link>
                    <router-link to="/comandos">Comandos</router-link>
                    <router-link to="/tutoriais">Tutoriais</router-link>
                    <router-link to="/login">Login</router-link>
                </div>
            </div>
            <div class="sheet-section" index="0" ref="section">
                <img src="../assets/img/navigateIcon.svg" class="previous-section" @click="previousSection()">
                <h1 @click="openEditSectionMenu()">{{ actualSectionName }}</h1>
                <p @click="openEditSectionMenu()" v-if="isSheetOwner">Clique para Editar</p>
                <img src="../assets/img/navigateIcon.svg" class="next-section" @click="nextSection()">
            </div>
            <div class="sheet-body" ref="sheet-body">
                <!-- <SheetNumber name="teste" value="20" />
                <SheetLongText name="teste2"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut laoreet, augue id ultricies hendrerit, sapien lorem interdum magna, ac congue dolor elit quis tortor. Phasellus sodales ornare turpis, id dapibus massa hendrerit in. In molestie cursus risus, et rhoncus nisi pharetra vitae. In eleifend justo in lacus vulputate, eget tincidunt ipsum gravida. Duis vestibulum eleifend est, non tristique lectus egestas ut. Duis mattis ornare ornare. Aenean accumsan non eros a placerat. Quisque eleifend velit in libero tristique, a commodo odio pulvinar. Curabitur quis sapien egestas, aliquam arcu at, dictum quam. In dui nisl, eleifend vel accumsan ac, molestie ac ligula. Aenean tellus sem, facilisis a risus sit amet, rhoncus rutrum enim. Morbi dui quam, hendrerit quis nisi vitae, egestas placerat urna. Cras pharetra erat purus, eu ullamcorper lorem porta sed. Quisque molestie, tellus vitae volutpat porta, lorem augue pulvinar erat, eu malesuada elit nisl vel dolor. In fringilla ligula mi." />
                <SheetImage
                    value="https://media.discordapp.net/attachments/681288910386888766/716822771140657192/unknown.png" />
                <SheetList name="teste"
                    value='{"itens":[{"name": "Notebook", "quantity":1}, {"name": "Smartphone", "quantity": 1}]}' />
                <SheetBar name="teste" value='{"actual":35,"max":100}' /> -->
            </div>
        </div>
        <div class="sheet-mobile" ref="sheet" :class="menu == 'None' ? '' : 'hidden-div'" v-else>
            <div class="sheet-title-mobile">
                <h2>Ficha: {{ sheetName }}</h2>
            </div>
            <div class="sheet-tool-bar-mobile" v-if="isSheetOwner">
                <button class="sheet-tool-bar-mobile-item" @click="menu = 'Config'">
                    <img src="../assets/img/setting.svg">
                </button>
                <button class="sheet-tool-bar-mobile-item" @click="saveSheet()" v-if="!savingSheet">
                    <img src="../assets/img/save.svg">
                </button>
                <button class="sheet-tool-bar-mobile-item" disabled v-else>
                    <LoadWheel class="loading loading-saving-sheet-mobile" />
                </button>
                <button class="sheet-tool-bar-mobile-item" @click="openAddNewSectionMenu()">
                    <img src="../assets/img/add-section.svg">
                </button>
                <button class="sheet-tool-bar-mobile-item" @click="openAddCompMenu()">
                    <img src="../assets/img/add-component.svg">
                </button>
            </div>
            <div class="sheet-section-mobile" index="0" ref="section">
                <img src="../assets/img/navigateIcon.svg" class="previous-section" @click="previousSection()">
                <h1 @click="openEditSectionMenu()">{{ actualSectionName }}</h1>
                <p @click="openEditSectionMenu()" v-if="isSheetOwner">Clique para Editar</p>
                <img src="../assets/img/navigateIcon.svg" class="next-section" @click="nextSection()">
            </div>
            <div class="sheet-body-mobile" ref="sheet-body">
                <!-- <SheetNumber name="teste" value="20" position="0-0" />
                <SheetLongText name="teste2" value="teste teste testetestetesteteste teste teste teste testetestetesteteste"
                    position="0-1" />
                <SheetImage value="https://cdn.discordapp.com/attachments/836291199140102195/1094793290387292180/morte.jpg"
                    position="0-1" />
                <SheetBar name="teste" value='{"actual":35,"max":100,"min":-10,"step":10}' position="0-1"  />
                <SheetList name="teste"
                    value='{"items":[{"name": "Notebook", "quantity":1}, {"name": "Smartphone", "quantity": 1}, {"name": "teste", "quantity": 1}]}'
                    position="0-2" />
                <SheetNumber name="teste" value="20" position="0-1" /> -->
            </div>
        </div>
        <SheetConfigMenu :class="menu == 'Config' ? '' : 'hidden-div'" :sheet-name="sheetName" :sheet-visibility="sheet.is_public" v-if="isSheetOwner" />
        <SheetAddSectionMenu :class="menu == 'AddSection' ? '' : 'hidden-div'" v-if="isSheetOwner" />
        <SheetAddCompMenu :class="menu == 'AddComp' ? '' : 'hidden-div'" v-if="isSheetOwner" />
        <SheetEditSectionMenu :class="menu == 'EditSection' ? '' : 'hidden-div'" v-if="isSheetOwner" />
        <div :class="`sheet-show-validation-errors ${menu == 'ShowErrors' ? '' : 'hidden-div'}`" v-if="isSheetOwner">
            <div class="sheet-show-validation-errors-list">
                <div class="sheet-show-validation-errors-box">
                    <h1>Erros de validação ao tentar salvar a ficha</h1>
                    <p v-for="error of sheetValidationErrors" :key="error">{{ error }}</p>
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

#Sheet {
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

.sheet {
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

.sheet-tool-bar {
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

.sheet-tool-bar h2 {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
}

.sheet-tool-bar-buttons {
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

.sheet-tool-bar-item {
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

.sheet-tool-bar-buttons a {
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

.sheet-tool-bar-buttons a:hover {
    background-color: var(--background-secondary);
}

.sheet-tool-bar-item h4 {
    font-size: 1.2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    margin-left: 0.2em;
    z-index: 1;
}

.sheet-tool-bar-item img {
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

.sheet-tool-bar-item:hover {
    background-color: var(--background-secondary);
}

.sheet-tool-bar-item:hover>img {
    filter: var(--background-filter);
}

.sheet-section {
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

.sheet-section h1 {
    grid-area: title;
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    cursor: pointer;
}

.sheet-section p {
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

.sheet-section img {
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

.sheet-section img:hover {
    filter: var(--background-secondary-filter)
}

.sheet-section img.next-section {
    grid-area: next;
    rotate: 0deg;
}

.sheet-body {
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

.sheet-body-components {
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

.sheet-show-validation-errors {
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

.sheet-show-validation-errors-list {
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

.sheet-show-validation-errors-box {
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

.sheet-show-validation-errors-box h1 {
    font-size: 2em;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 1em;
    padding: 0;
    text-align: center;
}

.sheet-show-validation-errors-box p {
    font-size: 1.1em;
    font-weight: bold;
    color: var(--text);
    margin: 10px;
    padding: 0;
    text-align: center;
}

.sheet-show-validation-errors-box button {
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

.sheet-show-validation-errors-box button:hover {
    background-color: var(--background-secondary);
}

.loading-saving-sheet {
    height: 25px !important;
    width: 25px !important;
    border: 7px solid var(--primary) !important;
    border-color: var(--primary) transparent var(--primary) transparent !important;
}

.sheet-mobile {
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

.sheet-title-mobile {
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

.sheet-title-mobile h2 {
    font-size: 1.2em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    margin-right: 1em;
}

.sheet-tool-bar-mobile {
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

.sheet-tool-bar-mobile-item {
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

.sheet-tool-bar-mobile-item img {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    filter: var(--background-filter);
    transition: 0.3s all linear;
}

.loading-saving-sheet-mobile {
    height: 20px !important;
    width: 20px !important;
    border: 5px solid var(--background) !important;
    border-color: var(--background) transparent var(--background) transparent !important;
}

.sheet-section-mobile {
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

.sheet-section-mobile h1 {
    grid-area: title;
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    padding: 0;
    cursor: pointer;
}

.sheet-section-mobile p {
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

.sheet-section-mobile img {
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

.sheet-section-mobile img.next-section {
    grid-area: next;
    rotate: 0deg;
}

.sheet-body-mobile {
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
    #Sheet {
        margin-left: 0;
        margin-top: 7px;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .sheet-tool-bar {
        justify-content: center;
    }

    .sheet-tool-bar-buttons {
        justify-content: center;
    }

    .sheet-section {
        grid-template-columns: 10% 80% 10%;
    }

    .sheet-section h1 {
        font-size: 1.2em;
    }

    .sheet-section p {
        font-size: 0.7em;
    }

    .sheet-section img {
        width: 100%;
        height: 2em;
    }

    .sheet-body {
        margin-left: 0;
    }

    .sheet-body-components {
        width: 100%;
    }

    .sheet-show-validation-errors-box {
        width: 90%;
        height: 90%;
    }
}
</style>