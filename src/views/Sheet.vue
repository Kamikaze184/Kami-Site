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
        const sheetId = this.$route.params.sheetId

        fetch(`http://localhost:3001/sheet?id=${sheetId}`, {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('token')
          },
          cache: 'no-cache'
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
    }
}
</script>

<template>
    <div id="Sheets" ref="sheets">
        <div class="sheet">
            <h1>Ficha</h1>
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

.sheet {
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
</style>