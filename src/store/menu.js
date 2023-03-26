import {requestMenuList} from "@/api/menus";
import {getMenuByPid, getSubmenus, setRouterList} from "@/utils/menuUtils";

export default {
    namespaced: true,
    state: {
        menus: null,
        mainMenus: null,
        subMenus: null,
        activeMenu: null
    },
    getters: {
        menus(state) {
            return state.menus
        },
        mainMenus(state) {
            return state.mainMenus;
        },
        subMenus(state) {
            return state.subMenus;
        }
    },
    mutations: {
        setMenus(state, data) {
            state.menus = data
        },
        setMainMenu(state, data) {
            state.mainMenus = data;
        },
        setSubMenu(state, data) {
            state.subMenus = data;
        }
    },
    actions: {
        getMenus({commit}) {
            requestMenuList().then(res => {
                let menus = res.data;
                setRouterList(menus);
                commit("setMainMenu", getMenuByPid(menus));
                commit("setMenus", menus);
            })
        },
        setSubmenus({commit, state}, pid) {
            commit("setSubMenu", getSubmenus(state.menus, pid));
        }
    },
}