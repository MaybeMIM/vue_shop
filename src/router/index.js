import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login"
import Home from "../components/Home"
import Welcome from '../components/Welcome'
import User from '../views/Users.vue'
import Roles from "../views/power/Roles"
import Rights from "../views/power/Rights"
import Cate from '../views/goods/Cate'
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
