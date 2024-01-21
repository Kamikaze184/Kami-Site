<script>
import ItemVue from '../components/Item.vue'
import lastUseStore from '../utils/LastUseStore.js'

export default {
    data() {
        return {
            sheets: [],
            macros: []
        }
    },
    components: {
        ItemVue
    },
    methods: {
        loadLastUse() {
            const lastUsedSheets = lastUseStore.get('sheets')
            const lastUsedMacros = lastUseStore.get('macros')

            if (lastUsedSheets) {
                let sheets = Object.values(lastUsedSheets)

                sheets = sheets.sort((a, b) => {
                    return b.lastUse - a.lastUse
                })

                sheets = sheets.slice(0, 5)

                this.sheets = sheets
            }

            if (lastUsedMacros) {
                let macros = Object.values(lastUsedMacros)

                macros = macros.sort((a, b) => {
                    return b.lastUse - a.lastUse
                })

                macros = macros.slice(0, 5)

                this.macros = macros
            }
        }
    },
    mounted() {
        const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

        const observer = new MutationObserver(() => {
            if (sideMenu.getAttribute('collapsed') == 'true') {
                this.$refs.dashboard.style.marginLeft = '3em'
                this.$refs.dashboard.style.width = 'calc(100% - 3em)'
            }
            else {
                this.$refs.dashboard.style.marginLeft = '23em'
                this.$refs.dashboard.style.width = 'calc(100% - 24em)'
            }
        })

        observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })

        this.loadLastUse()
    },
}
</script>

<template>
    <div id="Dashboard" ref="dashboard">
        <div class="dashboard-quick-access">
            <h1>Acesso Rápido</h1>
            <!-- <h1>Notificações</h1>
            <div class="quick-access-category notifications">
                <ItemVue type="5" description="Sessão da campanha
                Nome_da_Campanha
                marcada para:
                dd/MM às hh:mm" />
            </div> -->
            <h1>Fichas</h1>
            <h2 v-if="sheets.length == 0">Nenhuma ficha acessada recentemente</h2>
            <div class="quick-access-category sheets">
                <ItemVue type="6" v-for="sheet of sheets" :key="sheet"
                    :description="`Ficha ${sheet.name} do usuário ${sheet.username}`"
                    :href="`ficha/${sheet.userid}/${sheet.name}`" />
            </div>
            <h1>Macros</h1>
            <h2 v-if="macros.length == 0">Nenhum macro acessado recentemente</h2>
            <div class="quick-access-category macros">
                <ItemVue type="8" v-for="macro of macros" :key="macro"
                    :description="`Macro ${macro.name} do usuário ${macro.username}`"
                    :href="`macro/${macro.userid}/${macro.name}`" />
            </div>
        </div>
    </div>
</template>

<style>
#Dashboard {
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

.dashboard-quick-access {
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

.dashboard-quick-access h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.5em 0;
    color: var(--text);
}

.dashboard-quick-access h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.5em 0;
    color: var(--text);
}

.quick-access-category {
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

@media (max-width: 800px) {
    #Dashboard {
        margin-left: 0;
        margin-top: 2em;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .dashboard-quick-access {
        justify-content: center;
    }

    .dashboard-quick-access h1 {
        width: 100%;
        text-align: center;
    }

    .quick-access-category {
        justify-content: center;
    }

}
</style>