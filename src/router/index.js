import Vue from 'vue'
import VueRouter from 'vue-router'
// import { USER_PERMISSIONS } from '@/constant'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/pageHome'
  },
  {
    path: '/pageHome',
    name: 'pageHome',
    component: () => import('../views/user_client/pageHome/index.vue'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/pageMessageCenter',
    name: 'pageMessageCenter',
    component: () => import('../views/user_client/pageMessageCenter/index.vue'),
    meta: {
      isAuth: true
    }
  },
  {
    path: '/pageNews',
    name: 'pageNews',
    component: () => import('../views/user_client/pageNews/index.vue'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/pageCommunity',
    name: 'pageCommunity',
    component: () => import('../views/user_client/pageCommunity/index.vue'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/pageUserCenter',
    name: 'pageUserCenter',
    component: () => import('../views/user_client/pageUserCenter/index.vue'),
    meta: {
      isAuth: true
    }
  },
  {
    path: '/pageLogin',
    name: 'pageLogin',
    component: () => import('../views/user_client/pageLogin/index.vue'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/pageMatch',
    name: 'pageMatch',
    component: () => import('../views/user_client/pageMatch/index'),
    meta: {
      isAuth: true
    }
  },
  {
    path: '/page401/:type',
    name: 'page401',
    component: () => import('../views/401/index'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/pageAdmin/overview',
    name: 'overview',
    component: () => import('../views/admin_client/overview/index.vue'),
    meta: {
      isAuth: true
    }
  },
  {
    path: '/pageAdmin/matchManage',
    name: 'matchManage',
    component: () => import('../views/admin_client/matchManage/index.vue'),
    meta: {
      isAuth: true
    }
  },
  {
    path: '/pageAdmin/areaManage',
    name: 'areaManage',
    component: () => import('../views/admin_client/areaManage/index.vue'),
    meta: {
      isAuth: true
    }
  },
  {
    path: '/pageAdmin/userManage',
    name: 'userManage',
    component: () => import('../views/admin_client/userManage/index.vue'),
    meta: {
      isAuth: true
    }
  },
  {
    path: '/pageAdmin/communityManage',
    name: 'communityManage',
    component: () => import('../views/admin_client/communityManage/index.vue'),
    meta: {
      isAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    console.log('进入的路由需要进行用户鉴权')
    // 进行用户的权限校验，先判断用户是否登录，如果未登录，跳转到登录页
    if (!localStorage.getItem('userToken')) {
      router.push('/page401/NoLogin')
    } else { // 用户登录之后，调用接口校验用户角色是否有权限进入该路由
      // const userRole = localStorage.getItem('user_role')
      next()
    }
  } else if (to.name === 'pageLogin') {
    // 进入登录页，如果用户已经登录，跳转到主页
    if (localStorage.getItem('userToken')) {
      router.push('/pageHome')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
