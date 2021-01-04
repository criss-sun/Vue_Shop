import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name 
const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
const Home = () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach(function (to, from, next) {
  if (to.path == '/login') return next()
  const token = sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
