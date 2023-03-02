<script>
import SearchBar from '../components/SearchBar.vue'

export default {
  data: () => {
    return {
    }
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
    </div>
    <div class="tutorials-search">
      <SearchBar />
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
  width: 90%;
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

.tutorials-search {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
}

@media screen and (max-width: 800px) {
  .tutorials-description {
    margin-top: 3em;
  }

  .tutorials-description p {
    width: 90%;
  }

  .tutorials-search {
    width: 100%;
  margin-bottom: 3em;
  }
}
</style>