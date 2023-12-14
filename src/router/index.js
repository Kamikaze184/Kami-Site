import { createRouter, createWebHistory } from 'vue-router'

import HomeVue from '../views/Home.vue'
import CommandsVue from '../views/Commands.vue'
import TutorialsVue from '../views/Tutorials.vue'
import LoginVue from '../views/Login.vue'
import LogoutVue from '../views/Logout.vue'
import SyncVue from '../views/Sync.vue'
import TutorialVue from '../views/Tutorial.vue'
import DashboardVue from '../views/Dashboard.vue'
import SheetsVue from '../views/Sheets.vue'
import CampaignsVue from '../views/Campaigns.vue'
import MacrosVue from '../views/Macros.vue'
import SheetVue from '../views/Sheet.vue'
import ConfigVue from '../views/Config.vue'
import NotFoundVue from '../views/NotFound.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeVue, meta: { title: 'teste' } },
    { path: '/comandos', name: 'Commands', component: CommandsVue },
    { path: '/tutoriais', name: 'Tutorials', component: TutorialsVue },
    { path: '/tutoriais/:tutorial', component: TutorialVue },
    { path: '/login', name: 'Login', component: LoginVue },
    { path: '/logout', name: 'Logout', component: LogoutVue },
    { path: '/sync', name: 'Sync', component: SyncVue },
    { path: '/dashboard', name: 'Dashboard', component: DashboardVue },
    { path: '/fichas', name: 'Sheets', component: SheetsVue },
    { path: '/ficha/:userId/:sheetName', name: 'Sheet', component: SheetVue },
    // { path: '/campanhas', name: 'Campaigns', component: CampaignsVue },
    // { path: '/macros', name: 'Macros', component: MacrosVue },
    { path: '/configuracoes', name: 'Config', component: ConfigVue },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundVue }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'link-active'
})

const unsignedRoutes = ['Login', 'Home', 'Tutorials', 'Commands', 'Tutorial', 'NotFound']
router.beforeEach((to, from, next) => {
    if (!unsignedRoutes.includes(to.name) && !localStorage.getItem('token')) {
        next({ name: 'Login' })
    }
    else {
        next()
    }
})



export default router