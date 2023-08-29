import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const Login = () => import(/*webpackChunkName:"login_home_welcome" */"../components/Login")
// import Login from "../components/Login"
const Home = () => import(/*webpackChunkName:"login_home_welcome" */"../components/Home")
// import Home from "../components/Home"
const Welcome = () => import(/*webpackChunkName:"login_home_welcome" */"../components/Welcome")
// import Welcome from '../components/Welcome'

// import User from '../views/Users.vue'
const User = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/Users")
// import Roles from "../views/power/Roles"
const Roles = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/power/Roles")
// import Rights from "../views/power/Rights"
const Rights = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/power/Rights")

// import Cate from '../views/goods/Cate'
const Cate = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/goods/Cate")
// import Params from "../views/goods/Params"
const Params = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/goods/Params")
const List = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/goods/List")
const Add = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/goods/Add")
// import Report from '../views/report/report'
const Report = () => import(/*webpackChunkName:"Uers_Rights_Roles" */"../views/report/report")

Vue.use(VueRouter)



const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      redirect: '/welcome',
      component: Home,
      children: [
        {
          path: '/welcome', component: Welcome,
        }, {
          path: '/users', component: User
        }
        , {
          path: '/roles', component: Roles
        }
        , {
          path: '/rights', component: Rights
        }
        , {
          path: '/categories', component: Cate
        }
        , {
          path: '/params', component: Params
        }
        , {
          path: '/reports', component: Report
        }
        , {
          path: '/goods', component: List
        }
        , {
          path: '/goods/Add', component: Add
        }
      ]
    },
  ]
})



router.beforeEach((to, from, next) => {
  // 登录页不需要权限
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
