import { createRouter, createWebHistory } from 'vue-router'

import HomeVue from '../views/Home.vue'
import CommandsVue from '../views/Commands.vue'
import TutorialsVue from '../views/Tutorials.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeVue },
    { path: '/comandos', name: 'Commands', component: CommandsVue },
    { path: '/tutoriais', name: 'Tutorials', component: TutorialsVue },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'link-active'
})

export default router