import request from "@/utils/request";

const requestSystemLog = (params) => {
    return request({
        url: "/log/system",
        method: "get",
        params
    })
}

const requestMediaTopType = () => {
    return request({
        url: "/config/media-type",
        method: "get",
    })
}

export {
    requestSystemLog,
    requestMediaTopType
}