import {GameScreen} from './utils/GameScreen';
import {PackageType} from 'tone-core/dist/lib';
import {GameScreen} from './utils/GameScreen';
<template>
  <div id="app">
    <loading v-if="currentScreen === GameScreen.LOADING"/>
    <login v-else-if="currentScreen === GameScreen.LOGIN"/>
    <div v-else-if="currentScreen === GameScreen.LOBBY"></div>
    <game-renderer v-else-if="currentScreen === GameScreen.GAME"/>
    <div id="debug-panel" v-show="isShowingDebugInfo">
      <p>Peer ID: {{ peerInfo.id }}</p>
      <p>Connected: {{peerInfo.connections}}</p>
      <button @click="startGame()">Start Game</button>
    </div>
  </div>
</template>

<script lang="ts">
  import '@/assets/scss/main.scss';
  import {Component, Vue} from 'vue-property-decorator';
  import GameRenderer from '@/components/GameRenderer.vue';
  import Login from '@/components/Login.vue';
  import Loading from '@/components/Loading.vue';
  import * as THREE from 'three';
  import {namespace, State} from 'vuex-class';
  import {PackageType, UpdateLobbyMessage} from 'tone-core/dist/lib';
  import {HOST, PEER_PATH, PORT} from '@/configs/Server';
  import axios from 'axios';
  import {GameScreen} from '@/utils/GameScreen';
  // @ts-ignore
  // noinspection TypeScriptUnresolvedVariable
  window.THREE = THREE;

  const connections = namespace('connections');

  @Component({
    components: {
      Login,
      Loading,
      GameRenderer,
    },
  })
  export default class App extends Vue {
    @State public version!: string;
    public currentScreen: GameScreen = GameScreen.LOADING;

    public peerInfo: any = {
      id: '',
      connections: '',
    };

    private isShowingDebugInfo: boolean = true;
    private GameScreen = GameScreen;

    private onWindowKeyUp(e: KeyboardEvent) {
      if (e.code === 'Backquote') {
        this.isShowingDebugInfo = !this.isShowingDebugInfo;
      }
    }

    private mounted() {
      const peerConn = window.peerConn;
      const protocol = window.protocol;

      axios.get(`http://${HOST}:${PORT}${PEER_PATH}`)
        .then(() => {
          peerConn.on('open', () => {
            window.console.log('Connection to server!');
            peerConn.on('data', (data) => {
              window.console.log('peerConn', data);
            });
            protocol.add(peerConn);
            this.currentScreen = GameScreen.LOGIN;
          });
          peerConn.on('error', (e) => {
            window.alert(e);
          });
        })
        .catch((e) => {
          window.alert('Cannot connect to server');
        });

      setInterval(() => {
        Vue.set(this.peerInfo, 'id', window.peer.id);
        Vue.set(this.peerInfo, 'connections', Object.keys(window.peer.connections).join(', '));
      }, 500);

      window.addEventListener('keypress', this.onWindowKeyUp);

      window.protocol.on(PackageType.UPDATE_LOBBY, (message, data) => {
        const lobbyMessage = (message as UpdateLobbyMessage);
        window.console.log(lobbyMessage);
        this.currentScreen = GameScreen.LOBBY;
      });
    }

    private destroyed() {
      window.removeEventListener('keypress', this.onWindowKeyUp);
    }

    private startGame() {
      window.console.log('start game');
      window.protocol.emit(PackageType.TRY_START_GAME, {});
    }
  }
</script>

<style lang="scss">
  #debug-panel {
    position:absolute;
    top:0;
    left:0;
    height: 200px;
    width: 300px;
    background-color: #fff;
    opacity: 0.5;
    color: #000;
    font-size: 10px;
    padding: 5px 10px;
    overflow-y: auto;
  }
</style>
