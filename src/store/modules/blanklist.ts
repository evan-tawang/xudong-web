import {BlackList, BlackListQuery} from '../../model';
import {GetterTree, MutationTree, ActionTree} from 'vuex';
import Api from '@/api';

const url = '/blackList/manage/';

const state = {
    list: [],
    data: {},
};

const actions: ActionTree<BlackListQuery, any> = {
    async blackListPageList({commit}, query) {
        Api.$get(url + 'list', query).then((res: any) => {
            console.log(res);
            return res.data;
        });
    },
};

export default {
    state,
    actions,
};
