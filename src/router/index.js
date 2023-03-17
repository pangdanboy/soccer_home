import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/pageHome'
  },
  {
    path: '/pageHome',
    name: 'pageHome',
    component: () => import('../views/pageHome/index.vue')
  },
  {
    path: '/pageMessageCenter',
    name: 'pageMessageCenter',
    component: () => import('../views/pageMessageCenter/index.vue')
  },
  {
    path: '/pageNews',
    name: 'pageNews',
    component: () => import('../views/pageNews/index.vue')
  },
  {
    path: '/pageCommunity',
    name: 'pageCommunity',
    component: () => import('../views/pageCommunity/index.vue')
  },
  {
    path: '/pageUserCenter',
    name: 'pageUserCenter',
    component: () => import('../views/pageUserCenter/index.vue')
  },
  {
    path: '/pageLogin',
    name: 'pageLogin',
    component: () => import('../views/pageLogin/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
