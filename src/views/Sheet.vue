<script>
import { createVNode, render } from 'vue'
import ItemVue from '../components/Item.vue'
import LoadWheel from '../components/LoadWheel.vue'
import SheetBar from '../components/sheet/SheetBar.vue'
import SheetNumber from '../components/sheet/SheetNumber.vue'
import SheetLongText from '../components/sheet/SheetLongText.vue'
import SheetList from '../components/sheet/SheetList.vue'
import SheetImage from '../components/sheet/SheetImage.vue'

const componentList = [SheetLongText, SheetNumber, SheetImage, SheetList, SheetBar]

export default {
    data() {
        return {
            sheetName: this.$route.params.sheetName,
            userId: this.$route.params.userId,
            sheet: {},
            sheetLoaded: false,
            actualSectionIndex: 0,
            actualSectionName: 'Carregando...',
            componentsErrorState: {}
        }
    },
    components: {
        ItemVue,
        LoadWheel,
        SheetBar,
        SheetNumber,
        SheetLongText,
        SheetList,
        SheetImage
    },
    mounted() {
        const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

        const observer = new MutationObserver(() => {
            if (sideMenu.getAttribute('collapsed') == 'true') {
                this.$refs.sheets.style.marginLeft = '0em'
                this.$refs.sheets.style.width = '100%'

                this.$refs['sheet-body'].style.marginLeft = '50px'
            }
            else {
                this.$refs.sheets.style.marginLeft = '22em'
                this.$refs.sheets.style.width = 'calc(100% - 22em)'

                this.$refs['sheet-body'].style.marginLeft = '0px'
            }
        })

        observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })
    },
    beforeMount() {
        const { userId, sheetName } = this.$route.params

        fetch(`http://localhost:3001/sheet/one?userId=${userId}&sheetName=${sheetName}`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            cache: 'no-cache'
        })
            .then(response => response.json())
            .then(data => {
                this.sheet = data.sheet
                this.sheetLoaded = true

                console.log(this.sheet)
            })
            .catch(error => {
                console.log(error)
            })
    },
    watch: {
        sheetLoaded() {
            if (this.sheetLoaded) {
                this.actualSectionIndex = 0
                this.actualSectionName = this.sheet.attributes.sections[0].name

                this.loadAttributes()
            }
        },
        actualSectionIndex() {
            this.loadAttributes()
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
        }
    }
}
</script>

<template>
    <div id="Sheet" ref="sheets">
        <div class="sheet" ref="sheet">
            <div class="sheet-section" index="0" ref="section">
                <img src="../assets/img/navigateIcon.svg" class="previous-section" @click="previousSection()">
                <h1>{{ actualSectionName }}</h1>
                <p>Clique para Editar</p>
                <img src="../assets/img/navigateIcon.svg" class="next-section" @click="nextSection()">
            </div>
            <div class="sheet-body" ref="sheet-body">
                <!-- <SheetNumber name="teste" value="20" />
                <SheetLongText name="teste2"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut laoreet, augue id ultricies hendrerit, sapien lorem interdum magna, ac congue dolor elit quis tortor. Phasellus sodales ornare turpis, id dapibus massa hendrerit in. In molestie cursus risus, et rhoncus nisi pharetra vitae. In eleifend justo in lacus vulputate, eget tincidunt ipsum gravida. Duis vestibulum eleifend est, non tristique lectus egestas ut. Duis mattis ornare ornare. Aenean accumsan non eros a placerat. Quisque eleifend velit in libero tristique, a commodo odio pulvinar. Curabitur quis sapien egestas, aliquam arcu at, dictum quam. In dui nisl, eleifend vel accumsan ac, molestie ac ligula. Aenean tellus sem, facilisis a risus sit amet, rhoncus rutrum enim. Morbi dui quam, hendrerit quis nisi vitae, egestas placerat urna. Cras pharetra erat purus, eu ullamcorper lorem porta sed. Quisque molestie, tellus vitae volutpat porta, lorem augue pulvinar erat, eu malesuada elit nisl vel dolor. In fringilla ligula mi." />
                <SheetImage
                    value="https://media.discordapp.net/attachments/681288910386888766/716822771140657192/unknown.png" />
                <SheetList name="teste"
                    value='{"items":[{"name": "Notebook", "quantity":1}, {"name": "Smartphone", "quantity": 1}]}' />
                <SheetBar name="teste" value='{"actual":35,"max":100}' /> -->
            </div>
        </div>
    </div>
</template>

<style>
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
</style>