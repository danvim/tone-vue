<template>
  <vgl-group :position="positionString" :cast-shadow="true" :receive-shadow="true" name="tile" ref="group">
    <vgl-object3d :cast-shadow="true" :receive-shadow="true" name="tile-obj">
      <vgl-mesh :geometry="geometryName" :material="materialName" :cast-shadow="true" :receive-shadow="true" name="tile-mesh"/>
    </vgl-object3d>
  </vgl-group>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {TileInfo} from 'tone-core/dist/Tiles/Tile';
  import Materials from '@/assets/Materials';

  // @ts-ignore
  // noinspection TypeScriptCheckImport
  import * as Vgl from 'vue-gl';
  import {ExtrudeGeometry, ExtrudeGeometryOptions, Geometry, Material, Shape, Vector3} from 'three';
  import {shapeHex} from '@/utils/shapes';
  import Axial from 'tone-core/dist/Coordinates/Axial';
  import {VglNamespace} from '@/utils/vglHelpers';

  const TILE_SIZE: number = 20;
  const TILE_WIDTH: number = Math.sqrt(3) * TILE_SIZE;
  const TILE_HEIGHT: number = 2 * TILE_SIZE;
  const LEVEL_HEIGHT: number = 5;
  const HEX_SHAPE: Shape = shapeHex(TILE_SIZE);
  const DEFAULT_EXTRUSION_OPTIONS: ExtrudeGeometryOptions = {
    steps: 1,
    bevelEnabled: true,
    bevelSize: 1,
    bevelSegments: 1,
    bevelThickness: 1,
  };

  const {
    VglGroup,
    VglObject3d,
    VglMesh,
  } = Vgl;

  @Component({
    components: {
      VglGroup,
      VglObject3d,
      VglMesh,
    },
  })
  export default class Tile extends Vue {
    @Prop() public axialCoords!: string;
    @Prop() public tileInfo!: TileInfo;

    public materialName: string = 'Dirt';

    public $refs!: {
      group: VglNamespace,
    };

    @Watch('tileInfo', {immediate: true, deep: true})
    private onTileInfoUpdate(n: TileInfo, o: TileInfo = {type: 0, height: 0}) {
      if (n.type !== o.type) {
        // Update building
      }
      if (n.height && n.height !== o.height) {
        // Update height
      }
    }

    get axial(): Axial {
      return Axial.fromString(this.axialCoords);
    }

    get position(): Vector3 {
      const [x, y] = this.axial.toCartesian(TILE_SIZE).asArray;
      return new Vector3(x, y, 0);
    }

    get tileHeight(): number {
      return (this.tileInfo.height || 0) * LEVEL_HEIGHT;
    }

    get geometry(): Geometry {
      return new ExtrudeGeometry(HEX_SHAPE, {
        ...DEFAULT_EXTRUSION_OPTIONS,
        depth: this.tileHeight,
      });
    }

    get positionString(): string {
      const {x, y, z} = this.position;
      return x + ' ' + y + ' ' + z;
    }

    private get geometryName(): string {
      return `tile${this.tileInfo.height}`;
    }

    private mounted() {
      const ns = this.$refs.group.vglNamespace;

      if (ns.geometries[this.geometryName] === undefined) {
        // Cache tile
        ns.geometries[this.geometryName] = this.geometry;
      }

      ns.materials.Dirt = Materials.Dirt;
    }
  }
</script>

<style scoped>

</style>
