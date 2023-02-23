import { createRouter, createWebHistory } from 'vue-router'

import HomeVue from '../views/Home.vue'
import CommandsVue from '../views/Commands.vue'
import TutorialsVue from '../views/Tutorials.vue'
import LoginVue from '../views/Login.vue'
import LogoutVue from '../views/Logout.vue'
import CallbackVue from '../views/Callback.vue'
import TutorialVue from '../views/Tutorial.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeVue },
    { path: '/comandos', name: 'Commands', component: CommandsVue },
    { path: '/tutoriais', name: 'Tutorials', component: TutorialsVue },
    { path: '/tutoriais/:tutorial', component: TutorialVue },
    { path: '/login', name: 'Login', component: LoginVue },
    { path: '/logout', name: 'Logout', component: LogoutVue },
    { path: '/callback', name: 'Callback', component: CallbackVue }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'link-active'
})

export default router