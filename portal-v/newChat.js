new Vue({
    template: `
    <div >
        <div class="chat_tip" id="chatTip">
            <div class="chat_left" @click="showMain()">
                <img src="data:image/png;base64,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">
                <span>在线客服</span>
            </div>
            <div class="chat_split_line"></div>
            <div class="chat_right">
                <p>在线时间</p>
                <p>9:00 - 22:00</p>
            </div>
        </div>
        <div class="chat_main" id="chatMain" v-show="hiddenMain">
            <div class="chat_header">
                <div id="chatServiceName" class="chat_service_name">客服：{{ chatSession.otherSideName }} 正在为您服务</div>
                <img id="chatClose" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADoklEQVR4Xu2bO4vVQBSAv2NhYScIooIuggg+KjvfWGgh4vb+EBtFWGt/hp2ggoVg47vRThRFEB+ICqKdhSBHzjJZsrlJZm5m8rw71cJNsvm+nJyTZOYICz4kz6+q54GdwE0R+TMlN6q6BbgEfBGR+xnbmgBVvQ5ccT+8AM6JyO8pSFDVrcAD4IjjWRGRa/b3qgBV3Q28BzbngF8DJ8YuwcE/AQ7m2P4CSyLyLROwDNwuudqjllABn2FeEJF7mYBNwFtg31QkeODfAIdERPM5wELkIbBt7BJU1RiMJR/2GdZP4LiIvFvLAdkvqrofeFoj4bSI2AEGOxy8MRhLcayDnxHgEmKdBLNm9gYpYV74UgFjldAEvlLA2CQ0ha8VMBYJMfBeAUOX4IH/AZzKsn1V1l73LlC1kasOj4DtJdv0khhV1c7Fzqks2xv8URH54CtXQQJcJOwFntdIMNv2j1sfDt7Oxc6pOILhg26B/NFVtU6C2TbrrUpICT+3gIBIaFVCavhGAvqS0AZ8YwFdS2gLPkpAVxI88F+BkyHZPqoM1qV1lxgfA7tKtovKCQHwx0TkU0zZCS6DHgl7gGcpJaiqCTWxZaXOrnw0fPQtUCiRPgkWqnbi3uHgrc7bp7riSAafVIDLCXUSPrvnhFoJXcInFxAroWv4VgQ0ldAHfGsC5pXQF3yrAkIluAxXlfAsb1jyjCp1dVk3SRkMKJFWzsoy+ke371LJMYKSprekeDZoXYCLBKvpVVe57BQ7gW/9Fig8J4RK6Ay+UwGBkdAp/IaAbHY4NpGE7O8pdflDdBoFG0kw5OrFbKOq9n5QVQatvqvN1U+yDDr4qtfk1VCf7INQCHz2ejy5R+F54LPQ70tC8iTYBL5PCUkFxMD3JSGZAA+8fRyd7iexlPCFSBj+R9GF/izexWRpwNxAPxMjXcDnbgdbC5BkOrz4xNkoCXYJ37aEuQX0Ad+mhLkEeOBtqUzrq0RSzxQHCwiA72wBZUoJQQIWepGUZ/1wLyvEcjnBFkVXrQuOXyY3ZPhACTOLo4PL4BjgU0gozQFjgo+VMCNgzD0DTdYNF9vmfA0Tg2+imldCvmVm9PCF2yG8ZUZVrWnqFXCg5PP0KDvHPE1TxnR4rWlKVS8Cd6YCn4sEa5gs9gxmPy+LyN2sbW4HYHP1i9k46WZuV4CrTs9L4OzYu0YLkXALOAP8Ay6LyI2Z2eEpN0+7i2w57ruI/MrkBL0MxcwNDn3f//mvrF+EKZb3AAAAAElFTkSuQmCC">
            </div>
            <div class="chat_container">
            <div id="chatHistoryWrapper" class="chat_history_wrapper">
                <div id="chatHistory" ref="chatHistory" class="chat_history">
                    <template v-for="msg in msgs">
                        <template v-if="msg.sendUserType == 2">
                            <div class="chat_history_custom">
                                <div class="chat_msg">
                                    <div class="title">我 {{ msg.gmtCreate | dateTime }}</div>
                                    <div class="msg">
                                         <template v-if="msg.contentType == 2">
                                            <img :src="msg.content">
                                        </template>
                                        <template v-else>
                                            <span v-html="msg.content"></span>
                                        </template>
                                    </div>
                                </div>
                             </div>
                        </template>
                        <template v-else>
                           <div class="chat_history_service">
                                <div class="chat_msg">
                                    <div class="title">客服人员 {{ msg.gmtCreate | dateTime }}</div>
                                    <div class="msg">
                                         <template v-if="msg.contentType == 2">
                                            <img :src="msg.content">
                                        </template>
                                        <template v-else>
                                            <span v-html="msg.content"></span>
                                        </template>
                                    </div>
                                </div>
                             </div>
                        </template>
                     </template>
                </div>
            </div>
            <div class="chat_attachment">
<!--                <div class="chat_expression">-->
<!--                    <img id="chatExpression"-->
<!--                         src="data:image/png;base64,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"-->
<!--                         alt="">-->
<!--                    <div id="chatExpressionChoose" class="chat_expression_choose"></div>-->
<!--                </div>-->
                <div class="chat_image">
                    <img id="chatImage"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEG0lEQVR4Xu1bTWhcVRT+zs2MBpxNMUYUxaJVXLiSUDRM5r17IwZsuhFpCyKIf4viphSR0kKrVFEXxY100aLSlU0Xoi0RXMyZN4O6MFoKwZ+NFEVbQikmIIRkck+58ALTyRsnP/PzZnLv8s37Od93vnPuOffeIWzzQdscPzwBXgHbnAEfAttcAD4JNgyBUql0xFr7JhHd38sqEZF/AHxijHk/CUciAcw8CeBiLwOvt52IXgnD8LM115NAMvMZAK+530Qk6mUiiCiIcXxqjHl1vQRcAPCCw6+1Vr1MADNLbP8FrfU+T0AdA41ygFeADwGfA3wS9LOAnwZ9HbCxQoiZRwAcF5Gn3XRLRN8PDAycKBQKP3ermOpYIcTMORG5SkR314G9vrS0tGtiYuK/bpDQSQLyACqJHRfRaBiGP/Q1AcVicQ8RXWpAwHNhGH7T1wRUKpXHqtXq70kgM5nMI2NjY3/0NQEOHDOfBXBbyykiZ4wxb3QDfGxTZ7vBcrm8u1qtvkxEK0R0LgzDH7sFvisEdBNsg8Wdziqg1QRMT0/fOTg4OElEeRHZDWAnEd3nyozab4nICoDzxpgXa693bBpsNfCpqamB4eHhg9bao0R073reLyJ/G2Me6HkCoih60Fo7BeCpBOB/AbgqIrb2NyJatNaeGh8f/7anCYiiaNRa6+qJHTVAZkTkNBF9rbW+sR41rN7TUyHAzC5+PweQcQBE5IpS6lAYhrwR0D2nAGZ2gE8CeLvG+I/DMDxMRLdJfaNEpFoBIqKiKNovIu8AeDT2+opS6vWkTYyNgk9lHVAul++x1j4hIs+KyD4iengVmIjcBPC8MaZlmzFdU0CczDQA1yXuAvAQgGwjL4rIT5lMZm+hULi2GU83eqbjBERRVLDWfthgCltjp4j8opQ6GQTB+a3Ge1crwZmZmezCwsJ7RPRWvSEiMg/gNwCLRPSvm8cBzCqlvguC4NdWerz+XR1RQKVS2bG8vHyJiEZrDLjutqVF5KIx5ko7Qf7fu9tOADM/DsAtduyMs/i8UupILpc7OzIystwt4B0phJj5GQBfAsjFH7yczWYn8/m8O5SQitE2BTDzYRH5iIhWt8+/AnBAa72YCuSxES0nIK7aXLm62na6fvtdrfWJNAFvWwgw8xcA9scfWBSRA8YY5/1UjpYqwPXoQ0ND80R0F4BrSqk9QRBcTiXydoVAsVg8SERPAjimtXZTXapHSxWQaqQNjPME+ENS/pRYby+LbzXv+BywmRxQLBbPEdFLcXPTstWZrXpzM8/XHJVN3KNMPChZKpUOicipzXwwxc/s1Vqv2b5PJGB2dvaOubm5D1y9T0TDKQbV1DQR+ZOITmutHZ41w/9lpimFfX6DV0CfO7gpPK+AphT1+Q1eAX3u4KbwbgHyBOlfguEwHQAAAABJRU5ErkJggg=="
                         alt="">
                    <input id="imageFile"  type="file" accept=".png,.jpg,.jpeg" style="display: none;" @click="chooseFile($event)">
                </div>
            </div>
            <div class="chat_input">
                <div id="chatInputArea" class="chat_input_area" contenteditable="true"></div>
                <div id="chatBtn" class="chat_btn" @click="send()">发送</div>
            </div>
        </div>
        </div>
    </div>`,
    el: '#app',
    data: {

        content:'',
        hiddenMain: true,
        input: '', // 输入框数值
        expand: false, // 是否展开表情
        msgs: [], // 消息数据
        stompClient: {},
        chatSession: {},
        visitor: {}
    },
    filters:{
        dateTime: function (time, format = 'HH:mm:ss') {
            let date = new Date(time);
            let res = format;
            if (format.indexOf('HH') > -1) {
                res = res.replace('HH', Number(date.getHours() + 1).toLocaleString('en', {minimumIntegerDigits: 2}));
            } else if (format.indexOf('H') > -1) {
                res = res.replace('H', date.getHours() + 1);
            }
            if (format.indexOf('mm') > -1) {
                res = res.replace('mm', date.getMinutes().toLocaleString('en', {minimumIntegerDigits: 2}));
            } else if (format.indexOf('m') > -1) {
                res = res.replace('m', date.getMinutes());
            }
            if (format.indexOf('ss') > -1) {
                res = res.replace('ss', date.getSeconds().toLocaleString('en', {minimumIntegerDigits: 2}));
            } else if (format.indexOf('s') > -1) {
                res = res.replace('s', date.getSeconds());
            }
            return res;
        },
    },
    created() { // 初始化数据

    },
    methods: {
        init() {
            this.createChatSession();
            this.parseIdentity();
        },
        showMain(){
            $('#chatMain')
                .css('right', window.innerWidth - $('#chatTip').offset().left - $('#chatTip').innerWidth())
                .css('bottom', window.innerHeight - $('#chatTip').offset().top)
                .show();
            this.init();
        },
        parseIdentity(identity) {
            if (!identity) {
                return {};
            }
            const arr = Base64.encode(identity).split(',');
            // CustomerId,CustomerName,CustomerTel
            return {
                id: arr[0],
                userName: arr[1],
                mobile: arr[2],
                account: arr[2]
            }
        },
        initWebSocket() {
            var socket = new SockJS('/' + 'ws');
            this.stompClient = Stomp.over(socket);
            var that = this;
            var stompClient = that.stompClient;
            stompClient.connect({}, () => {
                this.stompClient.subscribe(`/chat/${that.chatSession.id}-1/receiveMsg`, (resp) => {
                    var message = JSON.parse(resp.body);
                    that.msgs.push(message);
                    that.scrollToBottom();
                });
            });
        },

        chooseFile(event) { // 选择文件发送
            if (!this.chatSession.id) {
                return;
            }
            if (event.srcElement.files.length === 0) {
                return;
            }
            const that = this;
            const reader = new FileReader();
            reader.onload = (event) => {
                that.sendMsg({content: reader.result, contentType: 2});
            };
            reader.readAsDataURL(event.srcElement.files[0]);
        },
        openExpression() { // 打开表情选择
            this.expand = !this.expand;
        },
        handleBlur() {
            window.scroll(0, 0);
        },
        // 创建聊天会话
        createChatSession() {
            var that = this;
            var visitorId = this.visitor && this.visitor.id ? this.visitor.id : '';

            this.$post('/chat/createSession', {connectId: visitorId}).then((res) => {
                if (!res.data) {
                    return;
                }
                that.chatSession = res.data;
                that.initWebSocket();
                that.messageHistory();
            });
        },
        send(){
            var content = $('#chatInputArea').html();
            console.log(content)
            this.sendMsg({content});
        },
        sendMsg(params) {
            if(!params.content){
                return;
            }
            var data = {
                sessionId: this.chatSession.id,
                content: params.content,
                contentType: params.contentType ? params.contentType : 1
            };

            this.$post('/chat/sendMsg', data).then(res => {
                if (!res.success) {
                    alert('发送失败');
                    return;
                }
                if (params.contentType === 1) {
                    $('#chatInputArea').html();
                }
                this.msgs.push(res.data);
                this.$forceUpdate();
                this.scrollToBottom();
            });
        },

        messageHistory() {
            console.log(1111111111)
            if (!this.chatSession.id) {
                return;
            }
            this.$get('/chat/history',{sessionId: this.chatSession.id}).then(res=>{
                console.log(res)
                if(res.success){
                    this.msgs = res.data;
                }
            });
        },

        scrollToBottom() {
            // 滚动到最下
            this.$nextTick(() => {
                var dom = this.$refs.chatHistory;
                dom.scrollTop = (dom.scrollHeight + 100);
            });
        },

        $post(url, params, handleWarn) {
            var data = new FormData();
            for (const k in params) {
                if (params.hasOwnProperty(k)) {
                    data.append(k, params[k]);
                }
            }
            return this.$ajax(url, 'POST', data, handleWarn);
        },
        $get(url, params, handleWarn){
            return this.$ajax(url, 'GET', params, handleWarn);
        },
        $ajax(url, type, params, handleErr) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: url,
                    type: type,
                    cache: false,
                    processData: type === 'GET',
                    contentType: false,
                    data: params
                }).done(function (res) {
                    resolve(res);
                }).fail(function (res) {
                    if (!handleErr) {
                        alert('发送失败');
                    }
                    reject(res);
                });
            });
        }
    }
})