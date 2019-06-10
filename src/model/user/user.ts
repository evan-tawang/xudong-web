// 员工登录
export interface StaffLoginDTO {
	account: string;
}

// 用户信息
export interface UserAgent {
	id: string;
	account: string;
	mobile: string;
	userName: string;
	userType: number;// 用户类型 1 访客 2 客服
	remoteAddr: string;
	status: number;
	
	token: string;
	tokenSecret: string;
}
