import axios from './axios';
import {Loading, Message, MessageBox} from 'element-ui';

// const loading = new Map();

class Api {
    /**
     * post
     * @param url url
     * @param params 参数
     * @param ownCatch 是否自己处理catch
     */
    public $post(url: string, params: any = {}, isOwnCatch: boolean = false) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            for (const k in params) {
                if (params.hasOwnProperty(k)) {
                    data.append(k, params[k]);
                }
            }
            axios.post(url, data).then((res: any) => {
                // axios.post(url, null, {params}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                if (isOwnCatch) {
                    reject(err);
                } else {
                    MessageBox.alert(err.msg, {title: '温馨提示', type: 'warning'});
                }
            });
        });
    }
    /**
     * get
     * @param url url
     * @param params 参数
     * @param ownCatch 是否自己处理catch
     */
    public $get(url: string, params: any = {}, isOwnCatch: boolean = false): any {
        return new Promise((resolve, reject) => {
            axios.get(url, {params}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                if (isOwnCatch) {
                    reject(err);
                } else {
                    Message.error({message: err.msg, type: 'error'});
                }
            });
        });
    }
}
const api = new Api();
export default api;
