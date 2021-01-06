import Vue from 'vue'
import VueRouter from 'vue-router'
// 解决vue路由跳转连续点击报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
// 有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name 
const Login = () => import(/* webpackChunkName: "home" */ '../views/Login.vue')
const Home = () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
const Welcome = () => import(/* webpackChunkName: "home" */ '../views/Welcome.vue')
const Users = () => import(/* webpackChunkName: "users" */ '../views/Users.vue')
const Roles = () => import(/* webpackChunkName: "roles" */ '../views/Roles.vue')
const Rights = () => import(/* webpackChunkName: "roles" */ '../views/Rights.vue')
const Goods = () => import(/* webpackChunkName: "goods" */ '../views/Goods.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '../views/Params.vue')
const Categories = () => import(/* webpackChunkName: "goods" */ '../views/Categories.vue')
const Orders = () => import(/* webpackChunkName: "orders" */ '../views/Orders.vue')
const Reports = () => import(/* webpackChunkName: "reports" */ '../views/Reports.vue')
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
    redirect: '/home/welcome',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/home/welcome',
        name: 'welcome',
        component: Welcome,
      },
      {
        path: '/home/users',
        name: 'users',
        component: Users,
      },
      {
        path: '/home/roles',
        name: 'roles',
        component: Roles,
      },
      {
        path: '/home/rights',
        name: 'rights',
        component: Rights,
      },
      {
        path: '/home/goods',
        name: 'goods',
        component: Goods,
      },
      {
        path: '/home/params',
        name: 'params',
        component: Params,
      },
      {
        path: '/home/categories',
        name: 'categories',
        component: Categories,
      },
      {
        path: '/home/orders',
        name: 'orders',
        component: Orders,
      },
      {
        path: '/home/reports',
        name: 'reports',
        component: Reports,
      },
    ]
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
