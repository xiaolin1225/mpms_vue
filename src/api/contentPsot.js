import request from "@/utils/request";

export const getPostList = (params) => {
    return request({
        url: `/content/post/list/page`,
        method: "get",
        params,
    })
}

export const postContent = (data) => {
    return request({
        url: `/content/post`,
        method: "post",
        data,
    })
}