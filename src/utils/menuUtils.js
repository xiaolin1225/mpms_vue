import store from "@/store";

export const componentList = {
    LoginView: () => import("@/views/User/LoginView"),
    RegisterView: () => import("@/views/User/RegisterView"),
    BackLayout: () => import("@/Layout/BackLayout"),
    BaseLayout: () => import("@/Layout/BaseLayout"),
    HomeView: () => import("@/views/Home/HomeView"),
    ContentList: () => import("@/views/Content/ContentList"),
    ContentEditor: () => import("@/views/Content/ContentEditor"),
    ContentPreview: () => import("@/views/Content/ContentPreview"),
    ContentCheck: () => import("@/views/Content/ContentCheck"),
    ContentCheckView: () => import("@/views/Content/ContentCheck/ContentCheckView"),
    ContentPost: () => import("@/views/Content/ContentPost"),
    MediaList: () => import("@/views/Media/MediaList"),
    UserProfile: () => import("@/views/User/UserProfile"),
    UserList: () => import("@/views/User/UserList"),
    RoleList: () => import("@/views/User/RoleList"),
    DeptList: () => import("@/views/User/DeptList"),
    PostList: () => import("@/views/User/PostList"),
    LoginLog: () => import("@/views/Log/LoginLog"),
    SystemLog: () => import("@/views/Log/SystemLog"),
    PlatformList: () => import("@/views/Config/PlatformList"),
    ChatView: () => import("@/views/Chat/ChatView"),
    PageNotFound: () => import("@/views/Error/PageNotFound.vue"),
    NoPermission: () => import("@/views/Error/NoPermission.vue")
}

// let userPermission = store.getters["user/getUserPermissions"];
// console.log(store)
// export const getTreeList = (list, pid) => {
//     const treeList = [];
//     list.forEach(item => {
//         if (item.pid === pid)
//             treeList.push(item);
//     })
//     treeList.forEach(item => item.children = getTreeChildren(list, item.id))
//     return treeList;
// }

export const getTreeList = (list, pid) => {
    let treeList = []
    list.forEach(item => {
        if (item.pid === pid) {
            item.children = getTreeList(list, item.id);
            treeList.push(item);
        }
    })
    return treeList;
}

export const getRouterList = (list, path) => {
    // let userPermission = store.getters["user/getUserPermissions"];
    for (let index in list) {
        let item = list[index];
        item.path = path ? path + "/" + item.path : item.path;
        item.meta = {
            id: item.id,
            title: item.title,
            icon: item.icon,
            isShowHeader: item.isShowHeader,
            permission: item.permission,
        }
        item.component = componentList[item.component];
        if (item.children && item.children.length > 0) {
            getRouterList(item.children, item.path);
        }
    }
    return list;
}

export const getMainMenu = (list) => {
    let userPermission = store.getters["user/getUserPermissions"];
    let result = []
    for (let index in list) {
        let item = list[index];
        if (item.isNav && userPermission.includes(item.permission)) {
            result.push({
                id: item.id,
                path: item.path,
                icon: item.meta.icon,
                title: item.meta.title
            });
        }
    }
    return result;
}

export const getSubmenus = (list, pid) => {
    let parent = list.find(item => item.id === pid);
    // console.log("parent", parent, "children", parent.children);
    if (parent && parent.children && parent.children.length > 0) {
        return getHasPermissionChildren(parent.children);
    }
    return [];
}

const getHasPermissionChildren = (list) => {
    let userPermission = store.getters["user/getUserPermissions"];
    let result = [];
    for (let index in list) {
        let item = list[index];
        if (item.isNav && userPermission.includes(item.permission)) {
            if (item.children && item.children.length > 0) {
                item.children = getHasPermissionChildren(item.children);
            }
            result.push(item);
        }
    }
    return result;
}