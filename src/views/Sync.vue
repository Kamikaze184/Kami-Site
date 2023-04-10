<script>
import { default as config } from '../config/publicVars'
import { useRoute } from 'vue-router'
import router from '../router'
import LoadWheel from '../components/LoadWheel.vue'

export default {
  setup() {
    const route = useRoute()

    fetch(`${config.API_URI}/auth/discord/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({ code: route.query.code })
    })
      .then(res => {
        if (res.status == 200) {
          res.json()
            .then(data => {
              router.push({ name: 'Config' })
            })
        }
      })
      .catch(err => {
        router.push({ name: 'Config', params: { error: 'SyncError' } })
      })
  },
  components: {
    LoadWheel
  }
}
</script>

<template>
  <div id="Sync">
    <div class="loading-message">
      <LoadWheel />
      <h1>Carregando informações...</h1>
    </div>
  </div>
</template>

<style>
#Sync {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: 6em;
}

.loading-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-message h1 {
  margin: 10px;
  color: var(--text);
}

@media screen and (max-width: 800px) {
  #Sync {
    margin-top: 3em;
  }

  .loading-message {
    margin-top: 10px;
  }

  .loading-message h1 {
    font-size: 1.5em;
  }

  .loading-message h1 {
    margin: 10px;
    color: var(--text);
  }
}
</style>