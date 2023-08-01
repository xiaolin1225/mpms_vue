import request from "@/utils/request";

const getMessageList = (params) => {
    return request({
        url: "/chat/message",
        method: "get",
        params
    })
}

export {
    getMessageList
}