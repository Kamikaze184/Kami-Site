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
                this.$refs.macros.style.marginLeft = '4em'
                this.$refs.macros.style.width = 'calc(100% - 4em)'
            }
            else {
                this.$refs.macros.style.marginLeft = '23em'
                this.$refs.macros.style.width = 'calc(100% - 24em)'
            }
        })

        observer.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })
    }
}
</script>

<template>
    <div id="Macros" ref="macros">
        <div class="macros-list">
            <h1>Seus Macros</h1>
            <div class="list-category macros">
                <img class="add-macro-icon" src="../assets/img/add.svg">
                <ItemVue type="3" description="teste" href="teste" />
                <ItemVue type="3" description="teste" />
                <ItemVue type="3" description="teste" />
                <ItemVue type="3" description="teste" />
            </div>
            <h1>Seus macros de campanhas</h1>
            <div class="list-category templates">
                <ItemVue type="3" description="teste" />
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
</style>