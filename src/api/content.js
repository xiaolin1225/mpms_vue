import request from "@/utils/request";

export const saveContent = (data) => {
    return request({
        url: `/content/save`,
        method: "post",
        data,
    })
}

export const getContentListData = (id) => {
    return request({
        url: `/content/list/${id}`,
        method: "get",
    })
}


export const getContentList = (params) => {
    return request({
        url: `/content/list`,
        method: "get",
        params
    })
}

export const removeContentList = (id) => {
    return request({
        url: `/content/list/${id}`,
        method: "delete",
    })
}

export const getContentData = (id) => {
    return request({
        url: `/content/${id}`,
        method: "get",
    })
}