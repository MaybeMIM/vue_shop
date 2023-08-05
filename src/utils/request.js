// 二次封装axios
import axios from "axios";

const http = axios.create({
    // 通用请求地址前缀
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    // 超时时间 5s
    timeout: 5000,

})


// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送之前做什么
    return config;
}, function (error) {
    // 对请求错误做什么
    return Promise.reject(error);
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对响应数据做什么
    return response;
}, function (error) {
    // 对响应错误做什么
    return Promise.reject(error);
})

export default http