<template>
    <div class="chat">
        <div class="chat-top">

        </div>

        <div class="chat-main">
            <div class="chat-main-left">

                <template v-for="session in sessionList">
                    <div @click="changeSession(session)"
                         :style="current.visitorId == session.visitorId ? 'background: red':''">
                        <div>
    <!--                            <img src="">-->
                        </div>
                        <div>
                            <span>
                                {{ session.name ? session.name : '游客' + session.id }}
                            </span>
                            <span  v-if="session.messages">
<!--                                {{ session.messages }}-->
<!--                                 {{ session.messages[session.messages.length - 1].content }}-->
                            </span>
                        </div>
                    </div>
                </template>

            </div>
            <div class="chat-main-center">
                <div class="chat_history">
                    <template v-for="message in current.messages">
                        <div v-if="message.sendUserType == 1">
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

                        <el-tooltip placement="right-start">
                            <div slot="content">
                                <div v-for="talkSkill in talkSkillList" @click="chooseTalkSkill(talkSkill)">{{ talkSkill }}</div>
                            </div>
                            <!-- 需要用img or icon -->
                           <a href="javascript:void(0)" class="el-icon-chat-dot-round"> </a>
                        </el-tooltip>

                        <a href="javascript:void(0)" class="el-icon-close" @click="disconnect()"> </a>
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
		private sessionList: object[] = [];
		private talkSkillList: string[] = [];

		private current = {
			id: '',
			visitorId: '',
			messages: []
		};

		private stompClient: any = {};
		private msg: string = '';

		@Getter private userAgent: any;

		private created() {
			console.log(UserTypeEnum.STAFF)

			this.initWebSocket();
			this.loadStaff();
			this.loadConnected();
			this.loadTalkSkillList();
        }

        // init
		private initWebSocket() {
			let socket = new SockJS('/' + 'ws');
			this.stompClient = Stomp.over(socket);

			let that = this;
			let stompClient = that.stompClient;
			stompClient.connect({}, () => {
				stompClient.subscribe('/chat/' + that.userAgent.id + '/allocate', function (resp: any) {
					let chatSession = JSON.parse(resp.body);
					that.subscribeReceiveMsg(chatSession);
					chatSession.messages = [];
					that.sessionList.push(chatSession);
				});
			});
		}

		private subscribeReceiveMsg(chatSession: any) {
			for (let session of this.sessionList) {
                if(session.id == chatSession.id){
                	return;
                }
            }
			
			let that = this;
			this.stompClient.subscribe('/chat/' + chatSession.id + '-' + UserTypeEnum.VISITOR + '/receiveMsg', function (resp: any) {
				let message = JSON.parse(resp.body);
				// that.current.messages.push(message);
				console.log(that.current);
				that.sessionList.forEach((o: any) => {
					if(o.visitorId === message.visitorId){
						let messages = o.messages || [];
						messages.push(message);
                    }
				});
			});
        }

		private loadStaff() {

		}

		private loadTalkSkillList() {
			Api.$get('/talkSkill/service/list').then((res: any) => {

				res.data.forEach((o: object) => {
					this.talkSkillList.push(o.content);
                })
			})
		}

		private loadConnected() {
			Api.$get('/chat/connected').then((res: any) => {
				if(!res.data || res.data.length == 0){
					return;
				}

				this.sessionList = res.data;
				res.data.forEach((o: any) => {
					this.subscribeReceiveMsg(o);

					this.messageHistory(o);
				});
			})
		}

		private messageHistory(chatSession: any) {
			Api.$get('/chat/history', {sessionId: chatSession.id}).then((res: any) => {
				this.sessionList.forEach((o: any) => {
					o.messages = res.data;
				});
			})
		}

		private openExpression(){
        }

		private changeSession(visitor:any){
			// if (this.sessionList.length <= 1) {
			// 	return;
			// }
			this.current = visitor;
        }

		private chooseTalkSkill(talkSkill: string) {
            this.msg += talkSkill
        }

		private disconnect(){
			Api.$post('/chat/disconnect', {
				sessionId: this.current.id,
			}).then((res: any) => {
				this.sessionList.splice(this.current, 1);
			})
		}

		private sendMsg() {
			Api.$post('/chat/sendMsg', {
				content: this.msg,
				sessionId: this.current.id,
				receiveId: this.current.visitorId
			}).then((res: any) => {
				if (!this.current.messages) {
					this.current.messages = [];
                }
				this.current.messages.push(res.data);
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
