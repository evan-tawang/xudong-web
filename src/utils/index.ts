import moment from 'moment';
export default class Utils {
    public static dateFormat(date: Date|number, format: string) {
        return moment(date).format(format);
    }
	public static match(reg: string, path: string) {
		const regExp = new RegExp(reg);
		return regExp.test(path);
    }
}
