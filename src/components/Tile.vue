<template>
  <vgl-group :position="positionString" :cast-shadow="true" :receive-shadow="true" name="tile" ref="group">
    <vgl-object3d :cast-shadow="true" :receive-shadow="true" name="tile-obj">
      <vgl-mesh :geometry="resourceName" :material="resourceName" :cast-shadow="true" :receive-shadow="true" name="tile-mesh"/>
    </vgl-object3d>
  </vgl-group>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {TileInfo, Axial, LEVEL_HEIGHT, TILE_SIZE} from 'tone-core/dist/lib';
  import Materials from '@/assets/Materials';
  import {ExtrudeGeometry, ExtrudeGeometryOptions, Geometry, Material, MeshPhongMaterial, Shape, Vector3} from 'three';
  import {shapeHex} from '@/utils/shapes';
  import {VglNamespace} from '@/utils/vglHelpers';
  import {VglGroup, VglMesh, VglObject3d} from 'vue-gl';

  const HEX_SHAPE: Shape = shapeHex(TILE_SIZE);
  const DEFAULT_EXTRUSION_OPTIONS: ExtrudeGeometryOptions = {
    steps: 1,
    bevelEnabled: true,
    bevelSize: 1,
    bevelSegments: 1,
    bevelThickness: 1,
  };

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
      const [x, z] = this.axial.toCartesian(TILE_SIZE).asArray;
      return new Vector3(x, 0, z);
    }

    get tileHeight(): number {
      return (this.tileInfo.height || 0) * LEVEL_HEIGHT;
    }

    get geometry(): Geometry {
      if (this.tileHeight === 0) {
        return new Geometry();
      }

      return new ExtrudeGeometry(HEX_SHAPE, {
        ...DEFAULT_EXTRUSION_OPTIONS,
        depth: this.tileHeight,
      }).rotateX(-Math.PI / 2);
    }

    get positionString(): string {
      const {x, y, z} = this.position;
      return x + ' ' + y + ' ' + z;
    }

    private get resourceName(): string {
      return `tile${this.tileInfo.height}`;
    }

    private mounted() {
      const ns = this.$refs.group.vglNamespace;

      if (ns.geometries[this.resourceName] === undefined) {
        // Cache tile
        ns.geometries[this.resourceName] = this.geometry;

        const m = ns.materials[this.resourceName] = Materials.Dirt.clone();
        (m as MeshPhongMaterial).color.multiplyScalar((this.tileInfo.height || 0) / 5 + 0.2);
      }
    }
  }
</script>

<style scoped>

</style>
