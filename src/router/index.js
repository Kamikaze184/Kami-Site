import { createRouter, createWebHistory } from 'vue-router'

import HomeVue from '../views/Home.vue'
import CommandsVue from '../views/Commands.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeVue },
    { path: '/comandos', name: 'Commands', component: CommandsVue },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'link-active'
})

export default router