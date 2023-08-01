import {login, logout, requestUserInfo, updateAvatar, updatePassword, updateProfile} from "@/api/user";
import router from "@/router";
import {getUserLoginLog} from "@/api/log";
import {getToken, setToken} from "@/utils/auth";

export default {
    namespaced: true,
    state: {
        userinfo: null,
        token: getToken(),
        loginLog: []
    },
    getters: {
        getUserInfo(state) {
            if (state.userinfo) {
                return state.userinfo;
            }
            return {}
        },
        getUserRoles(state) {
            return state.userinfo?.roles;
        },
        getUserPermissions(state) {
            return state.userinfo?.permissions;
        },
        getToken(state) {
            return state.token;
        }
    },
    mutations: {
        setUserInfo(state, data) {
            state.userinfo = data;
        },
        setLoginLog(state, data) {
            state.loginLog = data;
        },
        updateProfile(state, data) {
            Object.assign(state.userinfo, data);
        },
        updateAvatar(state, data) {
            data = /data:image\/.*;base64/.test(data) ? data : process.env.VUE_APP_API_URL + data;
            state.userinfo.avatar = data;
        },
        setToken(state, data) {
            state.token = data;
        },
        clearUserInfo(state) {
            state.userinfo = null;
            state.token = "";
        }
    },
    actions: {
        async login({commit, dispatch}, data) {
            const res = await login(data);
            if (res.code === 200) {
                commit("setToken", res.data);
                setToken(res.data);
                dispatch("getUserInfo");
                return Promise.resolve(res);
            } else {
                return Promise.reject(res);
            }
        },
        getUserInfo({commit}) {
            return new Promise((resolve) => {
                requestUserInfo().then(res => {
                    let {data} = res;
                    data.avatar = /data:image\/.*;base64/.test(data.avatar) ? data.avatar : process.env.VUE_APP_API_URL + data.avatar;
                    commit("setUserInfo", data);
                    resolve();
                })
            })
        },
        getLoginLog({commit, state}, data) {
            return new Promise(resolve => {
                getUserLoginLog(data).then(res => {
                    commit("setLoginLog", res.data);
                    resolve(res);
                });
            });
        },
        updateProfile({commit}, data) {
            return new Promise((resolve) => {
                updateProfile(data).then(() => {
                    commit("updateProfile", data);
                    resolve();
                })
            });
        },
        updateAvatar({commit}, data) {
            return new Promise((resolve) => {
                updateAvatar(data).then(() => {
                    commit("updateAvatar", data.avatar);
                    resolve();
                });
            });
        },
        updatePassword({dispatch}, data) {
            return new Promise((resolve) => {
                updatePassword(data).then(res => {
                    dispatch("logout");
                    resolve();
                })
            });
        },
        async logout({commit}) {
            await logout();
            commit("clearUserInfo");
            await router.push({path: "/login"});
        }
    },
}