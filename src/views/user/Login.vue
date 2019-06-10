<template>
    <div id="login">
        <ul class="login-box">
            <li>
                <h1 class="title">用户登录</h1>
            </li>
            <li class="username">
                <label>请输入您的账号：</label>
                <el-input v-model="user.account" type="text" placeholder="请输入您的账号"></el-input>
            </li>
            <li class="password">
                <label>请输入您的密码：</label>
                <el-input v-model="user.pwd" type="password" placeholder="请输入您的密码"></el-input>
            </li>
            <li class="submit">
                <label></label>
                <el-button type="primary" @click="login">登录</el-button>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">

import {Component, Vue} from 'vue-property-decorator';
import {Getter, Action} from 'vuex-class';
import RouterName from '@/constant/router-name';

@Component
export default class Login extends Vue {
    private user: any = {
        account: '',
        pwd: '',
    };

    @Action('userLogin') private userLogin: any;

    private async login() {
        if (!this.user.account) {
            this.$alert('请输入账户！', {type: 'warning'});
            return;
        }
        if (!this.user.pwd) {
            this.$alert('请输入账户密码！', {type: 'warning'});
            return;
        }
        const res = await this.userLogin(this.user);
        console.log(res);
        if (!res.success) {
            console.log('login result is null');
            this.$alert(res.msg, {type: 'warning', title: '温馨提示'});
            return;
        }
        this.$router.push({name: RouterName.HOME});
    }
}
</script>
