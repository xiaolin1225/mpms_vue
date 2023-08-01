import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";
import {componentList} from "@/utils/menuUtils";

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
// const routes = [
//     {
//         path: '/',
//         redirect: "/back/media",
//     },
//     {
//         path: "/back",
//         name: "back",
//         component: BackLayout,
//         redirect: "/back/home",
//         children: [
//             {
//                 path: "home",
//                 name: "home",
//                 component: HomeView,
//                 meta: {
//                     title: "首页"
//                 }
//             },
//             {
//                 path: "content",
//                 component: BaseLayout,
//                 children: [
//                     {
//                         path: "",
//                         name: "contentList",
//                         component: ContentList,
//                         meta: {
//                             title: "内容管理",
//                             path: [
//                                 {
//                                     link: "/back/home",
//                                     title: "首页"
//                                 },
//                                 {
//                                     link: "/back/content",
//                                     title: "内容管理"
//                                 }
//                             ]
//                         }
//                     },
//                     {
//                         path: "edit",
//                         name: "contentEditor",
//                         component: ContentEditor,
//                         props: route => ({
//                             id: route.query.id
//                         }),
//                         meta: {
//                             title: "内容管理",
//                             path: [
//                                 {
//                                     link: "/back/home",
//                                     title: "首页"
//                                 },
//                                 {
//                                     link: "/back/content",
//                                     title: "内容管理"
//                                 },
//                                 {
//                                     link: "/back/content/edit",
//                                     title: "编辑内容"
//                                 }
//                             ]
//                         }
//                     }
//                 ]
//             },
//             {
//                 path: "media",
//                 component: BaseLayout,
//                 children: [
//                     {
//                         path: "",
//                         name: "mediaList",
//                         component: MediaList,
//                         props: route => ({path: route.query.path}),
//                         meta: {
//                             title: "媒体库",
//                             path: [
//                                 {
//                                     link: "/back/home",
//                                     title: "首页"
//                                 },
//                                 {
//                                     link: "/back/media",
//                                     title: "媒体库"
//                                 }
//                             ]
//                         }
//                     }
//                 ]
//             },
//             {
//                 path: "user",
//                 component: BaseLayout,
//                 children: [
//                     {
//                         path: "",
//                         name: "userList",
//                         component: UserList,
//                         meta: {
//                             title: "用户管理",
//                             path: [
//                                 {
//                                     link: "/back/home",
//                                     title: "首页"
//                                 },
//                                 {
//                                     link: "/back/user",
//                                     title: "用户管理"
//                                 }
//                             ]
//                         }
//                     }
//                 ]
//             }
//         ]
//     }
// ]

const routes = [
    {
        path: "/",
        component: componentList.BackLayout,
        children: [{
            path: "",
            name: "home",
            component: componentList.HomeView,
            meta: {
                title: "首页",
                icon: "el-icon-s-home",
                isShowHeader: true,
                permission: "none"
            }
        },
            {
                path: 'profile',
                component: componentList.UserProfile,
                hidden: true,
                meta: {
                    title: "个人中心",
                    permission: "none"
                }
            },],
        meta: {
            title: "后台"
        }
    },
    {
        path: "/login",
        name: "login",
        component: componentList.LoginView,
        meta: {
            title: "登录"
        }
    },
    {
        path: "/register",
        name: "register",
        component: componentList.RegisterView,
        meta: {
            title: "注册"
        }
    },
    {
        path: '/404',
        component: componentList.PageNotFound,
        hidden: true,
        meta: {
            title: "404",
            permission: "none"
        }
    },
    {
        path: '/403',
        component: componentList.NoPermission,
        hidden: true,
        meta: {
            title: "403",
            permission: "none"
        }
    },

];

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return {selector: to.hash, behavior: 'smooth',}
        }
        return {x: 0, y: 0}
    },
})

const whiteList = ["/login", "/register", "/404", "/403"];
router.beforeEach(async (to, from, next) => {
    // console.log("start======>", "to", to, "from", from, "router", router.getRoutes(), "time", new Date().toISOString());
    document.title = to.meta.title ? to.meta.title + " - " + store.state.system.webTitle : store.state.system.webTitle;
    const token = store.getters["user/getToken"];

    if (token && token !== "") {
        if (to.path === "/login") {
            next({path: "/"});
        } else {
            const menus = store.getters["menu/menus"];
            if (menus.length === 0) {
                await store.dispatch("user/getUserInfo");
                await store.dispatch("menu/getMenus").then((menu) => {
                    menu.forEach(r => {
                        router.addRoute(r);
                    });
                    router.addRoute({
                        path: "*",
                        redirect: "/404",
                    });
                    // console.log("getRouter======>", "to", to, "from", from, "router", router.getRoutes(), "time", new Date().toISOString());
                    // 请求带有 redirect 重定向时，登录自动重定向到该地址
                    const redirect = decodeURIComponent(from.query.redirect || to.path);
                    if (to.path === redirect) {
                        next({...to, replace: true});
                    } else {
                        // 跳转到目的路由
                        next({path: redirect});
                    }
                })
            }
            // 判断用户是否有权限访问该页面
            const permission = store.getters["user/getUserPermissions"];
            const pagePermission = to.meta.permission;
            // console.log("to", to, "pagePermission", pagePermission, "permission", permission)
            if (pagePermission) {
                if (permission.includes(pagePermission) || pagePermission === "none") {
                    next();
                } else {
                    next("/403");
                }
            } else {
                next({...to, replace: true});
            }
            // console.log("other======>", "to", to, "from", from, "router", router.getRoutes(), "time", new Date().toISOString());
            // next();
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免授权白名单，直接进入
            next();
        } else {
            next(`/login?redirect=${to.fullPath}`);// 否则全部重定向到登录页
        }
    }

});

export default router
