<script>
export default {
  data() {
    return {}
  },
  methods: {
  }
}
</script>

<template>
  <div id="nav-bar">
    <router-link to="/">
      <div class="nav-logo">
        <img src="../assets/img/logo.png" alt="Logo do Kami" />
        <h1>Kami</h1>
      </div>
    </router-link>
    <div class="nav-links">
      <router-link to="/">Inicio</router-link>
      <router-link to="/comandos">Comandos</router-link>
      <router-link to="/tutoriais">Tutoriais</router-link>
      <router-link to="/convite">Adicione o Kami</router-link>
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

<style>
#nav-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-top: 5px;
}

.nav-logo {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  height: 100%;
  margin-left: 20px;
}

.nav-logo img {
  width: 60px;
}

.nav-logo h1 {
  font-family: 'Azonix', sans-serif;
  text-decoration: none !important;
  color: var(--primary);
  margin-left: 10px;
  letter-spacing: 3px;
}

.nav-links {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

.nav-links a {
  text-decoration: none !important;
  color: var(--text);
  margin: 10px;
  font-size: 1.4em;
  transition: 0.3s;
  padding: 10px;
  border-radius: 10px;
}

.nav-links a:hover {
  background-color: var(--primary);
  transition: 0.3s;
}

.nav-links .link-active {
  background-color: var(--primary);
}
</style>
