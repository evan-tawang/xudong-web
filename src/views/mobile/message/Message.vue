<template>
    <div class="message" >
        <div class="message_header">留言</div>
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
    import {Component, Vue} from 'vue-property-decorator';
    @Component
    export default class Message extends Vue {
        private textarea: string = '';

        private sendMessage() {
            // TODO 发送留言
            if (this.textarea) {
                console.log('send message');
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../../assets/element-variables.scss';
    .message {
        .message_header {
            text-align: center;
            height: 48px;
            line-height: 48px;
            font-size: 20px;
            border-bottom: 1px solid #ddd;
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
