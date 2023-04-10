<script>
import ItemVue from '../components/Item.vue'

export default {
    setup() {
    },
    components: {
        ItemVue
    },
    mounted() {
        const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

        const observer = new MutationObserver(() => {
            if (sideMenu.getAttribute('collapsed') == 'true') {
                this.$refs.campaigns.style.marginLeft = '4em'
                this.$refs.campaigns.style.width = 'calc(100% - 4em)'
            }
            else {
                this.$refs.campaigns.style.marginLeft = '23em'
                this.$refs.campaigns.style.width = 'calc(100% - 24em)'
            }
        })

        observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })
    }
}
</script>

<template>
    <div id="Campaigns" ref="campaigns">
        <div class="campaigns-list">
            <h1>Suas Campanhas</h1>
            <div class="list-category campaigns">
                <img class="add-campaign-icon" src="../assets/img/add.svg">
                <ItemVue type="2" description="teste" href="teste" />
                <ItemVue type="2" description="teste" />
                <ItemVue type="2" description="teste" />
                <ItemVue type="2" description="teste" />
            </div>
            <h1>Campanhas que você participa</h1>
            <div class="list-category templates">
                <img class="add-campaign-icon" src="../assets/img/add.svg">
                <ItemVue type="2" description="teste" />
            </div>
            <h1>Fichas dos jogadores em suas campanhas modificadas recentemente</h1>
            <div class="list-category templates">
                <ItemVue type="13" description="teste" />
            </div>
        </div>
    </div>
</template>

<style>
#Campaigns {
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

.campaigns-list {
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

.campaigns-list h1 {
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

.list-category .add-campaign-icon {
    width: 4em;
    height: 4em;
    margin: 0.5em;
    cursor: pointer;
    filter: var(--primary-filter);
    transition: 0.3s;
}

.list-category .add-campaign-icon:hover {
    filter: var(--secondary-filter);
}
</style>