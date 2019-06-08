<template src="./Home.html"></template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Getter, Action} from 'vuex-class';

    @Component
    export default class Home extends Vue {
        private key!: number;
        @Action('blankListPageList') private pageList: any;

        private async created() {
            const list = await this.pageList();
            console.log(list);
        }

        private handleOpen(key: any, keyPath: any) {
            this.key = key;
        }

        private handleClose(key: any, keyPath: any) {
            this.key = key;
        }
    }
</script>


