<script>
export default {
  data() {
    return {
      sign: localStorage.getItem('token') != null,
      userLoaded: false,
      user: {},
    }
  },
  methods: {
  },
  watch: {
    $route() {
      this.sign = localStorage.getItem('token') != null

      if (this.sign) {
        fetch(`http://localhost:3001/user`, {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('token')
          },
          cache: 'default'
        })
          .then((res) => {
            if (res.status == 200) {
              res.json()
                .then(data => {
                  this.user = data.user
                  this.userLoaded = true
                })
            }
            else {
              localStorage.removeItem('token')
              this.userLoaded = false
            }
          }).catch((err) => {
            localStorage.removeItem('token')
            this.userLoaded = false
          })
      }
    }
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
      <router-link to="/login" v-if="!sign || !userLoaded">Login</router-link>
      <div class="sign-dropdown" v-else-if="sign && userLoaded">
        <div class="user-profile drop-trigger">
          <img :src="user.avatar_url" class="user-avatar">
          <h5 class="username">{{ user.username }}</h5>
        </div>
        <div class="dropdown-content">
          <router-link to="/jogador">Jogador</router-link>
          <router-link to="/mestre">Mestre</router-link>
          <router-link to="/logout" cancel="true">Sair</router-link>
        </div>
      </div>
    </div>
  </div>
  <div id="nav-bar-mobile">
    <div id="menu-toggle">
      <input type="checkbox" />
      <span></span>
      <span></span>
      <span></span>

      <ul id="menu-content">
        <li><router-link to="/">Início</router-link></li>
        <li><router-link to="/comandos">Comandos</router-link></li>
        <li><router-link to="/tutoriais">Tutoriais</router-link></li>
        <li><router-link to="/convite">Adicione o Kami</router-link></li>
        <li v-if="!sign || !userLoaded"><router-link to="/login">Login</router-link></li>
        <li v-else-if="sign && userLoaded">
          <div class="mobile-sign-menu">
            <div class="mobile-user-profile">
              <img :src="user.avatar_url" class="mobile-user-avatar">
              <h5 class="mobile-username">{{ user.username }}</h5>
            </div>
            <div class="mobile-sign-menu-content">
              <router-link to="/jogador">Jogador</router-link>
              <router-link to="/mestre">Mestre</router-link>
              <router-link to="/logout" cancel="true">Sair</router-link>
            </div>
          </div>
        </li>
      </ul>
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
  position: relative;
  z-index: 2;
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
  margin: 5px;
  font-size: 1.4em;
  transition: 0.3s;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
}

.nav-links a:hover {
  background-color: var(--primary);
  transition: 0.3s;
}

.nav-links .link-active {
  background-color: var(--primary);
}

.drop-trigger {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  height: 45px;
}

.sign-dropdown {
  position: relative;
  display: inline-block;
  width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--primary);
  z-index: 1;
  width: 160px;
  margin: 0;
  padding: 0px 5px 0px 5px;
}

.dropdown-content a {
  color: var(--text);
  font-size: 1em;
  font-weight: bold;
  padding: 6px 6px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: var(--text);
  color: var(--primary);
}

.dropdown-content a[cancel='true']:hover {
  background-color: var(--background)
}

.sign-dropdown:hover .dropdown-content {
  display: block;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.sign-dropdown:hover .drop-trigger {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.user-profile {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 0px 0px;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 45px;
  margin: 0;
  padding: 0px 5px 0px 5px;
  min-width: 160px;
}

.user-profile .user-avatar {
  width: 35px;
  height: 35px;
  border: 2px solid var(--background);
  border-radius: 50%;
  background-color: var(--background);
  margin: 0;
  padding: 0;
}

.user-profile .username {
  position: absolute;
  top: 14px;
  right: 0px;
  font-size: 1em;
  max-width: 115px;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin: 0;
  padding: 0;
}

#nav-bar-mobile {
  display: none;
  margin-left: 20px;
  z-index: 3;
}

#menu-toggle {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 1.5em;
  left: 0em;
  z-index: 1;
  -webkit-user-select: none;
  user-select: none;
  z-index: 3;
}

#menu-toggle input {
  display: flex;
  width: 40px;
  height: 32px;
  position: absolute;
  cursor: pointer;
  opacity: 0;
  z-index: 2;
}

#menu-toggle span {
  display: flex;
  width: 2em;
  height: 4px;
  margin-bottom: 5px;
  position: relative;
  background: var(--primary);
  border-radius: 3px;
  z-index: 1;
  transform-origin: 5px 0px;
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
    background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
    opacity 0.55s ease;
}

#menu-toggle span:first-child {
  transform-origin: 0% 0%;
}

#menu-toggle span:nth-last-child(2) {
  transform-origin: 0% 100%;
}

#menu-toggle input:checked~span {
  opacity: 1;
  transform: rotate(45deg) translate(-3px, -1px);
  background: var(--background);
}

#menu-toggle input:checked~span:nth-last-child(3) {
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}

#menu-toggle input:checked~span:nth-last-child(2) {
  transform: rotate(-45deg) translate(0, -1px);
}

#menu-content {
  position: absolute;
  box-shadow: 0 0 10px var(--background);
  margin: -50px 0 0 -50px;
  padding: 6em 30px 1em 50px;
  background-color: var(--primary);
  transform-origin: 0% 0%;
  transform: translate(-100%, 0);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0);
  border-radius: 10px;
  list-style-type: none;
  width: 12em;
}

#menu-content li {
  padding: 10px 0;
  transition-delay: 2s;
}

#menu-content li a {
  font-size: 1.5em;
  color: var(--text);
  font-weight: bold;
  text-decoration: none;
}

#menu-toggle input:checked~ul {
  transform: none;
}

.mobile-sign-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 5px;
  background-color: var(--background);
  border-radius: 10px;
}

.mobile-sign-menu .mobile-user-profile {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.mobile-sign-menu .mobile-user-profile .mobile-user-avatar {
  width: 35px;
  height: 35px;
  border: 2px solid var(--text);
  border-radius: 50%;
  margin: 5px;
  padding: 0;
}

.mobile-sign-menu .mobile-user-profile .mobile-username {
  font-size: 1em;
  max-width: 115px;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin: 0;
  margin-left: 5px;
  padding: 0;
  color: var(--text);
}

.mobile-sign-menu-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0;
  margin-left: 10px;
  padding: 0;
}

.mobile-sign-menu-content a {
  margin: 5px 0px 5px 0px;
}

.mobile-sign-menu-content a[cancel="true"] {
  color: var(--cancel-secondary) !important;
}

@media screen and (max-width: 800px) {
  #nav-bar {
    display: none;
  }

  #nav-bar-mobile {
    display: flex;
  }
}
</style>

