import axios from './axios';
class Api {
    public $post(url: string, params: any = {}) {
        return new Promise((resolve, reject) => {

            let data = new FormData();

            for(let k in params){
                data.append(k,params[k]);
            }

            axios.post(url, data).then((res: any) => {
            //axios.post(url, null, {params}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    public $get(url: string, params: any = {}): any {
        return new Promise((resolve, reject) => {
            axios.get(url, {params}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}
const api = new Api();
export default api;
