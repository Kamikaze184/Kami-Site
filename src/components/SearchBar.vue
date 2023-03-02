<script>
import { default as config } from '../config/publicVars'
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
        fetch(`${config.API_URI}/tutorial`,
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
        <div class="tutorial-not-found" v-if="tutorialsList.length == 0">
            <h1>Nenhum tutorial encontrado</h1>
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

.tutorial-not-found {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 10px
}

.tutorial-not-found h1 {
    font-size: 1.5em;
    color: var(--text);
    margin: 0;
    padding: 0;
    width: 100%;
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

@media screen and (max-width: 800px) {
    #search-bar {
        width: 80%;
        margin-bottom: 20px;
    }

    .tutorial-not-found {
        margin-top: 0px;
        width: 90%;
    }

    .tutorial-not-found h1 {
        font-size: 1.2em;
    }

    .tutorial-item {
        width: 20em;
        height: 12em;
    }

    .tutorial-item-title {
        font-size: 1.2em;
        max-width: 95%;
        margin: 0;
        padding: 0;
    }

    .tutorial-item-description {
        font-size: 0.9em;
    }

    .tutorial-item-thumbnail {
        max-width: 90%;
    }

    .tutorial-item-best-match {
        font-size: 0.8em;
        margin: 0;
    }

    .tutorials-found {
        margin-top: 0px;
    }

    .first-tutorial-search {
        grid-template-rows: 10% 20% 50% 20%;
        gap: 0px 0px;
        grid-template-areas:
            "."
            "."
            "."
            ".";
    }

    .first-tutorial-search .tutorial-item-description {
        margin-top: 10px;
        bottom: 0;
    }
}
</style>