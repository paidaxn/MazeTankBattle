import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState({ storage: window.sessionStorage })],
    state: {
        userName: '', // 管理员姓名
    },
    mutations: {
        SET_STATE(state, target) {
            state[target.key] = target.val;
        }
    },
    actions: {}
});
