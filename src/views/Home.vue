<template src="./Home.html"></template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Getter, Action} from 'vuex-class';
import RouterName from "@/constant/router-name";
import Menus from "@/constant/menus";
import Types from "@/constant/types";

@Component
export default class Home extends Vue {
	private menus = Menus; // 菜单

    private key!: number; // 非number
    private var1!: number; // 非number
    private var2: number = 0; // 只能number
    private var3: any; // 所有类型

    @Action(Types.USER.LOGIN) private pageList: any;
	@Action private userLogout: any;

    private async created() {
    	console.log(this.$store)
        const list = await this.pageList();
        console.log(list);
    }

	private jump(menu: any) {
		this.$router.push({name: menu.routerName});
	}

    private handleOpen(key: any, keyPath: any) {
    	console.log('..open...');
        this.key = key;
    }

    private handleClose(key: any, keyPath: any) {
        this.key = key;
    }

	private logout(){
		this.userLogout();
		this.$router.push({name: RouterName.USER.LOGIN});
	}
}
</script>
<style type="scss" scoped>
    .el-container{
        height: 100%;
    }

    .el-header {
        background-color: #1f2d3d;
        color: white;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #545c64;
        height: 100%;
    }

    .el-main{

    }
</style>

