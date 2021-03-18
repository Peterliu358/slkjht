import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Column',
    component: () => import(/* webpackChunkName: "about" */ '../views/Column.vue')
  },
  {
    path: '/release',
    name: 'Release',
    component: () => import(/* webpackChunkName: "about" */ '../views/Release.vue')
  },
  {
    path: '/smallvideo',
    name: 'Smallvideo',
    component: () => import(/* webpackChunkName: "about" */ '../views/Smallvideo.vue')
  },
  {
    path: '/special',
    name: 'Special',
    component: () => import(/* webpackChunkName: "about" */ '../views/Special.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
