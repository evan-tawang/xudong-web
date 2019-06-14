<template src="./BlackList.html"></template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Getter, Action} from "vuex-class";
    import RouterName from "@/constant/router-name";
    import BlacklistEnum from "@/constant/enums/BlacklistEnum";

    import Api from "@/api";

    const API_URL_PREFIX = "/blackList/manage";
    const DEFAULT_QUERY = {pageNo: 1, pageSize: 10};

    @Component
    export default class BlackList extends Vue {
        private page: number = 0;
        private list: object = [];
        private query: any = DEFAULT_QUERY;
        private loading: any = {
            list: false,
            stopUsing: false,
            startUsing: false,
            remove: false,
            add: false,
            modifyWin: false,
            modify: false
        };
        private selectedDatas: any = [];
        private showAddWin: boolean = false;
        private showModifyWin: boolean = false;
        private addModel: any = {contentsAdd:''};
        private modifyModel: any = {content:''};

        private rules: object = {
            contentsAdd: [
                {required: true, message: "请输入黑名单内容", trigger: "change"}
            ],
            content: [
                {required: true, message: "请输入黑名单内容", trigger: "change"}
            ]
        };

        public created() {
            this.getListData();
        }

        /**
         * 查询
         */
        private getListData() {
            this.loading.list = true;
            Api.$get(API_URL_PREFIX + "/list", this.query).then((res: any) => {
                //console.log(res.data);
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
            this.loading.add = false;
            this.showAddWin = true;
        }

        private closeAddWin(){
            //console.log( this.$refs['addForm']);
            //this.$refs['addForm'].resetFields();
            this.showAddWin = false;
        }

        private submitAdd() {
            let _this = this;

            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    this.loading.add = true;
                    Api.$post(API_URL_PREFIX + "/addGroup", {
                        "blackLists": this.addModel.contentsAdd
                    }).then((res: any) => {
                        this.addModel.contentsAdd = '';
                        this.$message({
                            type: "success",
                            message: "添加成功!",
                            duration: 1500,
                            onClose: function() {
                                _this.loading.add = false;
                                _this.getListData();
                                _this.showAddWin = false;
                            }
                        });
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }

        private openModifyWin(id: number) {
            this.loading.modifyWin = true;
            this.loading.modify = false;
            Api.$get(API_URL_PREFIX + "/getOne", {id: id}).then((res: any) => {
                if (res.data) {
                    this.modifyModel = res.data;
                }
                this.loading.modifyWin = false;
            });
            this.showModifyWin = true;
        }

        private closeMofifyWin(){
            //console.log( this.$refs['modifyForm']);
            this.$refs['modifyForm'].resetFields();
            this.showModifyWin = false;
        }

        private submitModify() {
            this.$refs["modifyForm"].validate((valid) => {
                if (valid) {
                    let _this = this;
                    this.loading.modify = true;
                    Api.$post(API_URL_PREFIX + "/update", {
                        id: this.modifyModel.id,
                        content: this.modifyModel.content
                    }).then((res: any) => {
                        this.$message({
                            type: "success",
                            message: "修改成功!",
                            duration: 1500,
                            onClose: function() {
                                _this.loading.modify = false;
                                _this.getListData();
                                _this.showModifyWin = false;
                            }
                        });
                    });
                }
            });
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
                let _this = this;
                this.$confirm("确定 [" + operateText + "] 所选黑名单?", {
                    // confirmButtonText: '确定',
                    // cancelButtonText: '取消',
                    type: "info",
                    showClose: false
                }).then(() => {
                    let ids: string = "";
                    //let count = this.selectedDatas.length;
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
            this.updateStatus("启用", BlacklistEnum.Status.NORMAL.value);
        }

        private stopUsing() {
            this.updateStatus("停用", BlacklistEnum.Status.STOP.value);
        }

        private remove(id: number) {
            this.$confirm("确定 [删除] 该黑名单?", {
                // confirmButtonText: '确定',
                // cancelButtonText: '取消',
                type: "warning",
                showClose: false
            }).then(() => {
                let _this = this;
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
