<template>
  <vgl-group name="world-map">
    <tile v-for="(tileInfo, key) in map" :tile-info="tileInfo" :axialCoords="key" :key="key" ref="tiles"/>
  </vgl-group>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {TileInfo} from 'tone-core/dist/lib';

  // @ts-ignore
  // noinspection TypeScriptCheckImport
  import * as Vgl from 'vue-gl';
  import Tile from '@/components/Game/Tile.vue';
  import {Object3D} from 'vue-gl/node_modules/three';

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

    public $refs!: {
      tiles: Tile[];
    };

    public get tileGroups(): Object3D[] {
      return this.$refs.tiles.map((tileV: any) => tileV.tileGroup);
    }

    public get tileObjects(): Object3D[] {
      return this.$refs.tiles.map((tileV: any) => tileV.tileObject);
    }

    public get tileMeshes(): Object3D[] {
      return this.$refs.tiles.map((tileV: any) => tileV.tileMesh);
    }

    public broadcastHover(group: Object3D): void {
      this.$refs.tiles.forEach((tile: any) => tile.hover(group));
    }

    public broadcastOffHover(): void {
      this.$refs.tiles.forEach((tile: any) => tile.offHover());
    }

    public broadcastSelect(): void {
      this.$refs.tiles.forEach((tile: any) => {tile.activate(); });
    }
  }
</script>

<style scoped>

</style>
