
import { localRoutesMap } from '@/router/localRoutes'
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}
// import NoBreadcrumb from '@/layouts/NoBreadcrumb'
// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: resolve => require(['@/pages/login'], resolve),
  },
  root: {
    path: '/',
    name: '登录',
    meta: {
      // title: '总览',
      isPage: true,
    },
    redirect: process.env.NODE_ENV == "development" ? '/login' : '/overview/preview',
    component: view.tabs
  },
  ...localRoutesMap,
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: resolve => require(['@/pages/exception/403'], resolve),
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: resolve => require(['@/pages/exception/404'], resolve),
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: resolve => require(['@/pages/exception/500'], resolve),
  },
  blankPage: {
    name: 'blankPage',
    path: 'blankPage',
    component: resolve => require(['@/pages/exception/blankPage'], resolve),
  },
}
// console.log("---fff-----", routerMap);
export default routerMap

