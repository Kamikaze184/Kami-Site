<script>
import ItemVue from '../components/Item.vue'
import LoadWheel from '../components/LoadWheel.vue'
import SheetBar from '../components/sheet/SheetBar.vue'
import SheetNumber from '../components/sheet/SheetNumber.vue'
import SheetLongText from '../components/sheet/SheetLongText.vue'
import SheetList from '../components/sheet/SheetList.vue'
import SheetImage from '../components/sheet/SheetImage.vue'


export default {
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
        // const sheetId = this.$route.params.sheetId

        // fetch(`http://localhost:3001/sheet?id=${sheetId}`, {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': localStorage.getItem('token')
        //   },
        //   cache: 'no-cache'
        // })
        // .then(response => response.json())
        // .then(data => {
        //   console.log(data)
        // })
        // .catch(error => {
        //   console.log(error)
        // })
    }
}
</script>

<template>
    <div id="Sheet" ref="sheets">
        <div class="sheet" ref="sheet">
            <div class="sheet-section" index="0" ref="section">
                <img src="../assets/img/navigateIcon.svg" class="previous-section">
                <h1>Informações do Personagem da Ficha</h1>
                <p>Clique para Editar</p>
                <img src="../assets/img/navigateIcon.svg" class="next-section">
            </div>
            <div class="sheet-body" ref="sheet-body">
                <SheetNumber title="teste" value="20"/>
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
}
</style>