// 发布阶段默认入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// (项目优化： 将样式以CDN的方式 引入在 index.html 中)
import './plugins/element.js'
// 全局样式
import './assets/css/globle.css'
// 树形元素结构
import Treetable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 文本样式  (项目优化： 将样式以CDN的方式 引入在 index.html 中)
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'



// axios
// import axios from 'axios'
// 配置请求的根路径 全局配置axios 可以用模块化方式 utils\api 实现
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', Treetable)
// 将富文本编辑器 注册为全局可用的组件
Vue.use(VueQuillEditor)
// 注册全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    // 月从零开始计算 要加1且加上字符串 让类型变成字符串 接着希望是两位的形式 不足两位用零补齐
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
