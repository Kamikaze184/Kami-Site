import { createApp } from 'vue'
import { createStore } from 'vuex'
import router from './router'
import './style.css'
import config from './config/publicVars'
import App from './App.vue'

const store = createStore({
    state() {
        return {
            user: {},
            config: {
                changedPasswordNow: false,
            }
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setConfig(state, payload) {
            state.config = payload
        }
    },
    actions: {
        async getUser(context) {
            const response = await fetch(`${config.API_URI}/user`, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                cache: 'no-cache'
            })

            if (response.status === 200) {
                const data = await response.json()
                context.commit('setUser', data.user)
            }
            else {
                localStorage.removeItem('token')
                context.commit('setUser', {})
            }
        },
    },
    getters: {
        user(state) {
            return state.user
        },
        config(state) {
            return state.config
        }
    },
})

createApp(App)
    .use(router)
    .use(store)
    .mount('#app')