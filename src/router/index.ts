import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes = [{
  path: '/login',
  component: () => import('@/pages/login/index.vue')
  },{
  path: '/',
  redirect: 'sucai',
  component: () => import('@/layout/index.vue'),
  children: [
    {
    path: '/shida',
    component: () => import('@/pages/shida/index.vue')
  },{
    path: '/huke',
    component: () => import('@/pages/huke/index.vue')
  },{
    path: '/sucai',
    component: () => import('@/pages/sucai/index.vue')
  }]
}]
//导入生成的路由数据
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
