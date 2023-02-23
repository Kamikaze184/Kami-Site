<script>
import socket from '../services/websocket.service.js'

export default {
    data: () => {
        return {
            search: '',
            tutorialsList: [],
            allTutorials: []
        }
    },
    methods: {
        searchTutorial() {
            if (this.search != '') {
                socket.emit('tutorialsSearch', this.search)
            }
        }
    },
    created() {
        socket.on('tutorialsFound', (data) => {
            this.tutorialsList = data.tutorials
        })
    },
    beforeMount() {
        fetch('http://localhost:3001/tutorial',
            {
                method: 'GET'
            })
            .then(res => {
                if (res.status == 200) {
                    res.json()
                        .then(data => {
                            this.allTutorials = data.tutorials
                            this.tutorialsList = data.tutorials
                        })
                }
            })
    },
    watch: {
        'search'(value) {
            if (value == '') {
                this.tutorialsList = this.allTutorials
            }
        }
    }
}
</script>

<template>
    <div id="search-bar">
        <input type="text" v-model="search" v-on:keyup="searchTutorial()" placeholder="Quer ajuda com o quê?" />
        <img src="../assets/img/search.svg" />
    </div>
    <div class="tutorials-found">
        <div class="tutorial-item" v-for="tutorial in tutorialsList" :key="tutorial"
            v-on:click="$router.push({ path: `/tutoriais/${tutorial.link}` })"
            v-bind:class="tutorialsList.indexOf(tutorial) == 0 && search != '' ? 'first-tutorial-search' : ''">
            <h6 class=" tutorial-item-best-match" v-if="tutorialsList.indexOf(tutorial) == 0 && search != ''">Melhor
                resultado</h6>
            <h1 class="tutorial-item-title">{{ tutorial.title }}</h1>
            <img class="tutorial-item-thumbnail" :src="tutorial.thumb">
            <p class="tutorial-item-description">{{ tutorial.desc }}</p>
        </div>
    </div>
</template>

<style>
#search-bar {
    display: grid;
    grid-template-columns: 85% 15%;
    grid-template-rows: 2em;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    width: 25%;
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
    padding-left: 5px;
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

.tutorials-found {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: 15px
}

.tutorial-item {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 20% 55% 20%;
    gap: 0px 0px;
    grid-template-areas:
        "."
        "."
        ".";
    justify-content: center;
    align-content: center;
    justify-items: center;
    align-items: center;
    width: 30em;
    height: 16em;
    background-color: var(--primary);
    margin: 10px;
    color: var(--text);
    border: 2px solid var(--background);
    border-radius: 10px;
    transition: 0.3s;
    cursor: pointer;
}

.first-tutorial-search {
    grid-template-rows: 8% 20% 50% 17%;
    gap: 0px 0px;
    grid-template-areas:
        "."
        "."
        "."
        ".";
}

.tutorial-item-best-match {
    margin: 0;
}

.tutorial-item-title {
    font-size: 1.5em;
    max-width: 95%;
    margin: 0;
    padding: 0;
}

.tutorial-item-thumbnail {
    max-width: 95%;
    border: 2px solid var(--background);
    border-radius: 10px;
    margin: 10px 0px 10px 0px;
}

.tutorial-item-description {
    max-width: 95%;
    margin: 0;
    font-size: 1.1em;
}

.tutorial-item:hover {
    background-color: var(--secondary);
}
</style>