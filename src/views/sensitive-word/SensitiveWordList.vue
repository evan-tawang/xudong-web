<template>
    <div class="panel_main detail__wrapper">
        <el-form>
            <div class="msg msg--above">以下敏感词会在聊天中屏蔽，多个敏感词以“,”分割</div>
            <el-input v-model="words" type="textarea" :rows="20">
            </el-input>
        </el-form>
        <div class="buttons__wrapper">
            <el-button type="primary" @click="submitSave" v-loading="loading">保存</el-button>
        </div>
    </div>
</template>
<script lang="ts">

    import {Component, Vue} from "vue-property-decorator";
    import {Getter, Action} from "vuex-class";
    import RouterName from "@/constant/router-name";
    import Api from "@/api";

    const API_URL_PREFIX = "/sensitiveWord/manage";

    @Component
    export default class SensitiveWordList extends Vue {
        private words: string = "";
        private loading: boolean = false;

        public created() {
            Api.$get(API_URL_PREFIX + "/get").then((res: any) => {
                this.words = res.data;
            });
        }

        private submitSave() {
            // let _this = this;
            Api.$post(API_URL_PREFIX + "/save", {words: this.words}).then((res: any) => {
                this.$message({
                    type: "success",
                    message: "保存成功!",
                    duration: 1000,
                });
            });
        }
    }

</script>
