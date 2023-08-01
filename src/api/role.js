import request from "@/utils/request";

export const requestRoleList = (params) => {
    return request({
        url: "/role/list/page",
        method: "get",
        params
    })
}

export const requestRoleInfo = (id) => {
    return request({
        url: `/role/${id}`,
        method: "get",
    })
}

export const saveRoleInfo = (data) => {
    return request({
        url: `/role`,
        method: "post",
        data
    })
}

export const updateRoleInfo = (data) => {
    return request({
        url: `/role`,
        method: "put",
        data
    })
}

export const deleteRole = (id) => {
    return request({
        url: `/role/${id}`,
        method: "delete",
    })
}

export const deleteRoles = (data) => {
    return request({
        url: `/role`,
        method: "delete",
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}