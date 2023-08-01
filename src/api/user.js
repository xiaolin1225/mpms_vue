import request from "@/utils/request";

/**
 * 用户是否存在
 * @param data 用户名
 * @returns {Boolean} 用户是否存在
 */
export const isUserExist = (data) => {
    return request({
        url: "/user/exist",
        method: "post",
        data
    })
}

/**
 * 验证验证码是否正确
 * @param params 验证码信息
 * @returns {Boolean} 验证码是否正确
 */
export const isCodeCorrect = (params) => {
    return request({
        url: `/captcha/validation`,
        method: "get",
        params
    })
}

/**
 * 登录
 * @param data 登录数据
 * @returns {String} token
 */
export const login = (data) => {
    return request({
        url: "/login",
        method: "post",
        data
    })
}

/**
 * 注销登录
 */
export const logout = () => {
    return request({
        url: "/logout",
        method: "post",
    })
}

/*用户注册*/
export const register = (data) => {
    return request({
        url: "/user/register",
        method: "post",
        data
    });
}

/*获取用户列表*/
export const requestUserListPage = (params) => {
    return request({
        url: "/user/list/page",
        method: "get",
        params
    });
}

/*获取用户选择列表*/
export const requestUserListSelect = (params) => {
    return request({
        url: "/user/list/select",
        method: "get",
        params
    });
}

/*获取用户信息*/
export const requestUserInfo = (id) => {
    return request({
        url: `/user${id ? '/' + id : ''}`,
        method: "get"
    });
}

/**
 * 获取用户角色列表
 * @returns {Array} 用户角色列表
 */
export const requestUserRole = () => {
    return request({
        url: `/role/list`,
        method: "get"
    });
}


/*添加用户*/
export const saveUserInfo = (data) => {
    return request({
        url: "/user",
        method: "post",
        data
    });
}

/*修改用户信息*/
export const updateUserInfo = (data) => {
    return request({
        url: `/user`,
        method: "put",
        data
    });
}

/*删除用户*/
export const deleteUser = (id) => {
    return request({
        url: `/user/${id}`,
        method: "delete"
    });
}

/*批量删除用户*/
export const deleteUsers = (data) => {
    return request({
        url: `/user`,
        method: "delete",
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/*重置用户密码*/
export const resetUserPassword = (data) => {
    return request({
        url: `/user/password/reset`,
        method: "put",
        data
    });
}

/**
 * 更新用户信息
 * @param data 用户信息
 * @returns {Boolean} 修改结果
 */
export const updateProfile = (data) => {
    return request({
        url: `/user/profile`,
        method: "put",
        data
    });
}

/**
 * 修改密码
 * @param data 密码信息
 * @returns {Boolean} 修改结果
 */
export const updatePassword = (data) => {
    return request({
        url: `/user/password/update`,
        method: "put",
        data
    });
}

/**
 * 更新头像
 * @param data 头像数据
 * @returns {String} 头像地址
 */
export const updateAvatar = (data) => {
    return request({
        url: `/user/profile/avatar`,
        method: "put",
        data
    });
}