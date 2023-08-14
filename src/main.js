import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式
import './assets/css/globle.css'
import Treetable from 'vue-table-with-tree-grid'
// axios
// import axios from 'axios'
// 配置请求的根路径 全局配置axios 可以用模块化方式 utils\api 实现
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', Treetable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
