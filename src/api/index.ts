import axios from './axios';

class Api {

    public $post(url: string, data: any, params: any) {
        return new Promise((resolve, reject) => {
            axios.post(url, {data, params}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public $get(url: string, params: any): any {
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
