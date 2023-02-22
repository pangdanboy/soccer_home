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
    component: () => import('../views/pageHome')
  },
  {
    path: '/pageChatRoom',
    name: 'pageChatRoom',
    component: () => import('../views/pageChatRoom')
  },
  {
    path: '/pageNews',
    name: 'pageNews',
    component: () => import('../views/pageNews')
  },
  {
    path: '/pageCommunity',
    name: 'pageCommunity',
    component: () => import('../views/pageCommunity')
  },
  {
    path: '/pageMerch',
    name: 'pageMerch',
    component: () => import('../views/pageMerch')
  },
  {
    path: '/pageUserLogin',
    name: 'pageUserLogin',
    component: () => import('../views/pageUserLogin')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
