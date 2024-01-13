// 定义发送请求的总文件
import http from "@/utils/request";

// 1.2.1 定义请求登录数据接口
export const Login = (data) => {
    // 返回一个promise对象
    return http.post('/login', data)
}

// 1.4.2 获取左侧菜单
export const genMenuList = () => {
    return http.get('/menus')
}
//1.3.1 获取用户数据列表
export const getUserList = (params) => {
    return http.get('users/', params)
}
//1.3.3 更新用户状态
export const updateUserState = (data) => {
    return http.put(`users/${data.id}/state/${data.mg_state}`, data)
}
// 1.3.2 添加用户
export const addUser = (data) => {
    // 返回一个promise对象
    return http.post('users/', data)
}
//1.3.5 编辑用户信息
export const EditUser = (data) => {
    return http.put(`users/${data.id}`, { email: data.email, mobile: data.mobile })
}
//1.3.6 删除用户信息
export const deleteUser = (data) => {
    return http.delete(`users/${data}`, data)
}
//1.4.1 请求所有权限信息
export const getRightsList = () => {
    return http.get('rights/list')
}
//1.5.1 请求所有权限信息
export const addRoles = (roleName, roleDesc) => {
    return http.post('roles', { roleName: roleName, roleDesc: roleDesc })
}
//1.5.2 请求所有权限信息
export const getRolesList = () => {
    return http.get('roles')
}
//1.5.4 编辑用户
export const editRoles = (role, roleName, roleDesc) => {
    return http.put(`roles/${role}`, { roleId: role, roleName: roleName, roleDesc: roleDesc })
}
//1.5.5 删除用户
export const deleteRoles = (role) => {
    return http.delete(`roles/${role.id}`, role)
}
//1.5.7 删除用户权限
export const deleteRight = (role, rightId) => {
    return http.delete(`roles/${role.id}/rights/${rightId}`, role, rightId)
}
//1.4.1 请求所有权限列表
export const getRight = () => {
    return http.get('rights/tree')
}
//1.5.6 请求更改分配权限
export const allotRight = (id, params) => {
    return http.post(`roles/${id}/rights`, params)
}
//1.3.7 请求分配用户角色
export const EditRole = (data, params) => {
    return http.put(`users/${data.id}/role`, params)
}
//1.6.1 请求所有商品分类列表
export const getCateList = (params) => {
    return http.get('categories/', params)
}
//1.6.2 添加商品分类
export const addCate = (params) => {
    return http.post('categories/', params)
}
//1.6.4 编辑商品分类
export const editCate = (params) => {
    return http.put(`categories/${params.cat_id}`, params)
}
//1.6.5 删除商品分类
export const deleteCate = (data) => {
    return http.delete(`categories/${data}`, data)
}
//1.7.1 请求所有商品分类列表
export const getParamsList = (cateId, params) => {
    return http.get(`categories/${cateId}/attributes`, params)
}
//1.7.2 请求所有商品分类列表
export const addParams = (cateId, params) => {
    return http.post(`categories/${cateId}/attributes`, params)
}
//1.7.4 请求所有商品分类列表
export const getParams = (cateId, attrId, params) => {
    return http.get(`categories/${cateId}/attributes/${attrId}`, params)
}
//1.7.5 请求所有商品分类列表
export const editParams = (cateId, attrId, params) => {
    return http.put(`categories/${cateId}/attributes/${attrId}`, params)
}
//1.7.3 请求所有商品分类列表
export const deleteParams = (cateId, attrId) => {
    return http.delete(`categories/${cateId}/attributes/${attrId}`)
}
//1.8.1 请求所有商品分类列表
export const getGoodsList = (params) => {
    return http.get(`goods`, params)
}
//1.8.2 请求所有商品分类列表
export const addGoods = (params) => {
    return http.post('goods', params)
}
//1.8.3 删除单个商品
export const deleteGood = (goodId) => {
    return http.delete(`goods/${goodId}`)
}

//1.10.1  获取订单数据列表
export const getOrdersList = (params) => {
    return http.get(`orders`, params)
}
//1.10.5  获取订单数据列表
// export const getProgress = (params) => {
//     return http.get(`kuaidi/:804909574412544580`, params)
// }

//1.11.1 请求折线图数据
export const getCross = () => {
    return http.get(`reports/type/1`)
}