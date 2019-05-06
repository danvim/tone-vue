import {PackageType} from 'tone-core/dist/lib';
import {PackageType} from 'tone-core/dist/lib';
import {GameScreen} from './utils/GameScreen';
import {GameScreen} from './utils/GameScreen';
import {PackageType} from 'tone-core/dist/lib';
import {PackageType} from 'tone-core/dist/lib';
<template>
  <div id="app">
    <transition name="fade" v-if="currentScreen === GameScreen.LOADING">
      <loading/>
    </transition>
    <transition name="fade" v-else-if="currentScreen === GameScreen.LOGIN">
      <login/>
    </transition>
    <transition name="fade" v-else-if="currentScreen === GameScreen.LOBBY">
      <lobby/>
    </transition>
    <transition name="fade" v-else-if="currentScreen === GameScreen.GAME">
      <game-renderer/>
    </transition>
    <div id="debug-panel" v-show="isShowingDebugInfo">
      <p>Peer ID: {{ peerInfo.id }}</p>
      <p>Connected: {{peerInfo.connections}}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import '@/assets/scss/main.scss';
  import {Component, Vue} from 'vue-property-decorator';
  import GameRenderer from '@/components/GameRenderer.vue';
  import Login from '@/components/Login.vue';
  import Loading from '@/components/Loading.vue';
  import Lobby from '@/components/Lobby.vue';
  import * as THREE from 'vue-gl/node_modules/three';
  import {namespace, State} from 'vuex-class';
  import {
    BuildMessage,
    MoveEntityMessage,
    PackageType,
    SpawnEntityMessage,
    UpdateLobbyMessage,
    UpdateTilesMessage,
  } from 'tone-core/dist/lib';
  import {HOST, PEER_PATH, PORT} from '@/configs/Server';
  import axios from 'axios';
  import {GameScreen} from '@/utils/GameScreen';
  // @ts-ignore
  // noinspection TypeScriptUnresolvedVariable
  window.THREE = THREE;

  const connections = namespace('connections');

  const game = namespace('game');

  @Component({
    components: {
      Lobby,
      Login,
      Loading,
      GameRenderer,
    },
  })
  export default class App extends Vue {
    @State public version!: string;
    @game.Mutation public addPlayer: any;
    @game.Mutation public updateMap: any;
    @game.Action public spawnEntity: any;
    @game.Action public moveEntity: any;
    @game.Action public build: any;

    public currentScreen: GameScreen = GameScreen.LOADING;

    public peerInfo: any = {
      id: '',
      connections: '',
    };

    private isShowingDebugInfo: boolean = false;
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

      this.setupProtocolListeners();
    }

    private setupProtocolListeners() {
      const protocol = window.protocol;

      protocol.on(PackageType.UPDATE_LOBBY, (message, data) => {
        const lobbyMessage = message as UpdateLobbyMessage;
        window.console.log(lobbyMessage);
        if (this.currentScreen !== GameScreen.GAME && lobbyMessage.connId === window.peer.id) {
          this.currentScreen = GameScreen.LOBBY;
        }
        this.addPlayer({
          player: {
            username: lobbyMessage.username,
            playerId: lobbyMessage.playerId,
            connId: lobbyMessage.connId,
          },
        });
      });

      protocol.on(PackageType.UPDATE_TILES, (message, data) => {
        const tilesMessage = message as UpdateTilesMessage;
        this.currentScreen = GameScreen.GAME;
        this.updateMap({
          map: tilesMessage.tiles,
        });
      });

      protocol.on(PackageType.SPAWN_ENTITY, (message, data) => {
        const spawnEntityMessage = message as SpawnEntityMessage;
        this.spawnEntity({message: spawnEntityMessage});
      });

      protocol.on(PackageType.MOVE_ENTITY, (message, data) => {
        const moveEntityMessage = message as MoveEntityMessage;
        this.moveEntity({message: moveEntityMessage});
      });

      protocol.on(PackageType.BUILD, (message, data) => {
        const buildMessage = message as BuildMessage;
        this.build({message: buildMessage});
      });

    }

    private destroyed() {
      window.removeEventListener('keypress', this.onWindowKeyUp);
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
