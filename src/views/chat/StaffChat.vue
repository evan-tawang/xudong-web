<template>
    <div class="chat detail__wrapper">
        <div class="chat-top">
            <img src="/images/logo.jpg" alt="">
            <div class="chat-top-msg">
                <div>旭东红木</div>
                <div>(咨询时间：09:00 - 17:00)</div>
            </div>
        </div>
        <div class="chat-main">
            <div class="chat-main-left">
                <div v-for="(session,index) in sessionList"
                     :key="session.id"
                     :class="{'current': current.visitorId == session.visitorId}"
                     @click="changeSession(session)"
                     class="visitor-item">
                    <img :src="session.avatar ? session.avatar : '/images/logo.jpg' ">
                    <div class="visitor-info">
                        <div>{{ session.name ? session.name : '游客' + (index + 1) }}</div>
                        <div class="visitor-info-msg">
                            <template v-if="session.messages && session.messages.length > 0">
                                {{ session.messages[session.messages.length-1].content }}
                            </template>
                        </div>
                    </div>
                    <div class="visitor-item-num">{{session.messages.length > 99 ? '99+' : session.messages.length}}
                    </div>
                </div>
            </div>
            <div class="chat-main-center">
                <div class="chat-history" ref="chatHistory">
                    <div v-for="(message, index) in current.messages"
                         :key="index"
                         class="column"
                         :class="{'service': message.sendUserType == 1, 'custom': message.sendUserType != 1 }">
                        <template v-if="message.sendUserType == 1">
                            <div class="service-info">
                                <div class="title">客服 {{ message.gmtCreate | date('HH:mm:ss') }}</div>
                                <div class="service-msg msg img-msg" v-if="message.contentType == 2">
                                    <img :src="message.content">
                                </div>
                                <div v-else class="service-msg msg" v-html="message.content"></div>
                            </div>
                            <img class="avatar-img" src="/images/logo.jpg">
                        </template>
                        <template v-else>
                            <img class="avatar-img" src="/images/logo.jpg">
                            <div class="custom-info">
                                <div class="title">顾客 18:00:00</div>
                                <div class="custom-msg msg img-msg" v-if="message.contentType == 2">
                                    <img :src="message.content">
                                </div>
                                <div v-else class="custom-msg msg" v-html="message.content"></div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="chat-edit">

                    <div class="chat_attachment">
                        <div class="chat_expression">
                            <img src="/images/smile.png" alt="" @click="chatExpressionToggle">
                            <div v-if="chatExpressionChoose" class="chat_expression_choose">
                                <div data-value="0">1</div>
                                <div data-value="1">2</div>
                                <div data-value="2">3</div>
                            </div>
                        </div>
                        <div class="chat_image">
                            <img src="/images/image.png" alt="" @click="chooseFile">
                            <input @change="changeFile($event)" ref="imageFile" type="file" accept=".png,.jpg,.jpeg"
                                   style="display: none;">
                        </div>
                        <div class="talk_sikill">
                            <el-popover
                                    popper-class="skills_popover"
                                    placement="right"
                                    width="300"
                                    trigger="click">
                                <ul>
                                    <li v-for="(talkSkill, index) in talkSkillList"
                                        :key="index"
                                        @click="chooseTalkSkill(talkSkill)">{{ talkSkill }}
                                    </li>
                                </ul>
                                <i slot="reference" class="el-icon-chat-dot-round"></i>
                            </el-popover>
                        </div>
                        <div class="talk_disconect">
                            <i class="el-icon-search" @click="showSearch()"></i>
                        </div>
                        <div class="talk_disconect">
                            <i class="el-icon-close" @click="disconnect()"></i>
                        </div>

                    </div>
                    <div class="chat_input">
                        <div ref="chatInputArea" class="chat_input_area" contenteditable="true"></div>
                        <div class="chat_btn" @click="sendMsg">发送</div>
                    </div>
                </div>
            </div>
            <div class="chat-main-right">
                <div class="service-item">
                    <img src="/images/logo.jpg">
                    <div class="service-info">
                        <div>客服1:xxx</div>
                        <div>服务时间</div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
                title="历史记录"
                :visible.sync="showSearchModel"
                width="60%">
            <div>
                <!--
                <el-date-picker
                        v-model="value2"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <el-button type="primary" @click="searchData" icon="el-icon-search">搜索</el-button>
                -->
            </div>
            <div>
                <div v-for="(o,index) in searchedList" :key="o.id">
                    <div class="search-chat-name">
                        <template v-if="o.sendUserType == 1">
                            {{ current.visitorName ? current.visitorName : '游客' }}
                        </template>
                        <template v-else>
                            {{ current.staffName ? current.staffName : '我' }}
                        </template>
                    </div>
                    <div class="search-chat-content">
                        <template v-if="o.contentType == 2">
                            <img width="16" height="16" :src="message.content">
                        </template>
                        <template v-else>
                            {{ o.content }}
                        </template>
                    </div>
                </div>
            </div>
            <!--
            <el-pagination class="list__page"
                           @size-change="pageSizeChange"
                           @current-change="currentPageChange"
                           :current-page="query.pageNo"
                           :page-sizes="[10, 20, 50, 100]"
                           :page-size="query.pageSize"
                           layout="prev, pager, nextr"
                           :total="this.page.recordCount">
            </el-pagination>
            -->
        </el-dialog>
    </div>
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
                    that.subscribeReceiveMsg(chatSession);
                    chatSession.messages = [];
                    that.sessionList.push(chatSession);
                });
            });
        }

        private subscribeReceiveMsg(chatSession: any) {
            for (let session of this.sessionList) {
                if (session.id === chatSession.id) {
                    return;
                }
            }
            const that = this;
            this.stompClient.subscribe(`/chat/${chatSession.id}-${UserTypeEnum.VISITOR}/receiveMsg`, (resp: any) => {
                const message = JSON.parse(resp.body);
                that.sessionList.forEach((o: any) => {
                    if (o.visitorId === message.visitorId) {
                        const messages = o.messages || [];
                        messages.push(message);
                    }
                });

                this.scrollToBottom();
            });
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
                    this.subscribeReceiveMsg(o);
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
            Api.$post("/chat/sendMsg", {
                content: content,
                sessionId: this.current.id,
                receiveId: this.current.visitorId
            }).then((res: any) => {
                dom.innerHTML = "";
                this.current.messages.push(res.data);
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
                dom.scrollTo(0, dom.offsetHeight);
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

                    that.current.messages.push(res.data);
                    that.scrollToBottom();
                });
            };
            reader.readAsDataURL(event.srcElement.files[0]);
        }

        private showSearch() {
            this.showSearchModel = true;
        }
    }
</script>
<style lang="scss" scoped>
    .chat {
        height: 90%;
        width: 100%;
        min-width: 800px;
        min-height: 600px;
        box-shadow: 0px 4px 10px #ddd;
        border-radius: 4px;
        overflow: hidden;

        .chat-top {
            height: 56px;
            display: flex;
            align-items: center;
            background: #dbba7e;
            padding: 0 10px;
            color: #fff;

            img {
                height: 30px;
                width: 30px;
                border-radius: 4px;
                margin-right: 10px;
            }
        }

        .chat-main {
            display: flex;
            width: 100%;
            height: calc(100% - 56px);

            .chat-main-left {
                width: 20%;
                float: left;
                background: #F8F8F8;
                border-right: 1px solid #ddd;
                overflow: auto;

                .visitor-item {
                    height: 64px;
                    width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #ddd;
                    padding: 12px;
                    cursor: pointer;
                    transition: all .3s;

                    &:hover {
                        background: #eee;
                    }

                    &.current {
                        background: #f0eded;
                    }

                    img {
                        width: 36px;
                        height: 36px;
                        border-radius: 18px;
                        margin-right: 6px;
                    }

                    .visitor-info {
                        width: calc(100% - 62px);

                        .visitor-info-msg {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 12px;
                            margin-top: 4px;
                            color: #aaa;
                        }
                    }

                    .visitor-item-num {
                        position: absolute;
                        top: calc(50% - 12px);
                        right: 10px;
                        border-radius: 12px;
                        padding: 2px;
                        text-align: center;
                        background: #aaa;
                        color: #fff;
                        font-size: 12px;
                    }
                }
            }

            .chat-main-center {
                width: 60%;
                border-right: 1px solid #ddd;

                .chat-history {
                    height: 70%;
                    padding: 16px;
                    overflow-y: auto;

                    .avatar-img {
                        width: 36px;
                        height: 36px;
                        border-radius: 18px;
                        margin: 0 12px;
                    }

                    .column {
                        padding: 12px;
                        width: 70%;

                        .msg {
                            width: 70%;
                            padding: 12px;
                            border-radius: 4px;
                            word-break: break-all;

                            &.img-msg {
                                padding: 0;
                                border-radius: 0;

                                img {
                                    width: 100%;
                                }
                            }
                        }

                        .title {
                            margin-bottom: 8px;
                            color: #aaa;
                        }
                    }

                    .service {
                        display: flex;
                        width: 100%;
                        justify-content: flex-end;

                        .service-info {
                            .title {
                                text-align: right;
                            }

                            .service-msg {
                                background: #dbba7e;
                                color: #fff;
                                float: right;

                                &.img-msg {
                                    background: transparent;
                                }
                            }
                        }
                    }

                    .custom {
                        display: flex;
                        width: 100%;

                        .custom-info {
                            .custom-msg {
                                background: #f4eee1;

                                &.img-msg {
                                    background: transparent;
                                }
                            }
                        }

                    }
                }

                .chat-edit {
                    width: 100%;
                    height: 30%;
                    border-top: 1px solid #ddd;

                    .chat_attachment {
                        display: flex;
                        padding: 5px 0;

                        img {
                            width: 24px;
                            margin: 0 5px;
                        }

                        .chat_expression {
                            position: relative;

                            .chat_expression_choose {
                                position: absolute;
                                left: 5px;
                                bottom: 35px;
                                height: 80px;
                                width: 200px;
                                background: #fff;
                                border: 1px solid #ddd;
                                border-radius: 2px;
                                display: none;

                                &::before {
                                    content: '';
                                    position: absolute;
                                    bottom: -21px;
                                    display: blcok;
                                    border: 10px solid transparent;
                                    border-top: 10px solid #ddd;
                                }

                                &::after {
                                    content: '';
                                    position: absolute;
                                    display: blcok;
                                    bottom: -20px;
                                    border: 10px solid transparent;
                                    border-top: 10px solid #fff;
                                }
                            }
                        }

                        .talk_sikill, .talk_disconect {
                            i {
                                font-size: 24px;
                                color: #ccc;
                                margin-left: 4px;
                            }
                        }
                    }

                    .chat_input {
                        position: relative;
                        height: calc(100% - 37px);

                        .chat_input_area {
                            outline: none;
                            height: calc(100% - 40px);
                            overflow-y: auto;
                            overflow-x: hidden;
                            padding: 0 10px;
                            font-size: 12px;
                        }

                        .chat_btn {
                            float: right;
                            margin: 5px;
                            padding: 5px 15px;
                            background: #dbba7e;
                            color: #fff;
                            text-align: center;
                            border-radius: 2px;
                            font-size: 12px;
                            cursor: pointer;
                        }
                    }
                }
            }

            .chat-main-right {
                width: 20%;
                height: 100%;
                float: left;
                background: #F8F8F8;
                overflow: auto;

                .service-item {
                    height: 64px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #ddd;
                    padding: 12px;
                    cursor: pointer;
                    transition: all .3s;

                    &:hover {
                        background: #eee;
                    }

                    &.current {
                        background: #f0eded;
                    }

                    img {
                        width: 36px;
                        height: 36px;
                        border-radius: 18px;
                        margin-right: 6px;
                    }

                    .service-info {
                        width: calc(100% - 42px);

                        .service-info-msg {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }

    .skills_popover {
        padding: 0;

        ul {
            li {
                padding: 5px;
                line-height: 30px;
                cursor: pointer;
                transition: all .3s;

                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>
