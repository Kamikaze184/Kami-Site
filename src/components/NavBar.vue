<script>
import socket from '../services/websocket.service'
import config from '../config/publicVars'
const signedRoutes = ['Dashboard', 'Sheets', 'Macros', 'Campaigns', 'Sheet', 'Config', 'Macro']

export default {
  data() {
    return {
      sign: localStorage.getItem('token') != null,
      userLoaded: false,
      user: {},
      signedRoute: false,
      collapsed: false
    }
  },
  methods: {
    toggleMenuMobile(action) {
      try {
        if (action == 'open') {
          this.$refs['menu-toggle'].checked = true
        }
        else {
          this.$refs['menu-toggle'].checked = false
        }
      } catch (err) { }
    },
    toggleSideMenu() {
      if (this.collapsed) {
        this.collapsed = false
      }
      else {
        this.collapsed = true
      }
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) {
        this.collapsed = false
      }
      else {
        this.collapsed = true
      }
    })
  },
  computed: {
    userState() {
      return this.$store.state.user
    },
  },
  watch: {
    $route() {
      if (signedRoutes.includes(this.$route.name)) {
        this.signedRoute = true
      }
      else {
        this.signedRoute = false
      }

      this.sign = localStorage.getItem('token') != null

      if (this.sign) {
        fetch(`${config.API_URI}/user`, {
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
                  this.$store.commit('setUser', data.user)
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
    },
    collapsed() {
      if (this.signedRoute && this.sign) {
        if (this.collapsed) {
          this.$refs['toggle-signed-nav-bar'].style.left = '0px'
          this.$refs['toggle-signed-nav-bar'].style.transform = 'rotate(180deg)'

          this.$refs['collapsable-menu'].style.transform = 'translateX(-100%)'

          this.$refs['signed-nav-bar'].style.zIndex = '4'

          if (this.$route.name != 'Sheet' && this.$route.name != 'Macro') {
            this.$refs['toggle-signed-nav-bar'].style.filter = 'var(--primary-filter)'
          }

          if (window.innerWidth > 800) {
            setTimeout(() => {
              this.$refs['signed-nav-bar'].style.width = '50px'
            }, 450)
          }
        }
        else {
          this.$refs['toggle-signed-nav-bar'].style.left = '19em'
          this.$refs['toggle-signed-nav-bar'].style.transform = 'rotate(0deg)'

          this.$refs['collapsable-menu'].style.transform = 'translateX(0%)'

          this.$refs['signed-nav-bar'].style.zIndex = '4'

          this.$refs['toggle-signed-nav-bar'].style.filter = 'var(--background-filter)'

          this.$refs['signed-nav-bar'].style.width = '22em'
        }
      }
    },
    userState(newValue) {
      this.user = newValue
    }
  },
  beforeMount() {
    socket.on('user-password-changed', () => {
      if (!this.$store.state.config.changedPasswordNow) {
        localStorage.removeItem('token')
        this.$store.commit('setUser', {})
        window.location.href = '/login'
      }
    })

    socket.on('user-changed', (data) => {
      if (data.user.id == this.$store.state.user.id) {
        this.$store.commit('setUser', data.user)
      }
    })
  },
}
</script>

<template>
  <div id="nav-bar" v-if="!signedRoute">
    <router-link to="/">
      <div class="nav-logo">
        <img src="../assets/img/logo.png" alt="Logo do Kami" />
        <h1>Kami</h1>
      </div>
    </router-link>
    <div class="nav-links">
      <router-link to="/">Inicio</router-link>
      <router-link to="/tutoriais">Tutoriais</router-link>
      <router-link to="/login" v-if="!sign || !userLoaded">Login</router-link>
      <div class="sign-dropdown" v-else-if="sign && userLoaded">
        <div class="user-profile drop-trigger">
          <img :src="user.avatar_url ? user.avatar_url : `https://ui-avatars.com/api/?name=${user.username}`"
            class="user-avatar">
          <h5 class="username">{{ user.username }}</h5>
        </div>
        <div class="dropdown-content">
          <router-link to="/dashboard">Dashboard</router-link>
          <router-link to="/fichas">Fichas</router-link>
          <router-link to="/macros">Macros</router-link>
          <router-link to="/logout" cancel="true">Sair</router-link>
        </div>
      </div>
    </div>
  </div>
  <div id="nav-bar-mobile" ref="menu-mobile">
    <div id="menu-toggle">
      <input type="checkbox" ref="menu-toggle" />
      <span></span>
      <span></span>
      <span></span>

      <ul id="menu-content">
        <li><router-link to="/">Início</router-link></li>
        <li><router-link to="/tutoriais">Tutoriais</router-link></li>
        <li v-if="!sign || !userLoaded"><router-link to="/login">Login</router-link></li>
        <li v-else-if="sign && userLoaded">
          <div class="mobile-sign-menu">
            <div class="mobile-user-profile">
              <img :src="user.avatar_url ? user.avatar_url : `https://ui-avatars.com/api/?name=${user.username}`"
                class="mobile-user-avatar">
              <h5 class="mobile-username">{{ user.username }}</h5>
            </div>
            <div class="mobile-sign-menu-content">
              <router-link to="/dashboard">Dashboard</router-link>
              <router-link to="/fichas">Fichas</router-link>
              <router-link to="/macros">Macros</router-link>
              <router-link to="/logout" cancel="true">Sair</router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div id="signed-nav-bar" v-if="signedRoute && this.sign" ref="signed-nav-bar">
    <img id="toggle-signed-nav-bar" src="../assets/img/side-menu.svg" @click="toggleSideMenu()"
      ref="toggle-signed-nav-bar">
    <div class="collapsable-menu" ref="collapsable-menu" :collapsed="collapsed">
      <div class="user-profile">
        <img :src="user.avatar_url ? user.avatar_url : `https://ui-avatars.com/api/?name=${user.username}`"
          class="user-avatar">
        <h5 class="username">{{ user.username }}</h5>
      </div>
      <div class="menu-buttons">
        <div class="base-buttons">
          <div class="sub-buttons">
            <router-link to="/">Inicio</router-link>
            <router-link to="/tutoriais">Tutoriais</router-link>
          </div>
        </div>
        <div class="dashboard-buttons">
          <router-link to="/dashboard">Dashboard</router-link>
          <router-link to="/fichas" class="menu-button">Fichas</router-link>
          <router-link to="/macros" class="menu-button">Macros</router-link>
        </div>
        <div class="other-buttons">
          <router-link to="/configuracoes" class="menu-button">Configurações</router-link>
          <router-link to="/logout" class="menu-button logout-button">Sair</router-link>
        </div>
      </div>
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

.dropdown-content a[cancel='true'] {
  color: var(--cancel-secondary);
  background-color: var(--background);
}

.dropdown-content a[cancel='true']:hover {
  background-color: var(--cancel-secondary);
  color: var(--background);
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

#nav-bar .user-profile,
#nav-bar-mobile .user-profile {
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

#nav-bar .user-profile .user-avatar,
#nav-bar-mobile .user-profile .user-avatar {
  width: 35px;
  height: 35px;
  border: 2px solid var(--background);
  border-radius: 50%;
  background-color: var(--background);
  margin: 0;
  padding: 0;
}

#nav-bar .user-profile .username,
#nav-bar-mobile .user-profile .username {
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
  position: fixed;
  top: 1.5em;
  left: 20px;
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
  top: -7px;
  left: -5px;
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
  max-height: 75vh;
  overflow-y: auto;
  overflow-x: hidden;
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

#signed-nav-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 22em;
  margin: 0;
  padding: 0;
  position: fixed;
}

.collapsable-menu {
  display: flex;
  flex-direction: column;
  width: 22em;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--primary);
  position: sticky;
  transition: all 0.5s linear;
}

#toggle-signed-nav-bar {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0px;
  left: 19em;
  right: 1px;
  z-index: 4 !important;
  filter: var(--background-filter);
  cursor: pointer;
  transition: all 0.5s linear;
}

#signed-nav-bar .user-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  margin-top: 20px;
  padding: 0;
}

#signed-nav-bar .user-profile .user-avatar {
  width: 100px;
  height: 100px;
  border: 3px solid var(--text);
  border-radius: 50%;
  margin: 0;
  margin-top: 20px;
  padding: 0;
}

#signed-nav-bar .user-profile .username {
  font-size: 1.5em;
  max-width: 90%;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin: 0;
  margin-top: 20px;
  padding: 0;
  color: var(--text);
}

#signed-nav-bar .menu-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  margin-top: 20px;
  padding: 0;
  overflow-y: hidden;
}

#signed-nav-bar .menu-buttons a {
  font-size: 1.5em;
  color: var(--text);
  background-color: var(--background);
  font-weight: bold;
  text-decoration: none;
  border-radius: 10px;
  transition: 0.3s;
  text-align: center;
  padding: 15px;
  width: 5em;
  margin: 5px;
  box-shadow: 5px 5px 15px 0px #00000044;
}

#signed-nav-bar .menu-buttons a:hover {
  background-color: var(--background-secondary);
}

#signed-nav-bar .menu-buttons .base-buttons {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
}

#signed-nav-bar .menu-buttons .base-buttons .sub-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
}

#signed-nav-bar .dashboard-buttons a {
  width: calc(11em + 15px);
}

#signed-nav-bar .dashboard-buttons {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
}

#signed-nav-bar .other-buttons a {
  width: calc(11em + 15px);
}

#signed-nav-bar .other-buttons {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  margin-bottom: 55px;
  padding: 0;
}

#signed-nav-bar .menu-buttons .logout-button {
  color: var(--cancel-secondary);
}

#signed-nav-bar .menu-buttons .link-active {
  background-color: var(--background-secondary);
}

@media screen and (max-width: 800px) {
  #nav-bar {
    display: none;
  }

  #nav-bar-mobile {
    display: flex;
  }

  #signed-nav-bar {
    display: none;
  }

  #signed-nav-bar-mobile {
    display: flex;
  }
}

@media screen and (max-height: 800px) {
  #signed-nav-bar .menu-buttons {
    overflow-y: scroll;
  }

  #signed-nav-bar .menu-buttons::-webkit-scrollbar-track {
    background-color: var(--background);
    border-radius: 10px;
  }

  #signed-nav-bar .menu-buttons::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background);
  }

  #signed-nav-bar .menu-buttons::-webkit-scrollbar-thumb {
    background-color: var(--background-secondary);
    border-radius: 10px;
  }

  #signed-nav-bar .menu-buttons a {
    font-size: 1.1em;
    width: 7em;
    height: 1.3em;
    padding: 10px;
  }

  #signed-nav-bar .dashboard-buttons a {
    width: calc(15em + 15px);
  }

  #signed-nav-bar .other-buttons a {
    width: calc(15em + 15px);
  }
}
</style>

