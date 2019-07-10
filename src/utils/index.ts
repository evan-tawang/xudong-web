import moment from 'moment';
export default class Utils {
    public static dateFormat(date: Date|number, format: string) {
        return moment(date).format(format);
    }
	public static match(reg: string, path: string) {
		const regExp = new RegExp(reg);
		return regExp.test(path);
    }
    public static parseIdentity(identity: string) {
        if (!identity) {
            return {};
        }
        const arr = Base64.decode(identity).split(',');
        // CustomerId,CustomerName,CustomerTel
        return {
            id: arr[0],
            userName: arr[1],
            mobile: arr[2],
            account: arr[2]
        }
    }
    public static isLocal(){
        return window.Location.hostname == 'localhost' || window.Location.hostname == '127.0.0.1';
    }
}
