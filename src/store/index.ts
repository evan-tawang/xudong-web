import Vue from 'vue';
import Vuex from 'vuex';
import BlackList from './modules/blanklist';
import User from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        BlackList,
        User,
    },
});
