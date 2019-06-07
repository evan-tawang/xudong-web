import Vue from 'vue';
import Vuex from 'vuex';
import BlackList from './modules/blanklist';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        BlackList,
    },
});
