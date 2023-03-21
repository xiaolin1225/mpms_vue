import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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

const routes = [];

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

export default router
