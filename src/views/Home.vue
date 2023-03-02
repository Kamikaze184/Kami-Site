<script>
import { default as config } from '../config/publicVars'
import CountUp from '../components/CountUp.vue';

export default {
  data() {
    return {
      serversCount: 0,
      usersCount: 0,
      sheetsCount: 0,
      commandsCount: 0
    }
  },
  components: {
    CountUp
  },
  mounted() {
    let data = new Object()

    fetch(`${config.API_URI}/info`, {
      method: 'GET',
      cache: 'force-cache',
    })
      .then(async res => {
        data = await res.json()

        this.serversCount = data.serversCount
        this.usersCount = data.usersCount
        this.sheetsCount = data.sheetsCount
        this.commandsCount = data.commandsCount
      })
  }
}
</script>

<template>
  <div id="home">
    <div class="home-description">
      <h1>Que tal algo para facilitar seus RPG's?</h1>
      <p>O Kami é um BOT para o aplicativo de mensagens Discord, criado com a intenção de ajudar jogadores e mestres de
        RPG's, facilitando algumas coisas durante as sessões e ajudando os mesmos a se organizarem, tendo como
        principais funções a criação de fichas de personagens e a rolagem de dados, entre diversas outras funções.
        E tem mais coisas vindo por ai!</p>
      <button>Adicione o Kami</button>
    </div>
    <div class="home-botinfo">
      <div class="home-botinfo-box">
        <div class="home-botinfo-item">
          <CountUp :key="serversCount" :end-value="serversCount" />
          <h4>Servidores</h4>
        </div>
        <div class="home-botinfo-item">
          <CountUp :key="usersCount" :end-value="usersCount" />
          <h4>Usuários</h4>
        </div>
        <div class="home-botinfo-item">
          <CountUp :key="sheetsCount" :end-value="sheetsCount" />
          <h4>Fichas Criadas</h4>
        </div>
        <div class="home-botinfo-item">
          <CountUp :key="commandsCount" :end-value="commandsCount" />
          <h4>Comandos Executados</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  text-align: center;
}

.home-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 6em;
}

.home-description h1 {
  color: var(--text);
  margin: 0;
  margin-bottom: 20px;
}

.home-description p {
  color: var(--text-secondary);
  width: 60%;
  font-size: 1em;
  margin: 0;
  margin-bottom: 20px;
}

.home-description button {
  width: 10em;
  font-size: 1.4em;
  font-weight: bold;
  color: var(--text);
  background-color: var(--primary);
  padding: 7px 15px 7px 15px;
  border-radius: 10px;
  margin-bottom: 40px;
  border: 3px solid var(--background);
  transition: 0.3s;
  cursor: pointer;
}

.home-description button:hover {
  background-color: var(--text);
  color: var(--primary);
}

.home-botinfo-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  width: fit-content;
  height: fit-content;
  border: none;
  border-radius: 10px;
}

.home-botinfo-item {
  display: flex;
  flex-direction: column;
  margin: 0 10px 0 10px;
  color: var(--text);
  padding: 10px;
}

.home-botinfo-item h1 {
  font-size: 2.5em;
  margin: 0;
}

.home-botinfo-item h4 {
  margin: 0;
  opacity: 0.7;
}

@media (max-width: 800px) {
  .home-description {
    margin-top: 4em;
  }

  .home-description h1 {
    width: 90%;
  }

  .home-description p {
    width: 90%;
  }

  .home-botinfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 4em;
  }

  .home-botinfo-box {
    align-self: center;
    flex-wrap: wrap;
    max-width: 90%;
    margin: 0;
  }

  .home-botinfo-item {
    margin: 10px 0 10px 0;
  }
  
}
</style>