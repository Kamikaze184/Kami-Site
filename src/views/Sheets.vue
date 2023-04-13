<script>
import config from '../config/publicVars.js'
import ItemVue from '../components/Item.vue'
import LoadWheel from '../components/LoadWheel.vue'

export default {
    data() {
        return {
            sheets: [],
            sheetsLoaded: false
        }
    },
    components: {
        ItemVue,
        LoadWheel
    },
    mounted() {
        const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

        const observer = new MutationObserver(() => {
            if (sideMenu.getAttribute('collapsed') == 'true') {
                this.$refs.sheets.style.marginLeft = '4em'
                this.$refs.sheets.style.width = 'calc(100% - 4em)'
            }
            else {
                this.$refs.sheets.style.marginLeft = '23em'
                this.$refs.sheets.style.width = 'calc(100% - 24em)'
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

    }
}
</script>

<template>
    <div id="Sheets" ref="sheets">
        <div class="sheets-list">
            <h1>Suas fichas</h1>
            <div class="list-category sheets">
                <img v-if="sheetsLoaded" class="add-sheet-icon" src="../assets/img/add.svg">
                <ItemVue v-for="sheet of sheets" :key="sheet" type="1" :description="sheet.sheet_name"
                    :href="`/ficha/${sheet.user_id}/${sheet.sheet_name}`" />
                <LoadWheel v-if="!sheetsLoaded" />
            </div>
            <h1>Seus templates de fichas</h1>
            <div class="list-category templates">
                <img class="add-sheet-icon" src="../assets/img/add.svg">
                <ItemVue type="4" description="teste" />
            </div>
            <h1>Fichas dos jogadores em suas campanhas modificadas recentemente</h1>
            <div class="list-category templates">
                <ItemVue type="13" description="teste" />
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
</style>