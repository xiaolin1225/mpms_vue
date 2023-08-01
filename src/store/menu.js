import {getMainMenu, getRouterList, getSubmenus} from "@/utils/menuUtils";
import {requestMenuList} from "@/api/menus";
import store from "@/store";

export default {
    namespaced: true,
    state: {
        menus: [],
        mainMenus: [],
        subMenus: [],
        menuTreeList: []
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
        },
        menuTreeList(state) {
            return state.menuTreeList;
        },
        subMenuSize(state) {
            return state.subMenus.length;
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
        },
        setMenuTreeList(state, data) {
            state.menuTreeList = data;
        }
    },
    actions: {
        getMenus({commit}) {
            return new Promise(resolve => {
                requestMenuList().then(res => {
                    let menus = res.data;
                    let routers = getRouterList(menus);
                    commit("setMenus", routers);
                    // commit("setMenuTreeList", getRouterList(menus, 0));
                    commit("setMainMenu", getMainMenu(menus));
                    resolve(routers);
                })
            })
        },
        setSubmenus({commit, state}, pid) {
            commit("setSubMenu", getSubmenus(state.menus, pid));
            if (state.subMenus.length <= 1) {
                store.commit("system/toggleSubMenu");
            }
        }
    },
}