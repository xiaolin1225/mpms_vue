import request from "@/utils/request";

export const requestCaptcha = (params) => {
    return request({
        url: '/captcha',
        method: 'get',
        params
    });
}