import moment from 'moment';

const filters: any = {
	date(date: Date | number, format: string = 'YYYY-MM-DD') {
		return moment(date).format(format);
	},
	dateTime(date: Date | number, format: string = 'YYYY-MM-DD hh:mm') {
		return moment(date).format(format);
	}
};

export default (Vue: any) => {
	Object.keys(filters).forEach(key => {
		Vue.filter(key, filters[key])
	});
}