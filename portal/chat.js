// 创建一个全局对象来作为所有对象的入口

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
            : this
), function(global) {
    'use strict';
    global = global || {};

    global.Chat = {
        // 聊天室的参数
        options: {
            // 是否已经初始化
            _isInstance: false,
            // 用于存放用户信息，需要在如果能获取用户信息时候调用
            loginUser: {
                id: '',
                userName: '',
                account: '',
            },
            staff: {
                id: null,
                name: '客服',
                avatar: 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMqaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0U3RUEwMzI5QzM4MTFFN0I0RDVBQkVBQ0NDNTZGMkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0U3RUEwMzM5QzM4MTFFN0I0RDVBQkVBQ0NDNTZGMkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RTdFQTAzMDlDMzgxMUU3QjRENUFCRUFDQ0M1NkYyRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3RTdFQTAzMTlDMzgxMUU3QjRENUFCRUFDQ0M1NkYyRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAICAgICAgICAgIDAgICAwQDAgID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',
            },
            visitor: {
                id: null,
                name: '顾客',
                avatar: 'data:image/png;base64,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',
            },
            status: null,
            // 会话id
            sessionId: null,
            socket: null,
            sendUserTypes : {
                STAFF: {
                    value: 1,
                    label: 'service',
                },
                VISITOR: {
                    value: 2,
                    label: 'custom',
                }
            },
            contentTypes : {
                TEXT: {
                    value: 1
                },
                IMAGE: {
                    value: 2,
                }
            }
        },
        setLogin: function (user) {
            if (!user) return;

            this.options.loginUser.id = user.id;
            this.options.loginUser.userName = user.userName;
            this.options.loginUser.account = user.account;
        },
        instance: function (options) {
            // 设置各种系统常量
            global.Chat.Request.options.host = ChatHost + '/' + global.Chat.Request.options.host;

            if (this.options._isInstance) return this;
            this.options.isInstance = true;
            this.Dom.init();
            return this;
        },

        showChatDom: function (opt) {
            if (opt) {
                if (opt.left) {
                    $('#chatMain').css('left', opt.left)
                }
                if (opt.top) {
                    $('#chatMain').css('top', opt.top)
                }
            }
            var isHidden = $("#chatMain").is(":hidden");
            if (!isHidden) {
                return;
            }
            $('#chatMain').show();
            // 建立连接
            this.Request.createSession()
        },
        showGuestBookDom: function (opt) {
            var isHidden = $("#chatMain").is(":hidden");
            if (!isHidden) {
                return;
            }
            if(opt){
                if (opt.left) {
                    $('#chatRecordMain').css('left', opt.left)
                }
                if (opt.top) {
                    $('#chatRecordMain').css('top', opt.top)
                }
            }
            $('#chatRecordMain').show();
        },

        Request:  {
            options: {
                host: 'service',
                sessionId:''
            },
            // 初始化session
             createSession:function () {
                 var connectId = global.Chat.options.loginUser.id;
                 var data = connectId ? {
                     connectId: connectId,
                     connectName: global.Chat.options.loginUser.userName,
                     connectAccount: global.Chat.options.loginUser.account
                 } : null;

                 var that = this;
                // 获取历史记录
                $.ajax({
                    url: this.options.host + '/chat/createSession',
                    type: 'POST',
                    cache: false,
                    data: data,
                }).done(function (res) {
                    if (!res.data) {
                        alert('客服繁忙中，请稍后');
                        return;
                    }
                    that.options.sessionId = res.data.id;

                    // 将职员名字设置到职员列表中

                    global.Chat.Dom.renderStaffName(res.data.otherSideName);

                    // 建立连接后获取历史记录
                    that.getHistoryMsgs();
                    // 建立websocket连接
                    that.createSocket();
                }).fail(function (res) {
                    alert('连接失败', res);
                });
            },

            // 初始化聊天记录
            getHistoryMsgs: function () {
                if (!this.options.sessionId) {
                    return;
                }
                var that = this;
                $.ajax({
                    url: this.options.host + '/chat/history',
                    type: 'GET',
                    contentType: "application/json;charset=utf-8",
                    data: {
                        sessionId: this.options.sessionId
                    }
                }).done(function (res) {
                    var data = res.data;
                    // 构建数据节点

                    for (var i in data) {
                        var item = data[i]
                        global.Chat.Dom.createChatMsg({
                            sendUserType: item.sendUserType,
                            contentType: item.contentType,
                            content: item.content,
                            avatar: item.avatar,
                            name: item.name,
                            time: that.dateFormat(item.gmtCreate, 'HH:mm:ss'),
                        })
                    }
                }).fail(function (res) {
                    alert('获取聊天数据失败', res.msg);
                });
            },

             changeFile:function (event) {
                var that = this;
                var file = event.currentTarget.files[0];

                if (!file) return;

                var reader = new FileReader();
                reader.onload = function (event) {
                    that.sendMsg({content: reader.result, contentType: 2})
                };
                reader.readAsDataURL(file);
            },

            // 发送留言
             sendRecord:function (content) {
                var data = {
                    content: content,
                    visitorId: Chat.options.visitor.id,
                }

                $.ajax({
                    url: this.options.host + '/guestBook/save',
                    type: 'POST',
                    cache: false,
                    data: data,
                }).done(function (res) {
                    $('#chatRecordArea').html('');
                    // 发送留言，关闭窗口
                    $('#chatRecordMain').hide();
                }).fail(function (res) {
                    alert('留言发送失败');
                });
            },

            // 发送消息
             sendMsg:function  (params) {
                var that = this;
                var data = {
                    sessionId: that.options.sessionId,
                    content: params.content,
                    contentType: params.contentType ? params.contentType : 1
                };

                $.ajax({
                    url: this.options.host + '/chat/sendMsg',
                    type: 'POST',
                    cache: false,
                    data: data
                }).done(function (res) {
                    if (!res.success) {
                        alert('发送失败');
                        return;
                    }
                    var data = res.data;

                    if(data.contentType == 1){
                        $('#chatInputArea').html('');
                    }

                    global.Chat.Dom.createChatMsg({
                        sendUserType: data.sendUserType,
                        contentType: data.contentType,
                        content: data.content,
                        avatar: Chat.options.visitor.avatar,
                        time: that.dateFormat(Date.now(), 'HH:mm:ss'),
                    })
                }).fail(function (res) {
                    alert('发送失败');
                });
            },

            /** 建立websocket连接 **/
             createSocket:function  () {
                 var that = this;
                if (!that.options.sessionId) {
                    return;
                }
                var socket = new SockJS(this.options.host + '/ws');
                var stompClient = Stomp.over(socket);
                this.options.stompClient = stompClient;
                stompClient.connect({}, function () {
                    stompClient.subscribe('/chat/' + that.options.sessionId + '-1/receiveMsg', function (resp) {
                        var data = JSON.parse(resp.body);
                        global.Chat.Dom.createChatMsg({
                            sendUserType: data.sendUserType,
                            contentType: data.contentType,
                            content: data.content,
                            name: data.name,
                            time: that.dateFormat(data.gmtCreate, 'HH:mm:ss'),
                        });
                    });
                });
            },

            /** 断开websocket连接 **/
            disconnectWebSocket:function  () {
                if(!this.options.stompClient){
                    return;
                }
                var stompClient = this.options.stompClient;
                stompClient.disconnect();
            },

            // 时间转换
             dateFormat:function (time, format) {
                var date = new Date(time);
                var res = format;
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

            getSendTypeLabel: function (type) {
                var sendUserTypes = global.Chat.options.sendUserTypes;
                for (var key in sendUserTypes) {
                    if (sendUserTypes[key].value === type) {
                        return sendUserTypes[key].label;
                    }
                }
            }
        },
        Dom: {

            init: function () {
                // 初始化chatTip
                // initChatTip();
                // 初始化聊天区域
                this.initChatArea();
                // 初始化表情选择区域
                // initExpression();
                // 初始化留言区域
                this.initRecordArea();

                this.jquery();
            },

            renderStaffName:function(name){
                var html = '客服代表正在为您服务';
                if(name){
                    html = '客服代表：' + name + ' 正在为您服务';
                }
                $('#chatServiceName').html(html);
            },

            /* 页面组件渲染 */
            initChatTip: function () {
                var html =
                    '<div class="chat_tip" id="chatTip">' +
                    '<div class="chat_left">' +
                    '<img src="data:image/png;base64,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">' +
                    '<span>在线客服</span>' +
                    '</div>' +
                    '<div class="chat_split_line"></div>' +
                    '<div class="chat_right">' +
                    '<p>在线时间</p>' +
                    '<p>9:00 - 22:00</p>' +
                    '</div>' +
                    '</div>';
                $('body').append(html);
                var html2 =
                    '<div class="chat_record_tip" id="chatRecordTip">' +
                    '<p>留言</p>' +
                    '</div>'
                $('body').append(html2);
            },

            initChatArea :function () {
                var html =
                    '<div class="chat_main" id="chatMain">' +
                    '<div class="chat_header">' +
                    '<div id="chatServiceName" class="chat_service_name">客服：' + Chat.options.staff.name + '</div>' +
                    '<img id="chatClose" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADoklEQVR4Xu2bO4vVQBSAv2NhYScIooIuggg+KjvfWGgh4vb+EBtFWGt/hp2ggoVg47vRThRFEB+ICqKdhSBHzjJZsrlJZm5m8rw71cJNsvm+nJyTZOYICz4kz6+q54GdwE0R+TMlN6q6BbgEfBGR+xnbmgBVvQ5ccT+8AM6JyO8pSFDVrcAD4IjjWRGRa/b3qgBV3Q28BzbngF8DJ8YuwcE/AQ7m2P4CSyLyLROwDNwuudqjllABn2FeEJF7mYBNwFtg31QkeODfAIdERPM5wELkIbBt7BJU1RiMJR/2GdZP4LiIvFvLAdkvqrofeFoj4bSI2AEGOxy8MRhLcayDnxHgEmKdBLNm9gYpYV74UgFjldAEvlLA2CQ0ha8VMBYJMfBeAUOX4IH/AZzKsn1V1l73LlC1kasOj4DtJdv0khhV1c7Fzqks2xv8URH54CtXQQJcJOwFntdIMNv2j1sfDt7Oxc6pOILhg26B/NFVtU6C2TbrrUpICT+3gIBIaFVCavhGAvqS0AZ8YwFdS2gLPkpAVxI88F+BkyHZPqoM1qV1lxgfA7tKtovKCQHwx0TkU0zZCS6DHgl7gGcpJaiqCTWxZaXOrnw0fPQtUCiRPgkWqnbi3uHgrc7bp7riSAafVIDLCXUSPrvnhFoJXcInFxAroWv4VgQ0ldAHfGsC5pXQF3yrAkIluAxXlfAsb1jyjCp1dVk3SRkMKJFWzsoy+ke371LJMYKSprekeDZoXYCLBKvpVVe57BQ7gW/9Fig8J4RK6Ay+UwGBkdAp/IaAbHY4NpGE7O8pdflDdBoFG0kw5OrFbKOq9n5QVQatvqvN1U+yDDr4qtfk1VCf7INQCHz2ejy5R+F54LPQ70tC8iTYBL5PCUkFxMD3JSGZAA+8fRyd7iexlPCFSBj+R9GF/izexWRpwNxAPxMjXcDnbgdbC5BkOrz4xNkoCXYJ37aEuQX0Ad+mhLkEeOBtqUzrq0RSzxQHCwiA72wBZUoJQQIWepGUZ/1wLyvEcjnBFkVXrQuOXyY3ZPhACTOLo4PL4BjgU0gozQFjgo+VMCNgzD0DTdYNF9vmfA0Tg2+imldCvmVm9PCF2yG8ZUZVrWnqFXCg5PP0KDvHPE1TxnR4rWlKVS8Cd6YCn4sEa5gs9gxmPy+LyN2sbW4HYHP1i9k46WZuV4CrTs9L4OzYu0YLkXALOAP8Ay6LyI2Z2eEpN0+7i2w57ruI/MrkBL0MxcwNDn3f//mvrF+EKZb3AAAAAElFTkSuQmCC">' +
                    '</div>' +
                    '<div class="chat_container">' +
                    '<div id="chatHistoryWrapper" class="chat_history_wrapper">' +
                    '<div id="chatHistory" class="chat_history"></div>' +
                    '</div>' +
                    '<div class="chat_attachment">' +
                    // '<div class="chat_expression">' +
                    //     '<img id="chatExpression" src="data:image/png;base64,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" alt="">' +
                    //     '<div id="chatExpressionChoose" class="chat_expression_choose"></div>' +
                    // '</div>' +
                    '<div class="chat_image">' +
                    '<img id="chatImage" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEG0lEQVR4Xu1bTWhcVRT+zs2MBpxNMUYUxaJVXLiSUDRM5r17IwZsuhFpCyKIf4viphSR0kKrVFEXxY100aLSlU0Xoi0RXMyZN4O6MFoKwZ+NFEVbQikmIIRkck+58ALTyRsnP/PzZnLv8s37Od93vnPuOffeIWzzQdscPzwBXgHbnAEfAttcAD4JNgyBUql0xFr7JhHd38sqEZF/AHxijHk/CUciAcw8CeBiLwOvt52IXgnD8LM115NAMvMZAK+530Qk6mUiiCiIcXxqjHl1vQRcAPCCw6+1Vr1MADNLbP8FrfU+T0AdA41ygFeADwGfA3wS9LOAnwZ9HbCxQoiZRwAcF5Gn3XRLRN8PDAycKBQKP3ermOpYIcTMORG5SkR314G9vrS0tGtiYuK/bpDQSQLyACqJHRfRaBiGP/Q1AcVicQ8RXWpAwHNhGH7T1wRUKpXHqtXq70kgM5nMI2NjY3/0NQEOHDOfBXBbyykiZ4wxb3QDfGxTZ7vBcrm8u1qtvkxEK0R0LgzDH7sFvisEdBNsg8Wdziqg1QRMT0/fOTg4OElEeRHZDWAnEd3nyozab4nICoDzxpgXa693bBpsNfCpqamB4eHhg9bao0R073reLyJ/G2Me6HkCoih60Fo7BeCpBOB/AbgqIrb2NyJatNaeGh8f/7anCYiiaNRa6+qJHTVAZkTkNBF9rbW+sR41rN7TUyHAzC5+PweQcQBE5IpS6lAYhrwR0D2nAGZ2gE8CeLvG+I/DMDxMRLdJfaNEpFoBIqKiKNovIu8AeDT2+opS6vWkTYyNgk9lHVAul++x1j4hIs+KyD4iengVmIjcBPC8MaZlmzFdU0CczDQA1yXuAvAQgGwjL4rIT5lMZm+hULi2GU83eqbjBERRVLDWfthgCltjp4j8opQ6GQTB+a3Ge1crwZmZmezCwsJ7RPRWvSEiMg/gNwCLRPSvm8cBzCqlvguC4NdWerz+XR1RQKVS2bG8vHyJiEZrDLjutqVF5KIx5ko7Qf7fu9tOADM/DsAtduyMs/i8UupILpc7OzIystwt4B0phJj5GQBfAsjFH7yczWYn8/m8O5SQitE2BTDzYRH5iIhWt8+/AnBAa72YCuSxES0nIK7aXLm62na6fvtdrfWJNAFvWwgw8xcA9scfWBSRA8YY5/1UjpYqwPXoQ0ND80R0F4BrSqk9QRBcTiXydoVAsVg8SERPAjimtXZTXapHSxWQaqQNjPME+ENS/pRYby+LbzXv+BywmRxQLBbPEdFLcXPTstWZrXpzM8/XHJVN3KNMPChZKpUOicipzXwwxc/s1Vqv2b5PJGB2dvaOubm5D1y9T0TDKQbV1DQR+ZOITmutHZ41w/9lpimFfX6DV0CfO7gpPK+AphT1+Q1eAX3u4KbwbgHyBOlfguEwHQAAAABJRU5ErkJggg==" alt="">' +
                    '<input  id="imageFile" type="file" accept=".png,.jpg,.jpeg" style="display: none;">' +
                    '</div>' +
                    '</div>' +
                    '<div class="chat_input">' +
                    '<div id="chatInputArea" class="chat_input_area" contenteditable="true"></div>' +
                    '<div id="chatBtn" class="chat_btn">发送</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                $('body').append(html);
            },

            initRecordArea: function () {
                var html = '<div class="chat_record" id="chatRecordMain">' +
                    '<div class="chat_record_header">' +
                    '<span>请您留言</span>' +
                    '<div id="cancelRecord" class="cancel">-</div>' +
                    '</div>' +
                    '<div id="chatRecordArea" contenteditable="true" class="chat_record_area"></div>' +
                    '<div id="recordBtn" class="chat_btn">留言</div>' +
                    '</div>'
                $('body').append(html);
            },

            jquery:function(){
                /* 事件绑定 */
                // 聊天浮窗点击事件
                $('#chatTip').on('click', function (event) {
                    $('#chatMain')
                        .css('right', window.innerWidth - $('#chatTip').offset().left - $('#chatTip').innerWidth())
                        .css('bottom', window.innerHeight - $('#chatTip').offset().top)
                        .show();
                    // 建立连接
                    createSession();
                });
                $('#chatRecordTip').on('click', function (event) {
                    $('#chatRecordMain')
                        .css('right', window.innerWidth - $('#chatRecordTip').offset().left - $('#chatRecordTip').innerWidth())
                        .css('bottom', window.innerHeight - $('#chatRecordTip').offset().top)
                        .show();
                });
                // 表情控件开关
                $('#chatExpression').on('click', function (event) {
                    event.stopPropagation();
                    $('#chatExpressionChoose').toggle();
                });
                // 表情选择
                $('#chatExpressionChoose').on('click', function (event) {
                    event.stopPropagation();
                    // 获取表情标志
                    var dataVal = $(event.target).data('value');
                    // 将标志追加到文本
                    $('#chatInputArea').html($('#chatInputArea').html() + dataVal);
                });
                /* 图片操作 */
                $('#chatImage').on('click', function (event) {
                    $('#imageFile').click();
                });
                $('#imageFile').on('change', function (event) {
                    global.Chat.Request.changeFile(event);
                })
                /* 发送消息 */
                $('#chatBtn').on('click', function (event) {
                    // TODO Websocket发送文本消息，同添加代码块
                    if ($('#chatInputArea').html()) {
                        // 发送消息
                        global.Chat.Request.sendMsg({
                            // 后端需要对文本内容进行转义
                            content: $('#chatInputArea').html(),
                        });
                    }
                })
                // 发送留言
                $('#recordBtn').on('click', function (event) {
                    // TODO Websocket发送文本消息，同添加代码块
                    if ($('#chatRecordArea').html()) {
                        global.Chat.Request.sendRecord($('#chatRecordArea').html());
                    }
                })
                $('#cancelRecord').on('click', function (event) {
                    $('#chatRecordArea').html('');
                    $('#chatRecordMain').hide();
                })
                // 关闭聊天窗口
                $('#chatClose').on('click', function (event) {
                    $('#chatMain').hide();
                    global.Chat.Request.disconnectWebSocket();
                });

                // 绑定全局隐藏事件
                $(document).on('click', function (event) {
                    $('#chatExpressionChoose').hide();
                });

                //点击关闭或重载按钮
                window.onbeforeunload = function(event){
                    return onBeforeUnload(event);
                }
                function onBeforeUnload(event){
                    var clientBrowser = chargeBrowser();
                    var isIE = document.all ? true : false;//另一方法
                    var evt = event ? event : (window.event ? window.event : null);
                    if(clientBrowser=="IE"){
                        var n = evt.screenX - window.screenLeft;
                        var b = n > document.documentElement.scrollWidth - 20;
                        if(b && evt.clientY < 0 || evt.altKey){
                            global.Chat.Request.disconnectWebSocket();
                        }else{
                            global.Chat.Request.disconnectWebSocket();
                        }
                    }else if (clientBrowser==="Chrome") {
                        global.Chat.Request.disconnectWebSocket();
                    }else{
                        if(document.documentElement.scrollWidth != 0){
                            global.Chat.Request.disconnectWebSocket();
                        }else{
                            global.Chat.Request.disconnectWebSocket();
                        }
                    }
                }

                function chargeBrowser() {
                    var userAgent = navigator.userAgent;
                    var isOpera = userAgent.indexOf("Opera") > -1;
                    if (isOpera) {
                        return "Opera"

                    }else if(userAgent.indexOf("Firefox") > -1) {
                        return "Firefox";
                    }else if(userAgent.indexOf("Chrome") > -1){
                        return "Chrome";
                    }else if(userAgent.indexOf("Safari") > -1) {
                        return "Safari";
                    }else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                        return "IE";
                    }else if(userAgent.indexOf("Trident") > -1) {
                        return "Edge";
                    }else if(userAgent.indexOf("QQ") > -1) {
                        return "QQ";
                    }else{
                        return "";
                    }
                }
            },

            // function initExpression() {
            //     var fragment = document.createDocumentFragment();
            //     $.each(expressArr, function (index, item) {
            //         var dom = document.createElement('div')
            //         dom.innerHTML = '<img class="expression_img" src="' + item.src + '" data-value="' + item.code + '"/>';
            //         fragment.append(dom);
            //     });
            //     $('#chatExpressionChoose').append(fragment);
            // }


            // 增加聊天消息代码块
            createChatMsg: function (msg) {
                var Chat = global.Chat;
                var Request = global.Chat.Request;
                var sendUserTypes = global.Chat.options.sendUserTypes;
                var contentTypes = global.Chat.options.contentTypes;

                // 构建一个聊天信息
                var dom1 = document.createElement('div');
                dom1.className = 'chat_history_' + Request.getSendTypeLabel(msg.sendUserType);
                // 构建信息内容块
                var dom2 = document.createElement('div');
                dom2.className = 'chat_msg';
                // 构建标题
                var titleDom = document.createElement('div');
                titleDom.className = 'title';

                var name = '我';
                if (msg.sendUserType === sendUserTypes.STAFF.value) {
                    name = '客服人员';
                }
                titleDom.textContent = name + '  ' + msg.time;

                // 构建信息
                var msgDom = document.createElement('div');
                if (msg.contentType === contentTypes.TEXT.value) {
                    msgDom.className = 'msg';
                    msgDom.innerHTML = msg.content;
                } else if (msg.contentType === contentTypes.IMAGE.value) {
                    msgDom = document.createElement('img');
                    msgDom.className = 'img-msg';
                    msgDom.src = msg.content;
                }
                dom2.appendChild(titleDom);
                dom2.appendChild(msgDom);
                // 设置用户头像
                var avatarDom = document.createElement('img');
                if (msg.sendUserType === sendUserTypes.STAFF.value) {
                    avatarDom.src = Chat.options.staff.avatar;
                } else {
                    avatarDom.src =  Chat.options.visitor.avatar;
                }
                avatarDom.className = 'avatar';
                // 追加节点
                if (msg.sendUserType === sendUserTypes.VISITOR.value) {
                    dom1.appendChild(dom2);
                    dom1.appendChild(avatarDom);
                } else if (msg.sendUserType === sendUserTypes.STAFF.value) {
                    dom1.appendChild(avatarDom);
                    dom1.appendChild(dom2);
                }
                $('#chatHistory').append(dom1);
                setTimeout(function () {
                    $('#chatHistoryWrapper').scrollTop($('#chatHistory').innerHeight());
                }, 0);
            },


            // 处理数据
            // function handleData(msgs) {
            //     for (var i = 0; i < msgs.length; i++) {
            //         msg.timeStr = dateFormat(msg.time, 'HH:mm:ss');
            //     }
            // }

            // 处理表情转化为图片
            // function handleExpression(text) {
            //     $.each(expressArr, function (index, item) {
            //         if (text.indexOf(item.code) > -1) {
            //             var regexp = new RegExp(item.code, 'g')
            //             text.replace(regexp, '<img src="' + item.src + '">')
            //         }
            //     });
            //     return text;
            // }

            /* 各种ajax请求 */
        },
    }

    return {Chat: global.Chat}
}));
