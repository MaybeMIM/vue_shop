// 定义发送请求的总文件
import http from "@/utils/request";

// 定义请求登录数据接口
export const Login = (data) => {
    // 返回一个promise对象
    return http.post('/login', data)
}
