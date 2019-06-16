// 黑名单
export interface BlackList {
    id: number;
    gmtCreate: Date;
    gmtModify: Date;
    status: number; // 状态(1 正常 2 停用)
    content: string; // 屏蔽内容(ip,账号)
}

export interface BlackListQuery {
    status: number; // 状态(1 正常 2 停用)
}
