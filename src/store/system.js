import store from "@/store";
import {requestMediaTopType, requestSystemLog} from "@/api/system";

export default {
    namespaced: true,
    state: {
        brand: require("@/assets/logo.png"),
        webTitle: process.env.VUE_APP_WEB_TITLE || "高校融媒体平台管理系统",
        isSubmenuOpen: false,
        isLoading: true,
        systemLog: [],
        mediaTopType: []
    },
    getters: {
        systemLog(state) {
            return state.systemLog;
        },
        webTitle(state) {
            return state.webTitle ? state.webTitle : "高校融媒体平台管理系统";
        }
    },
    mutations: {
        toggleSubMenu(state, status) {
            if (store.getters["menu/subMenuSize"] > 1) {
                if (status && typeof (status) === "boolean") {
                    state.isSubmenuOpen = state;
                } else {
                    state.isSubmenuOpen = !state.isSubmenuOpen;
                }
            } else {
                state.isSubmenuOpen = false;
            }
            document.body.classList.toggle("submenu-open", state.isSubmenuOpen);
        },
        setSystemLog(state, data) {
            state.systemLog = data;
        },
        setMediaTopType(state, data) {
            state.mediaTopType = data
        },
    },
    actions: {
        getSystemLog({commit}, params) {
            return new Promise(resolve => {
                requestSystemLog(params).then(res => {
                    commit("setSystemLog", res.data);
                    resolve(res);
                });
            });
        },
        async getSystemConfig({commit}) {
            let {data} = await requestMediaTopType();
            commit("setMediaTopType", data);
        },
        async getTypeName({state, dispatch}, name) {
            if (!state.mediaTopType || state.mediaTopType.length === 0) {
                dispatch("getSystemConfig")
            }
            let item = state.mediaTopType.find(item => item.name = name);
            return item ? item.title : " - ";
        }
    },
}