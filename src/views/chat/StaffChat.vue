<template src='./StaffChat.html'>
</template>
<script lang='ts'>
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Api from '@/api';
    import {Getter, Mutation} from 'vuex-class';
    import UserEnum from '@/constant/enums/UserEnum';
    import {ChatContentTypeEnum} from '@/constant/enums/ChatContentTypeEnum';
    import Utils from '@/utils';
	import constant from "@/constant/constant";

    const SockJS = require('sockjs-client');
    const Stomp = require('stompjs');

    const DEFAULT_QUERY = {pageNo: 1, pageSize: 50};

    @Component({})
    export default class StaffChat extends Vue {
        private staff: any = {};
        private showHistoryDialog: boolean = false;

        private sessionList: any[] = [];
        private talkSkillList: string[] = [];
        private chatExpressionChoose: boolean = false;
        private imagePreviewVisible: boolean = false;
        private imagePreview: string = '';
        private current = {
            id: '',
            visitorId: '',
            visitorName: '',
            staffName: '',
			otherSideName:'',
			nonReadCount: 0,
            messages: [{}]
        };

        private onlineStatusColor = '#1d953f';
        private onlineStatusList = [
            {text: '在线', value: UserEnum.OnlineStatus.ON_LINE, color: '#1d953f'},
            {text: '忙碌', value: UserEnum.OnlineStatus.BE_BUSY, color: '#f47920'},
            {text: '离线', value: UserEnum.OnlineStatus.OFF_LINE, color: 'red'},
        ];

        private hisPage: any = {recordCount: 0};
        private hisList: any = [];
        private hisQuery: any = DEFAULT_QUERY;
        private hisQueryDate: any = [] ;

        private hisQueryDatePickerOptions: object = {
            shortcuts: [{
                text: '最近一周',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        };

        private stompClient: any = {connected: false};
        @Getter private userAgent: any;
        @Mutation private changStaffOnlineStatus: any;


        private created() {

            // TODO: 兼容tslint
            this.current.messages = [];

            this.initWebSocket();
            // this.loadStaff();
            this.loadConnected();
            this.loadTalkSkillList();

            this.refreshOnlineStatusColor();
        }

        private destroy(): void {
            this.disconnectWebSocket();
        }

        // init
        private initWebSocket() {
			let ws = '/ws';
			if (!Utils.isLocal()) {
				ws = '/' + constant.server + '/ws';
            }
            const socket = new SockJS(ws);
            this.stompClient = Stomp.over(socket);

            const that = this;
            const stompClient = that.stompClient;
            stompClient.connect({}, () => {
                stompClient.subscribe(`/chat/${that.userAgent.id}/allocate`, (resp: any) => {
                    const chatSession = JSON.parse(resp.body);
					let current = that.sessionList.find((o: any) => {
						return o.id === chatSession.id;
					});


					if(current) return;

                    chatSession.messages = [];

                    that.subscribeReceiveMsg(chatSession);
                    that.messageHistory(chatSession);

                    that.sessionList.push(chatSession);
                });
            });
        }

        // discount
        private disconnectWebSocket() {
            if(!this.stompClient){
                return;
            }
            this.stompClient.disconnect();
        }

        @Watch('stompClient.connected')
        private webSocketConnected() {
            if (!this.stompClient.connected) {
                return;
            }
            console.log(this.stompClient.connected)
            this.sessionList.forEach((o: any) => {
                this.subscribeReceiveMsg(o);
            })
        }

        private subscribeReceiveMsg(chatSession: any) {

            const that = this;
            that.stompClient.subscribe(`/chat/${chatSession.id}-${UserEnum.Type.VISITOR}/receiveMsg`, (resp: any) => {
                const message = JSON.parse(resp.body);
                that.sessionList.forEach((o: any) => {
                    if (o.id === message.sessionId) {
                        o.messages = o.messages ? o.messages : [];
                        o.messages.push(message);

						if (o.otherSideName != message.visitorName) {
							o.otherSideName = message.visitorName;
						}

						if (o.id == that.current.id) {
							that.messageRead(o); //是当前则已读
							that.scrollToBottom();
						} else {
							o.nonReadCount = o.nonReadCount ? o.nonReadCount+1 : 1;
						}
                    }
                });
				that.$forceUpdate();
                that.scrollToBottom();
            });

			that.stompClient.subscribe(`/chat/${chatSession.id}/disconnect`, (resp: any) => {
				const body = JSON.parse(resp.body);
				that.sessionList.forEach((o: any) => {
					if (o.id === body.id) {
						let msg = {contentType: 10};
						o.messages.push(msg);
					}
				});
				that.$forceUpdate();
			});
        }

		private unSubscribeReceiveMsg(chatSession: any) {
			const that = this;
			that.stompClient.unsubscribe(`/chat/${chatSession.id}-${UserEnum.Type.VISITOR}/receiveMsg`, (resp: any) => {
			});

			that.stompClient.unsubscribe(`/chat/${chatSession.id}/disconnect`, (resp: any) => {
			});
		}

        // private loadStaff() {
        // }

        private loadTalkSkillList() {
            Api.$get('/talkSkill/service/list').then((res: any) => {
                res.data.forEach((o: any) => {
                    if (o && o.content) {
                        this.talkSkillList.push(o.content);
                    }
                });
            });
        }

        private loadConnected() {
            Api.$get('/chat/connected').then((res: any) => {
                if (!res.data || res.data.length === 0) {
                    return;
                }

                this.sessionList = res.data;
                res.data.forEach((o: any) => {
                    this.messageHistory(o);
                    this.messageNotReadCount(o);
                });
            });
        }

        /**
         * 历史消息
         */
        private messageHistory(chatSession: any) {
            Api.$get('/chat/history', {sessionId: chatSession.id}).then((res: any) => {
                chatSession.messages = res.data;
                this.$forceUpdate();
                this.scrollToBottom();
            });
        }

        /**
         * 未读取消息条数
         */
        private messageNotReadCount(chatSession: any) {
            Api.$get('/chat/queryNonReadCount', {sessionId: chatSession.id}).then((res: any) => {
                chatSession.nonReadCount = res.data;
            });
        }

        /**
         * 消息已读
         */
        private messageRead(chatSession: any) {
			if (!chatSession.nonReadCount) {
        		return
            }
            Api.$post('/chat/read', {sessionId: chatSession.id}).then((res: any) => {
				chatSession.nonReadCount = 0;
				this.$forceUpdate();
            });
        }

        private changeSession(chatSession: any) {
            this.current = chatSession;
			this.messageRead(chatSession);
            this.scrollToBottom();
        }

        private chooseTalkSkill(talkSkill: string) {
            const dom = this.$refs.chatInputArea as HTMLElement;
            dom.innerHTML = dom.innerHTML + talkSkill;
        }

        /**
         * 拉黑
         */
        private pullBlack() {
            this.$confirm('确定要将当前用户加入黑名单?', {
                // confirmButtonText: '确定',
                // cancelButtonText: '取消',
                type: 'info',
                showClose: false,
            }).then(() => {
                Api.$post('/chat/pullBlack', {
                    sessionId: this.current.id,
                }).then((res: any) => {
                    this.$message({message: '加入黑名单成功！', type: 'success'});
                });
            });
        }

        /**
         * 更改状态
         */
		private changeOnlineStatus(newOnline: any) {
            if (!newOnline) {
                return;
            }
            Api.$post('/staff/updateOnlineStatus', {
                newStatus: newOnline.value,
            }).then((res: any) => {
                this.changStaffOnlineStatus(newOnline);
                this.refreshOnlineStatusColor();
                // this.$message({message: '拉黑成功！', type: 'success'});
            });
        }

        /**
         * 断开连接
         *
         */
        private disconnect() {
			Api.$post('/chat/disconnect', {
                sessionId: this.current.id,
            }).then((res: any) => {
                for (let i in this.sessionList) {
                    if(this.sessionList[i].id === this.current.id){
                        this.sessionList.splice(parseInt(i), 1);
                    }
                }

				this.unSubscribeReceiveMsg(this.current);

                this.current = {
                    id: '',
                    visitorId: '',
                    visitorName: '',
                    staffName: '',
                    otherSideName:'',
                    nonReadCount: 0,
                    messages: []
                };
            });
        }

        private sendMsg() {
			if (!this.current.id) {
				return;
			}

            const dom = this.$refs.chatInputArea as HTMLElement;
            if (!dom.innerHTML) {
                return;
            }
            const content = dom.innerHTML;
            const that = this;
            Api.$post('/chat/sendMsg', {
                content: content,
                sessionId: this.current.id,
                receiveId: this.current.visitorId
            }).then((res: any) => {
                dom.innerHTML = '';

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
                if(dom){
					dom.scrollTop = dom.scrollHeight;
                }
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

            reader.onload = function (event) {
                Api.$post('/chat/sendMsg', {
                    content: reader.result,
                    sessionId: that.current.id,
                    receiveId: that.current.visitorId,
                    contentType: ChatContentTypeEnum.FILE
                }).then((res: any) => {
                    that.current.messages.push(res.data);

                    that.$forceUpdate();
                    that.scrollToBottom();
                });
            };
            reader.readAsDataURL(event.srcElement.files[0]);
        }

        private zoomImage(content: string) {
            this.imagePreviewVisible = true;
            this.imagePreview = content;
        }

        private refreshOnlineStatusColor() {
            const onlineStatus = this.userAgent.onlineStatus;
            let current = this.onlineStatusList.find((o: any) => {
                return o.value === onlineStatus;
            });
            this.onlineStatusColor = current ? current.color : '';
        }

        private showHistory() {
            this.showHistoryDialog = true;
            this.hisQuery = DEFAULT_QUERY;
            this.hisGet();
        }
        private hisGet() {
        	if(!this.current.id){
        		return;
            }
			this.hisQuery.sessionId = this.current.id;
            Api.$get('/chat/all-history', this.hisQuery).then((res: any) => {
                //console.log(res.data)
                this.hisList = res.data;
                this.hisPage = res.page;
            });
        }
        private hisSearch() {
            console.log(this.hisQueryDate);
            this.hisQuery.beginDate = Utils.dateFormat(this.hisQueryDate[0], 'YYYY/MM/DD');
            let endDate = new Date(this.hisQueryDate[1]);
            endDate.setDate(endDate.getDate() + 1);
            console.log(endDate);
            this.hisQuery.endDate =   Utils.dateFormat(endDate, 'YYYY/MM/DD');
            this.hisGet();
        }
        private hisPageSizeChange(pageSize:number) {
            this.hisQuery.pageSize = pageSize;
            this.hisGet();
        }
        private hisCurrentPageChange(pageNo:number) {
            this.hisQuery.pageNo = pageNo;
            this.hisGet();
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
<style lang='scss'>
    .staffchat_his_dialog {
        .el-dialog__body {
            padding-top: 0 !important;
        }
    }

    .staffchat_his_search_wrapper {
        text-align: right;

        .el-date-editor .el-range-separator {
            padding: 0 !important;
        }

        .el-button {
            margin-left: 10px;
        }
    }
</style>
<style lang='scss' scoped>
    @import 'StaffChat';
</style>

