<script>
import { useRoute } from 'vue-router'
import router from '../router'
import LoadWheel from '../components/LoadWheel.vue'

export default {
  setup() {
    const route = useRoute()

    fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: route.query.code })
    })
      .then(res => {
        if (res.status == 200) {
          res.json()
            .then(data => {
              localStorage.setItem('token', data.token)
              router.push({ name: 'Home' })
            })
        }
      })
      .catch(err => {
        router.push({ name: 'Home' })
      })
  },
  components: {
    LoadWheel
  }
}
</script>

<template>
  <div id="callback">
    <div class="loading-message">
      <LoadWheel />
      <h1>Carregando informações...</h1>
    </div>
  </div>
</template>

<style>
#callback {
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
</style>