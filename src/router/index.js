import Vue from 'vue'
import VueRouter from 'vue-router'
import { verifyRole } from '@/http/premissions'
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
    path: '/pageMatchDetail',
    name: 'pageMatchDetail',
    component: () => import('../views/user_client/pageMatch/matchDetail'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/pageMatch',
    name: 'pageMatch',
    component: () => import('../views/user_client/pageMatch/createMatch'),
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
    path: '/page404',
    name: 'page404',
    component: () => import('../views/404/index'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/pageAdmin',
    name: 'overview',
    component: () => import('../views/admin_client/overview/index.vue'),
    meta: {
      isAuth: true
    },
    children: [
      {
        path: 'matchManage',
        name: 'matchManage',
        component: () => import('../views/admin_client/matchManage/index.vue'),
        meta: {
          isAuth: true
        }
      },
      {
        path: 'areaManage',
        name: 'areaManage',
        component: () => import('../views/admin_client/areaManage/index.vue'),
        meta: {
          isAuth: true
        }
      },
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('../views/admin_client/userManage/index.vue'),
        meta: {
          isAuth: true
        }
      },
      {
        path: 'authManage',
        name: 'authManage',
        component: () => import('../views/admin_client/authManage/index.vue'),
        meta: {
          isAuth: true
        }
      },
      {
        path: 'communityManage',
        name: 'communityManage',
        component: () => import('../views/admin_client/communityManage/index.vue'),
        meta: {
          isAuth: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果进入未知页面，跳转到404页面
  if (!to.name) {
    router.replace('/page404')
    return
  }
  // 判断用户进入页面是否需要鉴权
  if (to.meta.isAuth) {
    console.log('进入的路由需要进行用户鉴权')
    // 进行用户的权限校验，先判断用户是否登录，如果未登录，跳转到登录页
    if (!localStorage.getItem('userToken')) {
      router.push('/page401/NoLogin')
    } else {
      // 用户登录之后，调用接口校验用户角色是否有权限进入该路由
      verifyRole({ viewRoute: to.name }).then(res => {
        if (res.data.userIn) {
          next()
        } else {
          router.push('/page401/NoAuth')
        }
      }).catch(err => {
        console.log(err)
      })
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
