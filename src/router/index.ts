import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/index'
import pinia from '@/store/index'
const userStore = useUserStore(pinia)

const routes = [{
  path: '/',
  redirect: 'sucai',
  component: () => import('@/layout/index.vue'),
  children: [
    {
      path: '/shida',
      component: () => import('@/pages/shida/index.vue')
    }, {
      path: '/huke',
      component: () => import('@/pages/huke/index.vue')
    }, {
      path: '/sucai',
      component: () => import('@/pages/sucai/index.vue')
    }, {
      path: '/user',
      component: () => import('@/pages/user/index.vue')
    },
    {
      path: '/shorts',
      component: () => import('@/pages/shorts/index.vue')
    },
    {
      path: '/shop',
      component: () => import('@/pages/store/index.vue')
    }
  ]
}, {
  path: '/server-admin',
  component: () => import('@/pages/server-admin/index.vue')
}]
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
      return
    }
    next()
  }
  next()
})

export default router
