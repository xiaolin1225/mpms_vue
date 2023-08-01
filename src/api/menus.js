import request from "@/utils/request";

export const requestMenuList = (params) => {
    return request({
        url: `/menu`,
        method: "get",
        params
    })
}

export const requestRoleEditList = (params) => {
    return request({
        url: `/menu/role`,
        method: "get",
        params
    })
}