import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './views/Home'
import Welcome from './components/Welcome'
import Users from './components/user/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
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
