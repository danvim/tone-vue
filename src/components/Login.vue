import {PackageType} from 'tone-core/dist/lib';
<template>
  <div class="fs login">
    <div class="fs background"></div>
    <h1 class="title">AI Rebellion</h1>
    <div class="dialog dialog-blue">
      <h1>Login</h1>
      <p>Play as...</p>
      <div class="form-group">
        <input type="text" placeholder="Username..." v-model="username">
      </div>
      <div class="form-group mb-0">
        <button type="button" class="btn btn-blue" @click="tryJoin">Join Lobby</button>
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
  @import "../assets/scss/colors";

  .login {
    flex-direction: column;
    h1 {
      margin-top: 0;
    }
    background: linear-gradient(to bottom, darken($slate, 5), darken($slate, 15));
  }

  .background {
    background: url(/images/loading.png);
    filter: blur(5px);
    opacity: 0.4;
    background-repeat: no-repeat;
    background-position-x: 40%;
  }

  .title {
    color: lighten($blue, 40);
    font-size: 50px;
  }
</style>
