<template>
  <div class="fs center-fs">
    <div class="fs bg bg-1"></div>
    <h1 class="heading">AI Rebellion</h1>
    <div class="dialog dialog-blue">
      <h1>Enter</h1>
      <p>Play as...</p>
      <div class="form-group">
        <input type="text" placeholder="Username..." v-model="username">
      </div>
      <div class="form-group mb-0 center">
        <button type="button" class="btn btn-blue" @click="tryJoin">Join Game</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {PackageType} from 'tone-core/dist/lib';

  @Component({})
  export default class Login extends Vue {
    public username: string = '';

    public tryJoin(): void {
      window.protocol.emit(PackageType.TRY_JOIN_LOBBY, {username: this.username});
    }
  }
</script>

<style scoped lang="scss">

</style>
