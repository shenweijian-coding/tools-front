import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/index'
import pinia from '@/store/index'
const userStore = useUserStore(pinia)

const routes = [{
  path: '/',
  redirect: 'sucai',
  auth: 'all',
  component: () => import('@/layout/index.vue'),
  children: [{
      path: '/sucai',
      component: () => import('@/pages/sucai/index.vue')
    }, {
      path: '/user',
      component: () => import('@/pages/user/index.vue')
    },
    {
      path: '/shop',
      component: () => import('@/pages/store/index.vue')
    },
    {
      path: '/help',
      component: () => import('@/pages/help/index.vue')
    }
  ]
},
  {
    path: '/server-admin',
    title: '后台管理',
    auth: 'admin',
    redirect: '/server-admin/index',
    component: () => import('@/layout/admin-layout.vue'),
    children: [
      {
        path: '/server-admin/index',
        title: '网站配置',
        component: () => import('@/pages/server-admin/setting.vue')
      },
      {
        path: '/server-admin/cookie',
        title: '素材账号配置',
        component: () => import('@/pages/server-admin/cookie.vue')
      },
      {
        path: '/server-admin/accode',
        title: '卡密管理',
        component: () => import('@/pages/server-admin/accode.vue')
      },
      {
        path: '/server-admin/user',
        title: '用户管理',
        component: () => import('@/pages/server-admin/user.vue')
      },
      {
        path: '/server-admin/pay',
        title: '站内充值',
        component: () => import('@/pages/server-admin/pay.vue')
      },
      {
        path: '/server-admin/other',
        title: '第三方API对接',
        component: () => import('@/pages/server-admin/otherInfo.vue')
      }
    ]
  }
]
//导入生成的路由数据
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // 1. 每个条件执行后都要跟上 next() 或 使用路由跳转 api 否则页面就会停留一动不动
  // 2. 要合理的搭配条件语句，避免出现路由死循环。
  const token = getToken()
  console.log(token);
  if (to.path === '/server-admin' && userStore && !userStore.$state.isAdmin) {
    router.replace({
      path: '/'
    })
  }
  if (to.path === '/user') {
    if (!token) {
      router.replace({
        path: '/'
      })
    }
  }
  next()
})

export default router
