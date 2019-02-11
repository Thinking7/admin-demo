import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true},
  {path: '/404', component: () => import('@/views/errorPage/404'), hidden: true},
  {path: '/401', component: () => import('@/views/errorPage/401'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: {title: 'dashboard', icon: 'dashboard', noCache: true}
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/admins',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/admins/list'),
      name: 'admins',
      meta: {title: '管理员列表', icon: 'peoples', noCache: true}
    }]
  },
  {
    path: '/nav',
    component: Layout,
    children: [{
      path: 'list',
      component: () => import('@/views/nav/list'),
      name: 'admin',
      meta: {title: '导航列表', icon: 'guide', noCache: true}
    }]
  },
  {
    path: '/news',
    component: Layout,
    redirect: 'noredirect',
    name: 'news',
    meta: {
      title: '新闻',
      icon: 'component'
    },
    children: [
      {
        path: 'group',
        component: () => import('@/views/news/group'),
        name: 'group',
        meta: {title: '新闻组管理'}
      },
      {path: 'list', component: () => import('@/views/news/list'), name: 'list', meta: {title: '新闻列表'}},
    ]
  },
  {path: '/news/edit', component: () => import('@/views/news/edit'), name: 'edit', meta: {title: '新闻详情'}},

  {
    path: '/banner',
    component: Layout,
    redirect: 'noredirect',
    name: 'banner',
    meta: {
      title: '横幅管理',
      icon: 'drag'
    },
    children: [
      {
        path: 'group',
        component: () => import('@/views/banner/group'),
        name: 'group',
        meta: {title: '横幅组管理'}
      },
      {path: 'list', component: () => import('@/views/banner/list'), name: 'list', meta: {title: '横幅列表'}},
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    name: 'goods',
    meta: {
      title: '商品管理',
      icon: 'component'
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/goods/category'),
        name: 'category',
        meta: {title: '商品分类'}
      },
      {path: 'list', component: () => import('@/views/goods/list'), name: 'list', meta: {title: '商品列表'}},
    ]
  },
  {path: '/goods/edit', component: () => import('@/views/goods/edit'), name: 'edit', meta: {title: '商品详情'}},
  {
    path: '/companyProfile',
    component: Layout,
    children: [{
      path: 'list',
      component: () => import('@/views/companyProfile/list'),
      name: 'companyProfile',
      meta: {title: '公司简介', icon: 'list', noCache: true}
    }]
  },
  {
    path: '/messageBoard',
    component: Layout,
    children: [{
      path: 'list',
      component: () => import('@/views/messageBoard/list'),
      name: 'messageBoard',
      meta: {title: '留言管理', icon: 'email', noCache: true}
    }]
  },
  {path: '/companyProfile/edit', component: () => import('@/views/companyProfile/edit'), hidden: true},
  {
    path: '/setting',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/setting/index'),
      name: 'setting',
      meta: {title: '配置项', icon: 'form', noCache: true}
    }]
  },
  {
    path: '/icon',
    hidden:true,
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/svg-icons/index'),
      name: 'icons',
      meta: {title: 'icons', icon: 'icon', noCache: true}
    }]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    hidden:true,
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'page401',
        meta: {title: 'page401', noCache: true}
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'page404',
        meta: {title: 'page404', noCache: true}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]
