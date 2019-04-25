<template>
  <div class="fs center-fs">
    <div class="fs bg bg-2"></div>
    <h1 class="heading">Lobby</h1>
    <div class="dialog dialog-blue">
      <div class="form-group mb-0">
        <div class="form-group">
          <table>
            <thead>
              <tr>
                <th>Players</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="player in players">
              <td :class="{active: isCurrentPlayer(player)}">{{player.username}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="form-group mb-0 center">
          <button type="button" class="btn btn-blue" @click="tryStart">Start Game</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {PackageType} from 'tone-core/dist/lib';
  import {namespace} from 'vuex-class';
  import Player from '@/utils/Player';

  const game = namespace('game');

  @Component({})
  export default class Lobby extends Vue {
    @game.State public players!: Player[];

    public tryStart(): void {
      window.console.log('start game');
      window.protocol.emit(PackageType.TRY_START_GAME, {});
    }

    public isCurrentPlayer(player: Player): boolean {
      return player.connId === window.peer.id;
    }
  }
</script>

<style scoped lang="scss">

</style>
