import {ActionTree} from 'vuex';
import Api from '@/api';
import {sha256} from 'js-sha256';
import {Base64} from 'js-base64';
import {UserAgent} from '@/model/user/user';

const state = {
	userAgent: {},
};

const getters = {
	userAgent(state: any) {
		console.log(11111111);
		if (!state.userAgent || Object.keys(state.userAgent).length === 0) {
			const userAgentStoreOnCookie = window.localStorage.getItem('userAgent');
			if (userAgentStoreOnCookie) {
				const userAgentJson = Base64.decode(userAgentStoreOnCookie).substr(64);
				try {
					console.log(userAgentJson);
					state.userAgent = JSON.parse(userAgentJson);
				} catch (ex) {
					console.error('Json parse error: ' + userAgentJson);
				}
			}
		}
		return state.userAgent;
	},
};

const mutations = {
	saveUserAgent(state: any, userAgent: UserAgent) {
		// 加密
		const userAgentStoreOnCahe =
		  Base64.encode(sha256.hex(userAgent.token + new Date().getTime() + '') + JSON.stringify(userAgent));
		// 存储
		window.localStorage.setItem('userAgent', userAgentStoreOnCahe);
		state.userAgent = userAgent;
	},
	cleanUserAgent(state: any) {
		window.localStorage.removeItem('userAgent');
		state.userAgent = {};
	},
};

const actions: ActionTree<any, any> = {
	userLogin({commit}, {account, pwd, validateCode}: any) {
		if (!account || !pwd) {
			console.warn('>>>>>>>>> login params is has null');
			return;
		}
		const random = new Date().getTime();
		const login = {
			random,
			account,
			validateCode,
			sign: sha256.hex(account + random + sha256.hex(pwd)),
		};
		return Api.$post('/login', login).then((res: any) => {
			if (res.success) {
				commit('saveUserAgent', res.data);
			}
			return res;
		}).catch((e: any) => {
			console.error(e);
			return {success: false, msg: '登录失败！'};
		});
	},
	userLogout({commit}) {
		Api.$post('/logout').then((res: any) => {
			commit('cleanUserAgent');
		}).catch((e: any) => {
			console.error(e);
			commit('cleanUserAgent');
		});
	},
};

export default {
	state,
	actions,
	mutations,
	getters,
};
