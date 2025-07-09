import {getCurrentUser} from "@/api/user";

const state = () => ({
    userInfo: {}
});

const mutations = {
    SET_CURRENT_USER(state, userInfo) {
        state.userInfo = userInfo;
    }
};

const actions = {
    setCurrentUser({commit}) {
        getCurrentUser().then(res => commit('SET_CURRENT_USER', res));
    }
};

export default {
    namespaced:true,
    state,
    mutations,
    actions
};