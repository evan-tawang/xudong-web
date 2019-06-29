<template>
    <div class="chat">
        <div class="chat_header">在线客服</div>
        <div class="chat_history" :class="{'expand': expand}" ref="chatHistory">
            <template v-for="(msg, index) in msgs">
                <div :key="msg.id">
                    <div class="splice_line" v-if="handleSpliceLine(msg, msgs, index)">
                        <span>{{msg.spliceTime}}</span>
                    </div>
                    <div v-if="msg.sendUserType === 1"  class="chat_history_area custom">
                        <div class="chat_msg">
                            <div class="title">{{msg.name}} {{msg.timeStr}}</div>
                            <div class="msg">
                                <template v-if="msg.contentType == 2">
                                    <img :src="msg.content">
                                </template>
                                <template v-else>
                                    {{msg.content }}
                                </template>
                            </div>
                        </div>
                        <img class="avatar" :src="msg.avatar" alt="头像">
                    </div>
                    <div v-if="msg.sendUserType === 2" class="chat_history_area service">
                        <img class="avatar" :src="msg.avatar" alt="头像">
                        <div class="chat_msg">
                            <div class="title">{{msg.name}} {{msg.timeStr}}</div>
                            <div class="msg">
                                <template v-if="msg.contentType == 2">
                                    <img :src="msg.content">
                                </template>
                                <template v-else>
                                    {{msg.content}}
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="chat_bottom">
            <div class="chat_input">
                <div class="expression_choose">
                    <img @click="openExpression" src="/images/smile.png" alt="">
                </div>
                <div class="file_choose">
                    <img src="/images/image.png" alt="">
                    <input class="file" type="file" accept=".png,.jpg,.jpeg" style="opacity: 0;" @change="changeFile">
                </div>
                <el-input v-model="input" size="small" @focus="expand=false" @blur="handleBlur" @keyup.enter.native="sendMsg"></el-input>
            </div>
            <div class="expression_area" v-show="expand">

            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
	import Api from '@/api';
	import Utils from "@/utils";
	import UserEnum from '@/constant/enums/UserEnum';
	import {ChatContentTypeEnum} from '@/constant/enums/ChatContentTypeEnum';
	const SockJS = require('sockjs-client');
	const Stomp = require('stompjs');

    @Component
    export default class Chat extends Vue {
        private input: string = ''; // 输入框数值
        private expand: boolean = false; // 是否展开表情
        private msgs: object[] = []; // 消息数据
		private stompClient: any = {};
		private chatSession: any = {};
		private user: any = {};

        public created() { // 初始化数据
            this.init();
        }
		// init
        private init() {
			this.createChatSession();
			this.parseIdentity();
        }

		private parseIdentity() {
			const user = this.$route.params.identity;
			if (!user) {
				return;
            }
			const arr = Base64.encode(user).split(',');
			// CustomerId,CustomerName,CustomerTel
			this.user = {
				id: arr[0],
				userName: arr[1],
				mobile: arr[2],
				account: arr[2]
			}
        }

		private initWebSocket() {
			const socket = new SockJS('/' + 'ws');
			this.stompClient = Stomp.over(socket);
			const that = this;
			const stompClient = that.stompClient;
			stompClient.connect({}, () => {
				this.stompClient.subscribe(`/chat/${that.chatSession.id}-${UserEnum.Type.STAFF}/receiveMsg`, (resp: any) => {
					const message = JSON.parse(resp.body);
					that.msgs.push(message);
					that.scrollToBottom();
				});
			});
		}

        private handleData(arr: object[]) { // 处理原始数据
            arr.forEach((item: any) => {
                item.timeStr = Utils.dateFormat(item.gmtCreate, 'HH:mm:ss');
                if (!item.avatar) {
                    item.avatar = item.sendUserType === 2 ? '/images/logo.jpg' :'/images/custom.png';
                }
            });
        }
        private chooseFile(ev: any) { // 选择文件发送
            console.log(ev);
            // 文件上传并反馈
        }
        private openExpression() { // 打开表情选择
            this.expand = !this.expand;
        }
        private handleBlur() {
            window.scroll(0, 0);
        }

		// 创建聊天会话
		private createChatSession() {
        	const that = this;
			Api.$post('/chat/createSession').then((res: any) => {
                if(!res.data){
                	return;
                }
				that.chatSession = res.data;
				that.initWebSocket();
				that.messageHistory();
			});
		}

		// 发送信息 ==> 清空信息，并且增加一条custom信息
        private sendMsg() {
			if (!this.chatSession.id || !this.input) {
				return;
			}
			const that = this;
			Api.$post('/chat/sendMsg', { content : this.input, sessionId: this.chatSession.id}).then((res: any) => {
				that.msgs.push(res.data);
			});
            this.input = '';
            this.scrollToBottom();
        }

		private messageHistory() {
			if (!this.chatSession.id) {
				return;
			}
			Api.$get('/chat/history', {sessionId: this.chatSession.id}).then((res: any) => {
                this.msgs = res.data;
                this.handleData(this.msgs);
				this.scrollToBottom();
			});
		}

		private changeFile(event: any) {
			if (!this.chatSession.id) {
				return;
			}
			if (event.srcElement.files.length === 0) {
				return;
			}
			const that = this;
			const reader = new FileReader();
			reader.onload = (event) => {
				Api.$post('/chat/sendMsg', {
					content: reader.result,
					sessionId: that.chatSession.id,
					contentType: ChatContentTypeEnum.FILE,
				}).then((res: any) => {

					that.msgs.push(res.data);
					that.scrollToBottom();
				});
			};
			reader.readAsDataURL(event.srcElement.files[0]);
		}

        private scrollToBottom() {
            // 滚动到最下
            this.$nextTick(() => {
                const dom = this.$refs.chatHistory as HTMLDivElement;
                dom.scrollTop = (dom.scrollHeight + 100);
                // dom.scrollTo(0, dom.offsetHeight);
            });
        }
        private handleSpliceLine(msg: any, msgs: any[], index: number) {
            if (index === 0 || msg.gmtCreate - msgs[index - 1].gmtCreate > 5*60*1000) { // 大于5min或者第一条信息
                this.$set(msg, 'spliceTime', Utils.dateFormat(msg.gmtCreate, 'HH:mm:ss'));
                return Utils.dateFormat(msg.gmtCreate, 'HH:mm:ss');
            } else {
                return ''
            }
        }
    }
</script>
<style lang="scss" scoped>
    .chat {
        .chat_header {
            text-align: center;
            height: 48px;
            line-height: 48px;
            font-size: 20px;
            border-bottom: 1px solid #ddd;
        }
        .chat_history {
            height: calc(100vh - 50px);
            width: 100vw;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            padding: 10px 10px 54px;
            color: #aaa;
            &.expand {
                padding-bottom: 154px;
            }
            .avatar{
                width: 48px;
                height: 48px;
                border-radius: 24px;
            }
            .splice_line {
                position: relative;
                height: 40px;
                line-height: 40px;
                text-align: center;
                span {
                    position: relative;
                    background: #fff;
                    z-index: 2;
                    padding: 6px;
                }
                &::after {
                    content: '';
                    display: block;
                    width: 100px;
                    height: 1px;
                    background: #aaa;
                    position: absolute;
                    top: 20px;
                    left: calc(50% - 50px);
                }
            }
            .chat_history_area {
                position: relative;
                display: flex;
                margin-bottom: 20px;
                .chat_msg{
                    width: 70%;
                    .title{
                        margin-bottom: 5px;
                    }
                    .msg {
                        border-radius: 2px;
                        padding: 12px 16px;
                        word-break: break-all;
                        color: #000;
                        img {
                            width: 100%;
                            height: 100%;
                            padding: 10px;
                        }
                    }
                }
                &.custom {
                    justify-content: flex-end;
                    img {
                        margin-left: 10px;
                    }
                    .chat_msg{
                        width: 70%;
                        .title{
                            text-align: right;
                        }
                        .msg{
                            background: #dbba7e;
                            color: #fff;
                        }
                    }
                }
                &.service {
                    img {
                        margin-right: 10px;
                    }
                    .chat_msg{
                        .msg{
                            background: #f4eee1;
                        }
                    }
                }
            }
        }
        .chat_bottom {
            position: fixed;
            bottom: 0;
            width: 100%;
            min-height: 54px;
            border-top: 1px solid #ddd;
            background: #fff;
            padding: 5px;
            .chat_input {
                display: flex;
                align-items: center;
                .expression_choose {
                    display: flex;
                    align-items: center;
                }
                .file_choose {
                    display: flex;
                    align-items: center;
                    position: relative;
                    .file {
                        position: absolute;
                        height: 100%;
                        width: 100%;
                    }
                }
                img {
                    width: 30px;
                    height: 30px;;
                    margin-right: 5px;
                }
            }
            .expression_area {
                width: 100%;
                height: 100px;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
            }
        }
    }
</style>