<template src="./GuestBookList.html"></template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Getter, Action} from 'vuex-class';
    import RouterName from '@/constant/router-name';

    import Api from '@/api';

    const API_URL_PREFIX = '/guestBook';
    const DEFAULT_QUERY = {pageNo: 1, pageSize: 10};

    @Component
    export default class GuestBookList extends Vue {
        private page: object = {recordCount: 0};
        private list: object = [];
        private query: any = DEFAULT_QUERY;
        private loading: any = {
            list: false,
        };
        private showDetailWin: boolean = false;

        public created() {
            this.getListData();
        }
        /**
         * 获取列表
         */
        private getListData() {
            this.loading.list = true;
            Api.$get(API_URL_PREFIX + '/list', this.query).then((res: any) => {
                // console.log(res.data);
                this.list = res.data;
                this.page = res.page;
                this.loading.list = false;
            });
        }
        /**
         * 查询
         */
        private searchData() {
            this.query.pageNo = DEFAULT_QUERY.pageNo;
            this.getListData();
        }
        /**
         * 清空
         */
        private resetQuery() {
            this.query = {pageNo: DEFAULT_QUERY.pageNo, pageSize: DEFAULT_QUERY.pageSize};
            this.getListData();
        }
        private pageSizeChange(val: number) {
            this.query.pageNo = DEFAULT_QUERY.pageNo;
            this.query.pageSize = val;
            this.getListData();

        }
        private currentPageChange(val: number) {
            this.query.pageNo = val;
            this.getListData();
        }
    }
</script>
