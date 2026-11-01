import { createRouter, createWebHistory } from 'vue-router'
import LastNight from './pages/LastNight.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LastNight, meta: { section: 'scores' } },
    { path: '/:date(\\d{4}-\\d{2}-\\d{2})', component: LastNight, meta: { section: 'scores' } },
    { path: '/game/:id', component: () => import('./pages/BoxScore.vue'), meta: { section: 'scores' } },
    { path: '/standings', component: () => import('./pages/Standings.vue'), meta: { section: 'standings' } },
    { path: '/players', component: () => import('./pages/ComingSoon.vue'), props: { title: 'Players' }, meta: { section: 'players' } },
    { path: '/teams', component: () => import('./pages/ComingSoon.vue'), props: { title: 'Teams' }, meta: { section: 'teams' } },
    { path: '/:pathMatch(.*)*', component: () => import('./pages/ComingSoon.vue'), props: { title: 'Page not found' } },
  ],
  scrollBehavior: (to, from, saved) => saved ?? (to.path === from.path ? false : { top: 0 }),
})
