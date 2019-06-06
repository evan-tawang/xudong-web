<template src="./Home.html"></template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class Home extends Vue {
    private key!: number;

    private handleOpen(key: any, keyPath: any) {
      this.key = key;
    }

    private handleClose(key: any, keyPath: any) {
      this.key = key;
    }
  }
</script>


