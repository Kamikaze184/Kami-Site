<script>
export default {
    data() {
        return {
            title: 'Ficha acessada recentemente',
            description: 'Item description',
            href: null,
            types: {
                1: 'Ficha',
                2: 'Campanha',
                3: 'Macro',
                4: 'Template',
                5: 'Notificação',
                6: 'Ficha Acessada Recentemente',
                7: 'Campanha Acessada Recentemente',
                8: 'Macro Acessado Recentemente',
                9: 'Template Acessado Recentemente',
                10: 'Sessão Marcada',
                11: 'Sessão Cancelada',
                12: 'Sessão Alterada',
                13: 'Ficha de Campanha Editada'
            }
        }
    },
    mounted() {
        this.title = this.types[parseInt(this.$refs.item.getAttribute('type'))]
        this.description = this.$refs.item.getAttribute('description')

        if (this.$refs.item.getAttribute('href') != null) {
            this.href = this.$refs.item.getAttribute('href')
            this.$refs.item.addEventListener('click', () => {
                this.$router.push(this.href)
            })
        }
    },
    methods: {
        isClickable() {
            if (this.href) {
                return 'clickable'
            }
            else{
                return ''
            }
        }
    }
}
</script>
<template>
    <div class="item" ref="item" :class="isClickable()">
        <div class="item-title">{{ title }}</div>
        <div class="item-description">
            <p>{{ description }}</p>
        </div>
    </div>
</template>
<style>
.item {
    width: 21em;
    height: 10em;
    background-color: var(--primary);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
    transition: 0.3s;
}

.item-title {
    box-sizing: border-box;
    width: 100%;
    height: 20%;
    background-color: var(--background);
    border: 2px solid var(--primary);
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1em;
    font-weight: normal;
    color: var(--text);
    margin: 0;
    vertical-align: middle;
}

.item-description {
    height: 80%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 10px;
    color: var(--text);
    margin: 0;
}

.item-description p {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0;
    width: 20em;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.item.clickable {
    cursor: pointer;
}

.item.clickable:hover {
    background-color: var(--secondary);
}
</style>