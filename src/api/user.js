import request from "@/utils/request";

export const isUserExist = (data) => {
    return request({
        url: "/user/exist",
        method: "post",
        data
    })
}

export const isCodeCorrect = (type, data) => {
    return request({
        url: `/${type}/code/validation`,
        method: "post",
        data
    })
}

export const login = (data) => {
    return request({
        url: "/login",
        method: "post",
        data
    })
}

/*获取用户列表*/
export const requestUserList = (params) => {
    return request({
        url: "/user/list",
        method: "get",
        params
    });
}

/*获取用户信息*/
export const requestUserInfo = (id) => {
    return request({
        url: `/user/${id}`,
        method: "get"
    });
}

/*添加用户*/
export const addUser = (data) => {
    return request({
        url: "/user",
        method: "post",
        data
    });
}

/*修改用户信息*/
export const updateUser = (id, data) => {
    return request({
        url: `/user/${id}`,
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
export const resetUserPassword = (id, data) => {
    return request({
        url: `/user/${id}/password/reset`,
        method: "put",
        data
    });
}