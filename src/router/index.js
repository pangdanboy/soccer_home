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
    component: () => import('../views/user_client/pageHome/index.vue')
  },
  {
    path: '/pageMessageCenter',
    name: 'pageMessageCenter',
    component: () => import('../views/user_client/pageMessageCenter/index.vue')
  },
  {
    path: '/pageNews',
    name: 'pageNews',
    component: () => import('../views/user_client/pageNews/index.vue')
  },
  {
    path: '/pageCommunity',
    name: 'pageCommunity',
    component: () => import('../views/user_client/pageCommunity/index.vue')
  },
  {
    path: '/pageUserCenter',
    name: 'pageUserCenter',
    component: () => import('../views/user_client/pageUserCenter/index.vue')
  },
  {
    path: '/pageLogin',
    name: 'pageLogin',
    component: () => import('../views/user_client/pageLogin/index.vue')
  },
  {
    path: '/pageAdmin',
    name: 'pageAdmin',
    component: () => import('../views/admin_client/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
