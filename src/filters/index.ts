import moment from 'moment';

const filters: any = {
	date(date: Date | number, format: string = 'YYYY-MM-DD') {
		return moment(date).format(format);
	},
	dateTime(date: Date | number, format: string = 'YYYY-MM-DD HH:mm') {
		return moment(date).format(format);
	},
	onlineStatusColor(userAgent: any, onlineStatusList: any) {
		const onlineStatus = userAgent.onlineStatus;
		const current = onlineStatusList.find((o: any) => {
			return o.onlineStatus === onlineStatus;
		});
		return current ? current.color : '';
	},
};

export default (Vue: any) => {
	Object.keys(filters).forEach((key) => {
		Vue.filter(key, filters[key]);
	});
};
