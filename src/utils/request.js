import axios from "axios";
import store from "@/store";
import {Message} from "element-ui";
import router from "@/router";

const request = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 5000,
});

request.interceptors.request.use(config => {
    const token = store.getters["user/getToken"];
    if (token) {
        config.headers["Authorization"] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

request.interceptors.response.use(response => {
    let res = response.data;
    if (res.code === 200) {
        return res;
    } else if (res.code === 4001 || res.code === 4002) {
        Message.error(res.message || "未登录，请先登录");
        store.commit("user/clearUserInfo");
        router.push("/login");
    } else {
        Message.error(res.message || "网络请求失败");
        console.log("aaa")
        return Promise.reject(new Error(res.message || "网络请求失败"));
    }
}, error => {
    if (!error.response) {
        return Promise.reject(error)
    }
    if (error.response.status === 500) {
        Message.error("服务器异常");
    } else {
        Message.error(error.response.statusText || "网络请求失败");
    }
    return Promise.reject(error);
});

export default request;