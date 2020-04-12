import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index'
import Home from '@/views/home/index'
import Welcome from '@/components/Welcome/index'
import Users from '@/views/user/index'
import PermList from '@/views/perm/index'
import Roles from '@/views/perm/roles'
import GoodsLists from '@/views/goods/goodsLists'
import Params from '@/views/goods/params'
import Cate from '@/views/goods/cate'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: '登录' },
    {
      path: '/home',
      component: Home,
      name: '首页',
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome, name: '' },
        { path: '/users', component: Users, name: '用户列表' },
        { path: '/rights', component: PermList, name: '权限列表' },
        { path: '/roles', component: Roles, name: '角色列表' },
        { path: '/goods', component: GoodsLists, name: '商品列表' },
        { path: '/params', component: Params, name: '分类参数' },
        { path: '/categories', component: Cate, name: '商品分类' }
      ]
    }

  ]
})

router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from: 代表从那个路径跳转来的
  // next: 是一个函数，表示放行 (next('/**')):代表强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
