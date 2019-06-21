<template src="./StaffChat.html">
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import Api from "@/api";
    import {Getter} from "vuex-class";
    import UserTypeEnum from "@/constant/enums/UserTypeEnum";
    import {ChatContentTypeEnum} from "@/constant/enums/ChatContentTypeEnum";

    const SockJS = require("sockjs-client");
    const Stomp = require("stompjs");

    @Component
    export default class StaffChat extends Vue {
        private staff: any = {};
        private showSearchModel: boolean = false;
        private searchedList: object[] = [];

        private sessionList: any[] = [];
        private talkSkillList: string[] = [];
        private chatExpressionChoose: boolean = false;
        private imagePreviewVisible: boolean = false;
        private imagePreview: string = '';
        private current = {
            id: "",
            visitorId: "",
            visitorName: "",
            staffName: "",
            messages: [{}]
        };

        private stompClient: any = {};
        @Getter private userAgent: any;

        private created() {
            // TODO: 兼容tslint
            this.current.messages = [];

            this.initWebSocket();
            // this.loadStaff();
            this.loadConnected();
            this.loadTalkSkillList();
        }

        // init
        private initWebSocket() {
            const socket = new SockJS("/" + "ws");
            this.stompClient = Stomp.over(socket);

            const that = this;
            const stompClient = that.stompClient;
            stompClient.connect({}, () => {
                stompClient.subscribe(`/chat/${that.userAgent.id}/allocate`, (resp: any) => {
                    const chatSession = JSON.parse(resp.body);
					chatSession.messages = [];

					that.subscribeReceiveMsg(chatSession, JSON.parse(JSON.stringify(that.sessionList)));
					that.messageHistory(chatSession);

                    that.sessionList.push(chatSession);
                });
            });


        }

        private subscribeReceiveMsg(chatSession: any,currentSessionList:any[]) {

			if (currentSessionList && currentSessionList.length > 0) {
				for (let session of currentSessionList) {
					if (session.id === chatSession.id) {
						return;
					}
				}
            }

			const that = this;
			setTimeout(function () {
				that.stompClient.subscribe(`/chat/${chatSession.id}-${UserTypeEnum.VISITOR}/receiveMsg`, (resp: any) => {
					const message = JSON.parse(resp.body);
					that.sessionList.forEach((o: any) => {
						if (o.visitorId === message.visitorId) {
							console.log(1111111111)
							o.messages = o.messages ? o.messages : [];
							o.messages.push(message);
							that.$forceUpdate()
						}
					});
					that.scrollToBottom();
				})
			},5000)
        }

        // private loadStaff() {
        // }

        private loadTalkSkillList() {
            Api.$get("/talkSkill/service/list").then((res: any) => {
                res.data.forEach((o: any) => {
                    if (o && o.content) {
                        this.talkSkillList.push(o.content);
                    }
                });
            });
        }

        private loadConnected() {
            Api.$get("/chat/connected").then((res: any) => {
                if (!res.data || res.data.length === 0) {
                    return;
                }

                this.sessionList = res.data;
                res.data.forEach((o: any) => {
					this.subscribeReceiveMsg(o, []);
                    this.messageHistory(o);
                });
            });
        }

        private messageHistory(chatSession: any) {
            Api.$get("/chat/history", {sessionId: chatSession.id}).then((res: any) => {
                this.sessionList.forEach((o: any) => {
                    if (o.id == chatSession.id) {
                        o.messages = res.data;
                    }
                });
            });
        }

        private changeSession(visitor: any) {
            this.current = visitor;
            this.scrollToBottom();
        }

        private chooseTalkSkill(talkSkill: string) {
            const dom = this.$refs.chatInputArea as HTMLElement;
            dom.innerHTML = dom.innerHTML + talkSkill;
        }

        private disconnect() {
            Api.$post("/chat/disconnect", {
                sessionId: this.current.id,
            }).then((res: any) => {
                for (let i in this.sessionList) {
                    this.sessionList.splice(parseInt(i), 1);
                }
            });
        }

        private sendMsg() {
            const dom = this.$refs.chatInputArea as HTMLElement;
            if (!dom.innerHTML) {
                return;
            }
            const content = dom.innerHTML;
			const that = this;
            Api.$post("/chat/sendMsg", {
                content: content,
                sessionId: this.current.id,
                receiveId: this.current.visitorId
            }).then((res: any) => {
                dom.innerHTML = "";
                that.current.messages.push(res.data);
                this.$forceUpdate();
                this.scrollToBottom();
            });
        }

        private chatExpressionToggle() {
            this.chatExpressionChoose = !this.chatExpressionChoose;
        }

        private scrollToBottom() {
            // 滚动到最下
            this.$nextTick(() => {
                const dom = this.$refs.chatHistory as HTMLDivElement;
				dom.scrollTop = dom.scrollHeight;
                // dom.scrollTo(0, dom.offsetHeight);
            });
        }

        private chooseFile() {
            let dom = this.$refs.imageFile as HTMLElement;
            dom.click();
        }

        private changeFile(event: any) {
            if (event.srcElement.files.length == 0) {
                return;
            }

            let that = this;
            const reader = new FileReader();

            reader.onload = function(event) {
                Api.$post("/chat/sendMsg", {
                    content: reader.result,
                    sessionId: that.current.id,
                    receiveId: that.current.visitorId,
                    contentType: ChatContentTypeEnum.FILE
                }).then((res: any) => {
					that.$nextTick(() => {
						that.current.messages.push(res.data);
					});

                    that.scrollToBottom();
                });
            };
            reader.readAsDataURL(event.srcElement.files[0]);
        }

        private showSearch() {
            this.showSearchModel = true;
        }

        private zoomImage(content: string) {
            this.imagePreviewVisible = true;
            this.imagePreview = content;
        }
    }
</script>
<style lang="scss" scoped>
    @import 'StaffChat';
</style>
