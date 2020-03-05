import Vue from 'vue'
import VueRouter from 'vue-router'

const Login=()=>import(/* webpackChunkName: "login_home_dashboard" */ '../components/login.vue')
const Home=()=>import(/* webpackChunkName: "login_home_dashboard" */ '../components/home.vue')
const Dashboard=()=>import(/* webpackChunkName: "login_home_dashboard" */ '../components/dashboard/dashboard.vue')
const Commodity=()=>import(/*webpackChunkName:"commodity_order_adminlog"*/ '../components/service/commodity.vue')
const Order=()=>import(/*webpackChunkName:"commodity_order_adminlog"*/ '../components/service/order.vue')
const AdminLog=()=>import(/*webpackChunkName:"commodity_order_adminlog"*/ '../components/log/adminLog.vue')
const Admin=()=>import(/*webpackChunkName:"admin_order_systemConfig"*/ '../components/perm/admin.vue')
const Role=()=>import(/*webpackChunkName:"admin_order_systemConfig"*/ '../components/perm/role.vue')
const SystemConfig=()=>import(/*webpackChunkName:"admin_order_systemConfig"*/ '../components/system/systemConfig.vue')
const dashboard=()=>import('../components/dashboard/dashboard.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/dashboard',
    children:[
      { path: '/dashboard', component: Dashboard },
      { path: '/commodity', component: Commodity },
      { path: '/order', component: Order },
      { path: '/adminLog', component: AdminLog },
      { path: '/admin', component: Admin },
      { path: '/role', component: Role },
      { path: '/systemConfig', component: SystemConfig },
      { path: '/dashboard', component: dashboard }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
