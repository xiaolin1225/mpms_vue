import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView'
import BackLayout from "@/Layout/BackLayout";
import ContentList from "@/views/Content/ContentList";
import baseLayout from "@/Layout/BaseLayout";
import MediaList from "@/views/Media/MediaList/index.vue";
import UserList from "@/views/User/UserList/index.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: "/back",
    },
    {
        path: "/back",
        name: "back",
        component: BackLayout,
        redirect: "/back/home",
        children: [
            {
                path: "home",
                name: "home",
                component: HomeView,
                meta: {
                    title: "首页"
                }
            },
            {
                path: "content",
                component: baseLayout,
                children: [
                    {
                        path: "",
                        name: "contentList",
                        component: ContentList,
                        meta: {
                            title: "内容管理",
                            path: [
                                {
                                    link: "/back/home",
                                    title: "首页"
                                },
                                {
                                    link: "/back/content",
                                    title: "内容管理"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                path: "media",
                component: baseLayout,
                children: [
                    {
                        path: "",
                        name: "mediaList",
                        component: MediaList,
                        meta: {
                            title: "媒体库",
                            path: [
                                {
                                    link: "/back/home",
                                    title: "首页"
                                },
                                {
                                    link: "/back/media",
                                    title: "媒体库"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                path: "user",
                component: baseLayout,
                children: [
                    {
                        path: "",
                        name: "userList",
                        component: UserList,
                        meta: {
                            title: "用户管理",
                            path: [
                                {
                                    link: "/back/home",
                                    title: "首页"
                                },
                                {
                                    link: "/back/user",
                                    title: "用户管理"
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return {selector: to.hash, behavior: 'smooth',}
        }
        return { x: 0, y: 0 }
    },
})

export default router
