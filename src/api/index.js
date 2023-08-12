// 定义发送请求的总文件
import http from "@/utils/request";

// 定义请求登录数据接口
export const Login = (data) => {
    // 返回一个promise对象
    return http.post('/login', data)
}

// 获取左侧菜单
export const genMenuList = () => {
    return http.get('/menus')
}
// 获取用户数据列表
export const getUserList = (params) => {
    return http.get('users/', params)
}
// 更新用户状态
export const updateUserState = (data) => {
    return http.put(`users/${data.id}/state/${data.mg_state}`, data)
}

export const addUser = (data) => {
    // 返回一个promise对象
    return http.post('users/', data)
}
// 编辑用户信息
export const EditUser = (data) => {
    return http.put(`users/${data.id}`, { email: data.email, mobile: data.mobile })
}
// 删除用户信息
export const deleteUser = (data) => {
    return http.delete(`users/${data}`, data)
}
// 请求所有权限信息
export const getRightsList = () => {
    return http.get('rights/list')
}
// 请求所有权限信息
export const getRolesList = () => {
    return http.get('roles')
}
// 删除用户权限
export const deleteRight = (role, rightId) => {
    return http.delete(`roles/${role.id}/rights/${rightId}`, role, rightId)
}
// 请求所有权限列表
export const getRight = () => {
    return http.get('rights/tree')
}
// 请求更改分配权限
export const allotRight = (id, params) => {
    return http.post(`roles/${id}/rights`, params)
}
// 请求分配用户角色
export const EditRole = (data, params) => {
    return http.put(`users/${data.id}/role`, params)
}