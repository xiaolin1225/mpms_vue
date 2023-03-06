import axios from "axios";
import store from "@/store";
import {Message} from "element-ui";

const request = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 5000,
});

request.interceptors.request.use(config => {
    const token = store.getters["user/getToken"];
    if (token) {
        config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

request.interceptors.response.use(response => {
    let res = response.data;
    if (res.code !== 200) {
        Message.error(res.message || "网络请求失败");
        return Promise.reject(new Error(res.message || "网络请求失败"));
    }
    return res;
}, error => {
    if (error.response.status !== 500)
        Message.error(error.message || "网络请求失败");
    return Promise.reject(error);
});

export default request;