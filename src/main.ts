import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import axios from './api';
import filters from './filters';
import ElementUI from 'element-ui';
import '@/assets/im.scss';
import 'element-ui/lib/theme-chalk/index.css';
import RouterName from '@/constant/router-name';
import Utils from '@/utils';

Vue.config.productionTip = false;

Vue.use(ElementUI);

//前端验证token
router.beforeEach((to, from, next) => {
	const path = to.path;
	// if (path === '/') {
	// 	router.push({name:RouterName.USER.LOGIN});
	// 	return;
	// }
	if (!Utils.match('^/login', path)) {
		const userAgent = store.getters.userAgent;
		if (!userAgent || Object.keys(userAgent).length === 0) {
			router.push({name:RouterName.USER.LOGIN});
			return;
		}
	}
	next();
});

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
