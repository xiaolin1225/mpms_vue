import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import user from "@/store/user";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  },
  /* vuex数据持久化配置 */
  plugins: [
    createPersistedState({
      // 存储方式：localStorage、sessionStorage、cookies
      storage: window.sessionStorage,
      // 存储的 key 的key值
      key: "store",
      // 只持久化存储user模块的状态
      paths: ['user']
    })
  ]

})
