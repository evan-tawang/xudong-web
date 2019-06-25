<template>
    <div id="login">
        <div class="login-header">
            <img src="/images/logo.png" alt="">
            <span>旭东红木即时通讯后台管理系统</span>
        </div>
        <ul class="login-box">
            <li>
                <h2 class="title">用户登录</h2>
            </li>
            <li class="username">
                <el-input v-model="user.account" type="text" placeholder="请输入您的账号" prefix-icon="el-icon-user"></el-input>
            </li>
            <li class="password">
                <el-input v-model="user.pwd" type="password" placeholder="请输入您的密码" prefix-icon="el-icon-lock"></el-input>
            </li>
            <li class="submit">
                <el-button type="primary" @click="login" :loading="isLoading">登录</el-button>
            </li>
            <!-- <li class="more">
            <span>注册</span>
            <span>忘记密码？</span>
            </li>
            <li class="other">
            <span>其他登陆方式</span>
            <img src="/images/wechat.png">
            </li> -->
        </ul>
    </div>
</template>
<script lang="ts">

import {Component, Vue} from 'vue-property-decorator';
import {Getter, Action} from 'vuex-class';
import RouterName from '@/constant/router-name';
import Types from '@/store/types';

@Component
export default class Login extends Vue {
    private isLoading: boolean = false;

    private user: any = {
        account: '',
        pwd: '',
    };

	@Action(Types.USER.LOGIN) private userLogin: any;

    private async login() {
        if (!this.user.account) {
            this.$alert('请输入账户！', {type: 'warning'});
            return;
        }
        if (!this.user.pwd) {
            this.$alert('请输入账户密码！', {type: 'warning'});
            return;
        }

        this.isLoading = true;
        const res = this.userLogin(this.user);
        this.isLoading = false;
        //console.log(res);
        if (!res.success) {
            //console.log('login result is null');
            this.$alert(res.msg, {type: 'warning', title: '温馨提示'});

            return;
        }
        this.$router.push({name: RouterName.HOME});
    }
}
</script>
<style lang='scss'>
    @import 'login';
</style>
