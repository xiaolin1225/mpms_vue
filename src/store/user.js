export default {
    namespaced: true,
    state: {
        userinfo:null,
        token:""
    },
    getters: {
        getUserInfo(state){
            return state.userinfo
        },
        getToken(state){
            return state.token;
        }
    },
    mutations: {
    },
    actions: {
    },
}