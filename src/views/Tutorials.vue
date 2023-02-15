<script>
import SearchBar from '../components/SearchBar.vue'

export default {
  data: () => {
    return {
    }
  },
  methods: {

  },
  components: {
    SearchBar
  }
}
</script>

<template>
  <div id="tutorials">
    <div class="tutorials-description">
      <h1>Se precisa de ajuda com algum comando este lugar pode te ajudar!</h1>
      <p>Mas, claro, se você precisar de mais ajuda você pode perguntar no <a href="/suporte"><b>Servidor de Suporte do
            Kami no Discord.</b></a></p>
      <SearchBar />
    </div>
    <div class="tutorials-list">
    </div>
  </div>
</template>

<style>
#tutorials {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  text-align: center;
}

.tutorials-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 6em;
}

.tutorials-description h1 {
  color: var(--text);
  margin: 0;
  margin-bottom: 20px;
}

.tutorials-description p {
  color: var(--text-secondary);
  width: 60%;
  font-size: 1em;
  margin: 0;
  margin-bottom: 20px;
}

.tutorials-description a {
  text-decoration: none !important;
  color: var(--text);
  transition: 0.3s;
}

.tutorials-description a:hover {
  color: var(--secondary);
}

.command-item {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  flex-wrap: nowrap;
  background-color: var(--primary);
  width: 16em;
  margin: 5px;
  background-color: var(--primary);
  border: 3px solid var(--background);
  border-radius: 10px;
  text-align: center;
}

.command-item h2 {
  margin: 0.6em 0 0.6em 0;
  color: var(--text);
}

.command-item p {
  margin: 0;
  color: var(--text-secondary);
  width: 90%;
}
</style>