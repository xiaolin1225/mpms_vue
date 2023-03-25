import router from "@/router";

const componentList = {
    LoginView: () => import("@/views/User/LoginView"),
    BackLayout: () => import("@/Layout/BackLayout"),
    BaseLayout: () => import("@/Layout/BaseLayout"),
    HomeView: () => import("@/views/HomeView"),
    ContentList: () => import("@/views/Content/ContentList"),
    MediaList: () => import("@/views/Media/MediaList"),
    UserList: () => import("@/views/User/UserList"),
    ContentEditor: () => import("@/views/Content/ContentEditor"),
    FileSelect: () => import("@/components/FileSelect")
}

export const setRouterList = (list) => {
    const routerList = getRouterList(list);
    routerList.forEach(route => {
        router.addRoute(route);
    })
}

export const getRouterList = (list) => {
    const treeList = [];
    list.forEach(item => {
        item.meta = {
            title: item.title,
            icon: item.icon,
        }
        item.component = componentList[item.component];
        if (item.pid === 0)
            treeList.push(item);
    })
    treeList.forEach(item => item.children = getTreeChildren(list, item.id))
    return treeList;
}

export const getTreeChildren = (list, pid) => {
    let treeList = []
    list.forEach(item => {
        if (item.pid === pid) {
            item.children = getTreeChildren(list, item.id);
            treeList.push(item);
        }
    })
    return treeList;
}

export const getMenuByPid = (list, pid = 2) => {
    const result = [];
    list.forEach(item => {
        if (item.pid === pid)
            result.push(item);
    });
    return result;
}