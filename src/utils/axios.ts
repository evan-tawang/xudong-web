import Vue from 'vue';
import router from '../router';
import axios from 'axios';
import Base from './base'; // 导入全局环境变量
let base = new Base();

axios.defaults.headers = {
    // 'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/x-www-form-urlencoded',
};
axios.defaults.baseURL = base.url();
axios.defaults.timeout = 20000;

axios.interceptors.request.use((config: any) => {
    return config;
}, (error: any) => {
    return Promise.reject(error);
});

// 请求到结果的拦截处理
axios.interceptors.response.use( (config: any) => {
    return config.data;
}, (error: any) => {
    return Promise.reject(error);
});

Vue.prototype.$post = (url: any, data: any, params: any) => {
    return new Promise((resolve, reject) => {
        axios.post(url, {data, params}).then((res: any) => {
            resolve(res);
        }).catch((err: any) => {
            reject(err);
        });
    });
};

Vue.prototype.$get =  (url: any, params: any) => {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: params }).then((res: any) => {
            resolve(res);
        }).catch((err: any) => {
            reject(err);
        });
    });
};