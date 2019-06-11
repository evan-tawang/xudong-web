import moment from 'moment';
import Vue from 'vue';

const filters: any = {
	dateFormat(date: Date | number, format: string) {
		return moment(date).format(format);
	}
};

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
});

export default filters;