import request from "@/utils/request";

export const requestMenuList = () => {
    return request({
        url: `/menu`,
        method: "get"
    })
}