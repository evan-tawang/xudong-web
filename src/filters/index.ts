import moment from 'moment';
import Vue from 'vue';

const filters: any = {
	date(date: Date | number, format: string = 'yyyy-MM-dd') {
		return moment(date).format(format);
	}
};

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
});

export default filters;