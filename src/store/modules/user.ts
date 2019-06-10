import {BlankList, BlankListQuery} from '../../model';
import {GetterTree, MutationTree, ActionTree} from 'vuex';
import Api from '@/api';
import {sha256} from 'js-sha256';
import {Base64} from 'js-base64';
import {UserAgent} from "@/model/user/user";

const state = {
	userAgent: {},
};

const getters = {
	userAgent(state: any) {
		if (!state.userAgent || Object.keys(state.userAgent).length == 0) {
			let userAgentStoreOnCookie = window.localStorage.getItem('userAgent');
			if (userAgentStoreOnCookie) {
				let userAgentJson = Base64.decode(userAgentStoreOnCookie).substr(64);
				// console.log(userAgentJson);
				try {
					state.userAgent = JSON.parse(userAgentJson);
				} catch (ex) {
					console.error("Json parse error: " + userAgentJson);
				}
			}
		}
		return state.userAgent;
	},
};

const mutations = {
	saveUserAgent(state: any, userAgent: UserAgent) {
		//加密
		let userAgentStoreOnCahe = Base64.encode(sha256.digest(userAgent.token + new Date().getTime() + '') + JSON.stringify(userAgent));
		//存储
		window.localStorage.setItem('userAgent', userAgentStoreOnCahe);
		state.userAgent = userAgent;
	},
};

const actions: ActionTree<BlankListQuery, any> = {
	userLogin({commit, state}, {account, pwd, validateCode}) {
		if (!account || !pwd) {
			console.warn('>>>>>>>>> login params is has null');
			return;
		}
		let random = new Date().getTime();
		
		let login = {
			random: random,
			account: account,
			validateCode: validateCode,
			sign: sha256.hex(account + random + sha256.hex(pwd)),
		};
		
		return Api.$post('/login', login).then((res: any) => {
			console.log(res);
			commit('saveUserAgent', res.data);
			return res;
		}).catch((e: any) => {
			return {success: false, msg: '登录失败！'};
		});
	},
	userLogout({commit}) {
		Api.$get('/logout').then((res: any) => {
			return res.data;
		});
	},
};

export default {
	state,
	actions,
	mutations,
};
