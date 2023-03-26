import request from "@/utils/request";

export const saveContent = (id, data) => {
    return request({
        url: `/content/save/${id}`,
        method: "post",
        data,
    })
}

export const getContent = (id) => {
    return request({
        url: `/content/${id}`,
        method: "get",
    })
}