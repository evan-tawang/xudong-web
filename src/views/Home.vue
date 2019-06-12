<template src="./Home.html"></template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {Getter, Action} from "vuex-class";
    import RouterName from "@/constant/router-name";
    import Menus from "@/constant/menus";
    import Types from "@/store/types";

    @Component
    export default class Home extends Vue {
        private menus = Menus; // 菜单
        private isCollapse: boolean = false;
        private pageTitle: string = "xxx管理系统";
        private menuActiveIndex: any = 0;

        @Action(Types.USER.LOGOUT) private userLogout: any;

        private async created() {
            document.title = this.pageTitle;
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

        private activeCurrentModule(to:any, from:any){
            document.title = this.pageTitle;
        }

        @Watch("$route")
        onRouteChange(to:any, from:any) {
            if (to.name != from.name) {
                this.activeCurrentModule(to, from);
            }
        }
    }
</script>
<style lang="scss">
    @import "../assets/css/module/home";
</style>
