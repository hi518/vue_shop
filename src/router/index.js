import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import Add from '../components/goods/Add.vue'
import Orders from '../components/order/Orders.vue'
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights},
      { path: '/roles',component: Roles},
      { path: '/categories',component: Cate},
      { path: '/params', component: Params},
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add},
      { path: '/orders', component: Orders},
      { path: '/reports', component: Report}
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫控制页面访问权限
router.beforeEach((to, from, next) => {
  // 1.如果访问登录页，直接放行
  if (to.path === '/login') return next();
  // 2.如果访问的是其他的需要权限的页面，确认是否有 token
  const tokenStr = window.sessionStorage.getItem('token');
  //  2.1 如果没有 token ，强制进入登录页
  if (!tokenStr) return next('/login');
  //  2.2 有 token ，放行
  next();
})

export default router
