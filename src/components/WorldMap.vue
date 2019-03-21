<template>
  <vgl-group name="world-map">
    <tile v-for="(tileInfo, key) in map" :tile-info="tileInfo" :axialCoords="key" :key="key"/>
  </vgl-group>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {TileInfo} from 'tone-core/dist/Tiles/Tile';

  // @ts-ignore
  // noinspection TypeScriptCheckImport
  import * as Vgl from 'vue-gl';
  import Tile from '@/components/Tile.vue';

  const {
    VglGroup,
  } = Vgl;

  @Component({
    components: {
      Tile,
      VglGroup,
    },
  })
  export default class WorldMap extends Vue {
    @Prop() public map!: {[k in string]: TileInfo};
  }
</script>

<style scoped>

</style>
