<script>
export default {
    data: () => {
        return {
            search: "",
            tutorialsList: ['']
        }
    },
    methods: {
        searchTutorial() {
            //socket.emit('tutorialsFound', this.search)
        }
    },
    created() {

    }
}
</script>

<template>
    <div id="search-bar">
        <input type="text" v-model="search" v-on:keyup="searchTutorial()" placeholder="Quer ajuda com o quê?" />
        <img src="../assets/img/search.svg" />
    </div>
    <div class="tutorials-found">
        <h1>{{ tutorialsList }}</h1>
    </div>
</template>

<style>
#search-bar {
    display: grid;
    grid-template-columns: 85% 15%;
    grid-template-rows: 2em;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    width: 45%;

}

#search-bar input {
    height: 2em;
    border: 3px solid var(--primary);
    background-color: var(--text);
    color: var(--primary);
    font-weight: bold;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    margin: 0;
    outline: none;
}

#search-bar img {
    height: 1.8em;
    border: 3px solid var(--primary);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: var(--primary);
    margin: 0;
    cursor: pointer;
}
</style>