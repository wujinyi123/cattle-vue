import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    modules: {
        user
    }
});
