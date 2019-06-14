import axios from './axios';
import {Loading, Message, MessageBox} from "element-ui";
class Api {
    
    /**
     * post
     * @param url url
     * @param params 参数
     * @param ownCatch 是否自己处理catch
     */
    public $post(url: string, params: any = {}, isOwnCatch: boolean) {
        return new Promise((resolve, reject) => {
            
            let data = new FormData();
            
            for (let k in params) {
                data.append(k, params[k]);
            }
            
            axios.post(url, data).then((res: any) => {
                //axios.post(url, null, {params}).then((res: any) => {
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
    public $get(url: string, params: any = {}, isOwnCatch: boolean): any {
        return new Promise((resolve, reject) => {
            axios.get(url, {params}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                if (isOwnCatch) {
                    reject(err);
                } else {
                    Loading.service({ fullscreen: true });
                    Message.error({message: err.msg, type: 'error'});
                }
            });
        });
    }
}
const api = new Api();
export default api;
