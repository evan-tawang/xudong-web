import {BlankList, BlankListQuery} from '../../model';
import {GetterTree, MutationTree, ActionTree} from 'vuex';
import Api from '@/api';

const url = '/test/';

const state = {
    list: [],
    data: {},
};

const actions: ActionTree<BlankListQuery, any> = {
    async pageList({commit}, query) {
        Api.$get(url + 'hello', query).then((res: any) => {
            console.log(res);
            return res.data;
        });
    },
};

export default {
    state,
    actions,
};
