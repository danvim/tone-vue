<template>
  <div id="app">
    <game-renderer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GameRenderer from '@/components/GameRenderer.vue';
import * as THREE from 'three';

// @ts-ignore
// noinspection TypeScriptUnresolvedVariable
window.THREE = THREE;

@Component({
  components: {
    GameRenderer,
  },
})
export default class App extends Vue {}
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
</style>
