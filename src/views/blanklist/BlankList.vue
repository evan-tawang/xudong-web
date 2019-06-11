<template src="./BlankList.html"></template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Getter, Action} from "vuex-class";
    import RouterName from "@/constant/router-name";
    import {BlankListQuery} from "@/model";
    import BlanklistEnum from "@/constant/BlanklistEnum";

    import Api from "@/api";

    const API_URL_PREFIX = "/blackList/manage";
    const DEFAULT_QUERY = {pageNo: 1, pageSize: 10};

    @Component
    export default class BlankList extends Vue {
        private page: number = 0;
        private list: object = [];
        private query: any = DEFAULT_QUERY;
        private loading: any = {list: false, stopUsing: false, startUsing: false, remove: false};
        private selectedDatas: any = [];

        @Action("blankList") private blankList: any;

        public created() {
            this.getListData();
        }

        /**
         * 查询
         */
        private getListData() {
            this.loading.list = true;
            Api.$get(API_URL_PREFIX + "/list", this.query).then((res: any) => {
                console.log(res.data);
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

        private openAddWin() {

        }

        private openModifyWin(id: number) {

        }

        private selectListRow(val: any) {
            this.selectedDatas = val;
        }

        private updateStatus(operateText: string, newStatus: number) {
            if (this.selectedDatas.length == 0) {
                this.$alert("请选择需要 [" + operateText + "] 的黑名单！", {
                    type: "warning",
                    showClose: false
                });
            } else {
                var _this = this;
                this.$confirm("确定 [" + operateText + "] 所选黑名单?", {
                    // confirmButtonText: '确定',
                    // cancelButtonText: '取消',
                    type: "info",
                    showClose: false
                }).then(() => {
                    var ids: string = "";
                    //var count = this.selectedDatas.length;
                    this.selectedDatas.forEach(function(e: any) {
                        //ids.push(e.id);
                        ids += "," + e.id;
                    });
                    ids = ids.substr(1);
                    //console.log(ids);
                    Api.$post(API_URL_PREFIX + "/updateStatusGroup", {
                        "ids": ids,
                        "newStatus": newStatus
                    }).then((res: any) => {
                        this.$message({
                            type: "success",
                            message: "操作成功!",
                            duration: 1000,
                            onClose: function() {
                                _this.getListData();
                            }
                        });
                    });
                });
            }
        }

        private startUsing() {
            this.updateStatus("启用", BlanklistEnum.Status.NORMAL.value);
        }

        private stopUsing() {
            this.updateStatus("停用", BlanklistEnum.Status.STOP.value);
        }

        private remove(id: number) {
            this.$confirm("确定 [删除] 该黑名单?", {
                // confirmButtonText: '确定',
                // cancelButtonText: '取消',
                type: "warning",
                showClose: false
            }).then(() => {
                var _this = this;
                Api.$post(API_URL_PREFIX + "/delete", {id: id}).then((res: any) => {
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                        duration: 1000,
                        onClose: function() {
                            _this.getListData();
                        }
                    });
                });
            });
        }
    }
</script>
