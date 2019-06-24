<template src="./Home.html"></template>

<script lang='ts'>
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Getter, Action} from 'vuex-class';
    import RouterName from '@/constant/router-name';
    import Menus from '@/constant/menus';
    import Types from '@/store/types';

    @Component
    export default class Home extends Vue {
        private menus = Menus; // 菜单
        private isCollapse: boolean = false;
        private pageTitle: string = '即时通讯管理系统';
        private welcome : string = ''
        private menuActiveIndex: any = '';

        @Getter private userAgent: any;

        @Action(Types.USER.LOGOUT) private userLogout: any;

        private async created() {
			this.activeMenu(this.$route, null);
            document.title = this.pageTitle;
            this.welcome = '欢迎您，' + this.userAgent.account+ ' ！';
        }

        private jump(menu: any) {
            this.$router.push({name: menu.routerName});
        }

        private logout() {
            this.userLogout();
            this.$router.push({name: RouterName.USER.LOGIN});
        }

        //折叠和展开
        private leftFold() {
            this.isCollapse = !this.isCollapse;
        }

		private activeMenu(to: any, from: any ) {
			this.menuActiveIndex = to.name;
			for (const menu of this.menus) {
				if(menu.routerName == to.name){
					this.pageTitle = menu.text;
					document.title = menu.text;
					break;
                }
            }
		}

        @Watch('$route')
        private onRouteChange(to:any, from:any) {
            if (to.name != from.name) {
				this.activeMenu(to, from);
            }
        }
    }
</script>
<style lang='scss'>
    @import 'home';
</style>
