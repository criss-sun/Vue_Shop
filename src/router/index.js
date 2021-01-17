import Vue from 'vue'
import VueRouter from 'vue-router'
// 解决vue路由跳转连续点击报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
// 有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name 
const Login = function () { return import(/* webpackChunkName: "home" */ '../views/Login.vue') }
const Home = function () { return import(/* webpackChunkName: "home" */ '../views/Home.vue') }
const Welcome = function () { return import(/* webpackChunkName: "home" */ '../views/Welcome.vue') }
const Users = function () { return import(/* webpackChunkName: "users" */ '../views/Users.vue') }
const Roles = function () { return import(/* webpackChunkName: "roles" */ '../views/Roles.vue') }
const Rights = function () { return import(/* webpackChunkName: "roles" */ '../views/Rights.vue') }
const Goods = function () { return import(/* webpackChunkName: "goods" */ '../views/Goods.vue') }
const AddGoods = function () { return import(/* webpackChunkName: "goods" */ '../views/AddGoods.vue') }
const Params = function () { return import(/* webpackChunkName: "goods" */ '../views/Params.vue') }
const Categories = function () { return import(/* webpackChunkName: "goods" */ '../views/Categories.vue') }
const Orders = function () { return import(/* webpackChunkName: "orders" */ '../views/Orders.vue') }
const Reports = function () { return import(/* webpackChunkName: "reports" */ '../views/Reports.vue') }
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
        path: '/home/goods/add',
        name: 'add',
        component: AddGoods,
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
