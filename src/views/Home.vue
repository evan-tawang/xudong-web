<template src="./Home.html"></template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Getter, Action} from 'vuex-class';
import RouterName from "@/constant/router-name";
import Menus from "@/constant/menus";
import Types from "@/store/types";

@Component
export default class Home extends Vue {
	private menus = Menus; // 菜单

	@Action(Types.USER.LOGOUT) private userLogout: any;

    private async created() {
    }

	private jump(menu: any) {
		this.$router.push({name: menu.routerName});
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

