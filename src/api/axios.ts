import Vue from 'vue';
import router from '../router';
import axios from 'axios';

axios.defaults.headers = {
    // 'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/x-www-form-urlencoded',
};
axios.defaults.timeout = 20000;

axios.interceptors.request.use((config: any) => {
    return config;
}, (error: any) => {
    return Promise.reject(error);
});

// 请求到结果的拦截处理
axios.interceptors.response.use((config: any) => {
    return config.data;
}, (error: any) => {
    return Promise.reject(error);
});

export default axios;
