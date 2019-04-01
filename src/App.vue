import {PackageType} from 'tone-core/dist/lib';
import {PackageType} from 'tone-core/dist/Protocol';
<template>
  <div id="app">
    <game-renderer/>
    <div id="debug-panel" v-show="isShowingDebugInfo">
      <p>Peer ID: {{ peerInfo.id }}</p>
      <p>Connected: {{peerInfo.connections}}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import GameRenderer from '@/components/GameRenderer.vue';
  import * as THREE from 'three';
  import {namespace, State} from 'vuex-class';
  import {PackageType} from 'tone-core/dist/lib';

  // @ts-ignore
  // noinspection TypeScriptUnresolvedVariable
  window.THREE = THREE;

  const connections = namespace('connections');

  @Component({
    components: {
      GameRenderer,
    },
  })
  export default class App extends Vue {
    @State public version!: string;

    public peerInfo: any = {
      id: '',
      connections: '',
    };

    private isShowingDebugInfo: boolean = true;

    private onWindowKeyUp(e: KeyboardEvent) {
      if (e.code === 'Backquote') {
        this.isShowingDebugInfo = !this.isShowingDebugInfo;
      }
    }

    private mounted() {
      window.protocol.emit(PackageType.TRY_START_GAME, {});

      setInterval(() => {
        Vue.set(this.peerInfo, 'id', window.peer.id);
        Vue.set(this.peerInfo, 'connections', Object.keys(window.peer.connections).join(', '));
      }, 500);

      window.addEventListener('keypress', this.onWindowKeyUp);
    }

    private destroyed() {
      window.removeEventListener('keypress', this.onWindowKeyUp);
    }
  }
</script>

<style lang="scss">
  html, body {
    margin:0;
    padding:0;
    overflow: hidden;
  }
  * {
    box-sizing: border-box;
  }
  canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }

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
