import Vue from 'vue';
import router from '../router';
import store from '../store';
import axios from 'axios';
import RouterName from "@/constant/router-name";
import {sha256} from "js-sha256";

axios.defaults.headers = {
    // 'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/x-www-form-urlencoded',
};
axios.defaults.timeout = 20000;

axios.interceptors.request.use((config: any) => {
    const userAgent = store.getters.userAgent;
    if(!userAgent || Object.keys(userAgent).length == 0){
        return config;
    }
    
    let random = new Date().getTime();
    let sign = sha256.hex(config.params + random + '' + userAgent.secret);
    
    config.headers.token = userAgent.token;
    config.headers.sign = sign;
    config.headers.random = random;
    
    return config;
}, (error: any) => {
    return Promise.reject(error);
});

// 请求到结果的拦截处理
axios.interceptors.response.use((config: any) => {
    if(config.data.code === 'NO_LOGIN'){
        router.push({name:RouterName.USER.LOGIN});
    }
    return config.data;
}, (error: any) => {
    return Promise.reject(error);
});

export default axios;
