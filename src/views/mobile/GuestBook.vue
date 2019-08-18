<template>
    <div class="message" >
        <div class="message_header">留言</div>
            <el-input v-model="visitor.userName" placeholder="请输入姓名" maxlength="20"></el-input>
            <el-input v-model="visitor.mobile" placeholder="请输入联系方式" maxlength="15"></el-input>

            <el-input
                class="textarea"
                type="textarea"
                :rows="10"
                placeholder="请在此输入留言内容。"
                v-model="textarea">
            </el-input>
        <div class="operate">
            <el-button class="send_btn" type="primary" @click="sendMessage">发送</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import Api from '../../api';
    import {Component, Vue} from 'vue-property-decorator';
    import Utils from "@/utils";

    @Component
    export default class GuestBook extends Vue {
        private textarea: string = '';
		private visitor: any = {};

        private created() {
            this.visitor = Utils.parseIdentity(this.$route.params.identity)
        }

        private sendMessage() {
            if (!this.textarea) {
                return;
            }

            const data = {
                visitorId: this.visitor && this.visitor.id ? this.visitor.id : '',
                visitorName: this.visitor && this.visitor.userName ? this.visitor.userName : '',
                visitorPhone: this.visitor && this.visitor.mobile ? this.visitor.mobile : '',
                content: this.textarea
            };
            Api.$post('guestBook/save', data).then(res => {
                this.textarea = '';
                this.$message({
                    message: '留言已收到，请等待反馈',
                    type: 'success'
                });
            })

        }
    }
</script>
<style lang="scss" scoped>
    @import '../../assets/element-variables';
    .message {
        .message_header {
            text-align: center;
            height: 48px;
            line-height: 48px;
            font-size: 20px;
            border-bottom: 1px solid #ddd;
        }
        .el-input{
            padding: 10px;
        }
        .textarea {
            padding: 10px;
        }
        .operate {
            text-align: right;
            padding: 10px;
            .send_btn {
                padding: 8px 20px;
                border-radius: 2px;
            }
        }
    }
</style>

