import {ActionTree, mapMutations} from 'vuex';
import Api from '@/api';
import {sha256} from 'js-sha256';
import {Base64} from 'js-base64';
import md5 from 'js-md5';
import {UserAgent} from '@/model/user/user';
import Types from '@/store/types';

const state = {
	userAgent: {},
};

const getters = {
	userAgent(state: any) {
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
	changStaffOnlineStatus(commit: any, newOnline: any) {
		const userAgent = getters.userAgent(state);
		userAgent.onlineStatus = newOnline.value;
		userAgent.onlineStatusText = newOnline.text;;
		mutations.saveUserAgent(state, userAgent);
	},
	cleanUserAgent(state: any) {
		window.localStorage.removeItem('userAgent');
		state.userAgent = {};
	},
};

const actions: ActionTree<any, any> = {
	[Types.USER.LOGIN]({commit}, {account, pwd, validateCode}: any) {
		
		//console.log(md5.hex("111111111"))
		
		if (!account || !pwd) {
			console.warn('>>>>>>>>> login params is has null');
			return;
		}
		const random = new Date().getTime();
		const login = {
			account,
			pwd:md5.hex(pwd),
			validateCode,
			//sign: sha256.hex(account + random + sha256.hex(pwd)),
			//random,
		};
		return Api.$post('/staff/login', login).then((res: any) => {
			if (res.success) {
				commit('saveUserAgent', res.data);
			}
			return res;
		}).catch((e: any) => {
			console.error(e);
			return {success: false, msg: '登录失败！'};
		});
	},
	[Types.USER.LOGOUT]({commit}) {
		Api.$post('/staff/logout').then((res: any) => {
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
