import request from "@/utils/request";

export const submitCheck = (data) => {
    return request({
        url: `/content/check/submit`,
        method: "post",
        data,
    })
}

export const getCheckList = (params) => {
    return request({
        url: `/content/check/list/page`,
        method: "get",
        params,
    })
}

export const getCheckInfo = (id) => {
    return request({
        url: `/content/check/${id}`,
        method: "get",
    })
}

export const submitCheckResult = (data) => {
    return request({
        url: `/content/check/result`,
        method: "post",
        data
    })
}