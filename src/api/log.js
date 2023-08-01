import request from "@/utils/request";

/**
 * 获取用户登录日志
 * @returns {Array} 用户登录日志
 */
export const getUserLoginLog = (params) => {
    return request({
        url: "/log/login",
        method: "get",
        params
    })
}