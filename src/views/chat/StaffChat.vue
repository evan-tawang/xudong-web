<template>
    <div class="chat">
        <div class="chat-top">

        </div>

        <div class="chat-main">
            <div class="chat-main-left">
                <div>

                </div>
            </div>
            <div class="chat-main-center">
                <div class="chat_history">
                    <template v-for="message in current.messages">
                        <div v-if="message.sendUserType == 2">
                            <div style="background:#dbba7e">
                                <span>{{ message.content }}</span>
                            </div>
                        </div>
                        <div v-else>
                            <div style="background:#f4eee1">
                                <span>{{ message.content }}</span>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="chat-edit">
                    <div class="chat-edit-choose">
                        <img src="/images/smile.png" alt="">
                        <img src="/images/image.png" alt="">
                    </div>
                    <textarea v-model="msg"></textarea>
                    <div style=" text-align:right">
                        <el-button type="warning" size="small" style=" line-height: 0.5;padding: 9px 10px;margin-right: 10px;margin-bottom: 5px;" @click="sendMsg" >发送</el-button>
                    </div>
                </div>
            </div>
            <div class="chat-main-right">
                right
            </div>
        </div>
    </div>
</template>
<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import Api from '@/api';
	import {Getter} from "vuex-class";
	import UserTypeEnum from "@/constant/enums/UserTypeEnum";
	const SockJS = require("sockjs-client");
	const Stomp = require("stompjs");

	@Component
	export default class StaffChat extends Vue {
		private staff: object = {};
		private visitorList = [];
		private current = {messages: []};
		private stompClient: any = {};
		private msg: string = '';

		@Getter private userAgent: any;

		private created() {
			console.log(UserTypeEnum.STAFF)

			this.initWebSocket();
			this.loadStaff();
        }

        // init
		private initWebSocket() {
			let socket = new SockJS('/' + 'ws');
			this.stompClient = Stomp.over(socket);

			let that = this;
			let stompClient = that.stompClient;
			stompClient.connect({}, () => {
				stompClient.subscribe('/chat/' + that.userAgent.id + '/allocate', function (resp: any) {
					console.log(resp)
					let chatSession = JSON.parse(resp.body);
					that.subscribeReceiveMsg(chatSession);
					that.visitorList.push(chatSession);
				});
			});
		}

		private subscribeReceiveMsg(chatSession) {
			let that = this;
			this.stompClient.subscribe('/chat/' + chatSession.visitorId + '/receiveMsg', function (resp: any) {
				let message = JSON.parse(resp.body);
				message.sendUserType = UserTypeEnum.STAFF;
				that.current.messages.push(message);
				console.log(that.current);
				that.visitorList.forEach(o => {
					let messages = o.messages || [];
					messages.push(message);
				});
			});
        }

		private loadStaff() {

		}

		private openExpression(){

        }

		private sendMsg() {
			Api.$post('/chat/sendMsg', {content: this.msg, receiveId: "2222"}).then((res: any) => {
				res.data.sendUserType = 2;
				this.current.messages.push(res.data);
				console.log(this.current)
				this.msg = '';
			})
		}
	}
</script>
<style lang="scss" scoped>
.chat {
    /*#E65B24*/
    height: 80%;
    width: 85%;
    grid-template-rows: 10% 90%;
    box-shadow: 0px 4px 10px #AAAAAA;
    display: inline-grid;

    .chat-top {
        background: #C1A062;
    }

    .chat-main {
        display: inline-grid;
        grid-template-columns: 15% 70% 15%;

        div{
        }

        > div {
            height: 100%;
            display: inline-block;
        }

        .chat-main-left {
            background: #F8F8F8;
        }

        .chat-main-center {
            border-right: 2px solid rgb(222,214,204);
            display: inline-grid;
            grid-template-rows: 70% 30%;

            .chat_history {
            }

            .chat-edit {
                border-top: 2px solid rgb(227,221,212);
                display: inline-grid;
                grid-template-rows: 25px calc(100% - 40px - 25px) 40px;

                img {
                    height: 23px;
                }

                .chat-edit-choose {
                    height: 25px;
                }

                textarea{
                    margin-bottom: 5px;
                    border: 0px;
                    outline:none;
                    resize: none;
                    overflow-x: hidden;
                    overflow-y: hidden
                }

                .button {
                    /*line-height: 0.5;*/
                    /*padding: 9px 10px;*/
                    /*margin-left: 94%;*/
                    /*margin-bottom: 5px;*/
                }
            }
        }

        .chat-main-right {
        }
    }
}
</style>