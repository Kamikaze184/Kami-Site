<script>
export default {
  data: () => {
    return {
      commands: []
    }
  },
  methods: {
    getItemSize() {
      let titleSize = 0
      let descriptionSize = 0

      for (let cmd of this.commands) {
        if (cmd.name.length > titleSize) {
          titleSize = cmd.name.length
        }

        if (cmd.description.length > descriptionSize) {
          descriptionSize = cmd.description.length
        }
      }

      let width = ((titleSize + 7) * 0.64)

      return `width: ${width > 16 ? width : 16 + "em !important"} ; height: ${((descriptionSize) * 0.11806) > 5.5 ? (descriptionSize) * 0.11806 : 5.5 + "em !important"} ;`
    }
  },
  beforeMount() {
    fetch('http://localhost:3001/command',
      {
        method: 'GET'
      })
      .then(res => {
        if (res.status == 200) {
          res.json()
            .then(data => {
              console.log(data)
              this.commands = data.commands
            })
        }
      })
  }
}
</script>

<template>
  <div id="commands">
    <div class="commands-description">
      <h1>Aqui você pode ver uma lista completa de todos os comandos presentes no Kami!</h1>
      <p>Mas, claro, se você precisar de mais ajuda você pode dar uma olhada na aba <router-link
          to="/tutoriais"><b>Tutoriais</b></router-link> e se ainda precisar de
        ajuda você pode perguntar no <a href="/suporte"><b>Servidor de Suporte do Kami no Discord</b></a>. Esta lista
        também
        pode ser visualizada
        direto no BOT utilizando o comando <b>/ajuda</b></p>
    </div>
    <div class="commands-list">
      <div class="command-item" v-for="cmd of this.commands" :key="cmd" :style="getItemSize()">
        <h2 v-if="cmd.type == 1">/{{ cmd.name }}</h2>
        <h2 v-else-if="cmd.type == 3">Apps > {{ cmd.name }}</h2>
        <p>{{ cmd.description }}</p>
      </div>
    </div>
  </div>
</template>

<style>
#commands {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  text-align: center;
}

.commands-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 6em;
  width: 90%;
}

.commands-description h1 {
  color: var(--text);
  margin: 0;
  margin-bottom: 20px;
}

.commands-description p {
  color: var(--text-secondary);
  width: 60%;
  font-size: 1em;
  margin: 0;
  margin-bottom: 20px;
}

.commands-description a {
  text-decoration: none !important;
  color: var(--text);
  transition: 0.3s;
}

.commands-description a:hover {
  color: var(--secondary);
}

.commands-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 90%;
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