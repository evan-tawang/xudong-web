import moment from 'moment';
export default class Utils {
    public static dateFormat(date: Date|number, format: string) {
        return moment(date).format(format);
    }
}
