<template src="./BlankList.html"></template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Getter, Action} from "vuex-class";
    import RouterName from "@/constant/router-name";
    import {BlankListQuery} from "@/model";

    import Api from "@/api";

    const API_URL_PREFIX = "/blackList/manage";
    const DEFAULT_QUERY = {pageNo: 1, pageSize: 10};

    @Component
    export default class BlankList extends Vue {
        private page: any = {};
        private list: object = {};
        private query: any = DEFAULT_QUERY;

        @Action("blankList") private blankList: any;

        public created() {
            this.getListData();
        }

        /**
         * 查询
         */
        private getListData() {
            Api.$get(API_URL_PREFIX + "/list", this.query).then((res: any) => {
                //console.log(res.data);
                this.list = res.data;
            });
        }

        /**
         * 查询
         */
        private searchData() {
            this.getListData();
        }

        /**
         * 清空
         */
        private resetQuery() {
            this.query = DEFAULT_QUERY;
            this.getListData();
        }

        private pageSizeChange(val: number) {
            this.query.pageSize = val;
            this.getListData();

        }

        private currentPageChange(val: number) {
            this.query.pageNo = val;
            this.getListData();
        }

        private openAddWin() {

        }

        private openModifyWin(id: number) {

        }

        private startUsing() {

        }

        private stopUsing() {

        }

        private remove(id: number) {

        }


    }
</script>
