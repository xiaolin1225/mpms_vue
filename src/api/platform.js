import request from "@/utils/request";

export const getPlatformListPage = (params) => {
    return request({
        url: `/platform/list/page`,
        method: "get",
        params
    })
}

export const getPlatformSelectList = (params) => {
    return request({
        url: `/platform/list/select`,
        method: "get",
        params
    })
}

export const getPlatform = (id) => {
    return request({
        url: `/platform/${id}`,
        method: "get",
    })
}

export const savePlatform = (data) => {
    return request({
        url: `/platform`,
        method: "post",
        data
    })
}


export const updatePlatformInfo = (data) => {
    return request({
        url: `/platform`,
        method: "put",
        data
    })
}

export const deletePlatform = (id) => {
    return request({
        url: `/platform/${id}`,
        method: "delete",
    })
}