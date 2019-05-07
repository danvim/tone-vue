import {PackageType} from 'tone-core/dist/lib';
<template>
  <vgl-group :position="v3(tilePosition)" :cast-shadow="true" :receive-shadow="true" name="tile" ref="group">
    <vgl-object3d :cast-shadow="true" :receive-shadow="true" name="tile-obj" ref="tileObj">
      <vgl-mesh :geometry="resourceName" :material="heightName" :cast-shadow="true" :receive-shadow="true" name="tile-mesh" ref="tileMesh"/>
    </vgl-object3d>
    <vgl-object3d v-if="building" :position="v3(buildingPosition)" :cast-shadow="true" :receive-shadow="true" name="building">
      <building-c :building="building"/>
    </vgl-object3d>
  </vgl-group>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {Axial, FightingStyle, LEVEL_HEIGHT, PackageType, TILE_SIZE, TileInfo} from 'tone-core/dist/lib';
  import Materials from '@/assets/Materials';
  import {
    Color,
    ExtrudeGeometry,
    ExtrudeGeometryOptions,
    Geometry,
    Group,
    MeshPhongMaterial,
    Object3D,
    Shape,
    Vector3,
  } from 'vue-gl/node_modules/three';
  import {shapeHex} from '@/utils/shapes';
  import {v3, VglObject3d as VglObject3dX} from '@/utils/vglHelpers';
  import {VglGroup, VglMesh, VglObject3d} from 'vue-gl';
  import {closest} from '@/utils/threeHelper';
  import Building from '@/game/Building';
  import {namespace} from 'vuex-class';
  import BuildingC from '@/components/Game/BuildingC.vue';
  import {ACCENTS} from '@/configs/Players';

  const HEX_SHAPE: Shape = shapeHex(TILE_SIZE);
  const DEFAULT_EXTRUSION_OPTIONS: ExtrudeGeometryOptions = {
    steps: 1,
    bevelEnabled: true,
    bevelSize: 1,
    bevelSegments: 1,
    bevelThickness: 1,
  };

  const game = namespace('game');
  const ui = namespace('ui');

  /**
   * This component denotes a single tile given the TileInfo and Axial coordinates that associates with it.
   */
  @Component({
    components: {
      BuildingC,
      VglGroup,
      VglObject3d,
      VglMesh,
    },
  })
  export default class Tile extends Vue {
    @Prop() public axialCoords!: string;
    @Prop() public tileInfo!: TileInfo;
    @game.Getter public buildingsByAxial!: {[k in string]: Building};
    @game.Getter public territoryPlayersByAxial!: {[k in string]: number[]};
    @ui.Mutation public selectTile: any;
    @ui.Mutation public setPromptTarget: any;
    @ui.State public selectedTile!: string;
    @ui.State public promptTarget!: boolean;
    @ui.State public currentStrategy!: FightingStyle;
    @ui.State public attackSource!: string;
    public hovering: boolean = false;

    public $refs!: {
      group: VglObject3dX,
      tileObj: VglObject3dX,
      tileMesh: VglObject3dX,
    };

    private v3 = v3;

    /**
     * Check if this tile is selected from the broadcast object and update i
     * @param group
     */
    public hover(group: Group): void {
      const target = closest(group, 'tile');
      if (target !== null && target === this.$refs.group.inst) {
        // this object is selected
        this.hovering = true;
      }
    }

    public activate(): void {
      if (this.hovering) {
        if (this.promptTarget && this.building) {
          // Attack this tile
          window.protocol.emit(PackageType.TRY_SET_FIGHTING_STYLE, {
            barrackUid: this.attackSource,
            fightingStyle: this.currentStrategy,
            targetUid: this.building.uuid,
          });
          this.setPromptTarget({promptTarget: false});
        }
        this.selectTile({axial: this.axialCoords});
      }
    }

    /**
     * Remove hover
     */
    public offHover() {
      if (this.hovering) {
        this.hovering = false;
      }
    }

    public get selected() {
      return this.selectedTile === this.axialCoords;
    }

    public get axial(): Axial {
      return Axial.fromString(this.axialCoords);
    }

    public get tilePosition(): Vector3 {
      const [x, z] = this.axial.toCartesian(TILE_SIZE).asArray;
      return new Vector3(x, 0, z);
    }

    public get tileHeight(): number {
      return (this.tileInfo.height || 0) * LEVEL_HEIGHT;
    }

    public get buildingPosition(): Vector3 {
      return new Vector3(0, this.tileHeight + 1, 0);
    }

    public get geometry(): Geometry {
      if (this.tileHeight === 0) {
        return new Geometry();
      }

      return new ExtrudeGeometry(HEX_SHAPE, {
        ...DEFAULT_EXTRUSION_OPTIONS,
        depth: this.tileHeight,
      }).rotateX(-Math.PI / 2);
    }

    public get tileObject(): Object3D {
      return this.$refs.tileObj.inst;
    }

    public get tileGroup(): Object3D {
      return this.$refs.group.inst;
    }

    public get tileMesh(): Object3D {
      return this.$refs.tileMesh.inst;
    }

    public get building(): Building | undefined {
      return this.buildingsByAxial[this.axialCoords];
    }

    public get owners(): number[] {
      return this.territoryPlayersByAxial[this.axialCoords] || [];
    }

    private get resourceName(): string {
      return `tile${this.axialCoords}`;
    }

    private get heightName(): string {
      return `tile${this.tileInfo.height + this.owners.toString() + (this.selected ? 'b' : this.hovering ? 'a' : '')}`;
    }

    @Watch('owners', {immediate: true})
    private onOwnershipChange(newOwners: number[]) {
      if (this.$refs.group && newOwners.length > 0) {
        const ns = this.$refs.group.vglNamespace;
        const m = ns.materials[this.heightName] = Materials.Dirt.clone() as MeshPhongMaterial;
        const color = new Color(0xffffff);
        newOwners.forEach((owner) => {
          color.multiply(ACCENTS[owner]);
        });
        m.color.set(color);
        this.makeMaterials();
      }
    }

    private makeMaterials() {
      const ns = this.$refs.group.vglNamespace;
      const m = ns.materials[this.heightName] as MeshPhongMaterial;
      const ma = ns.materials[this.heightName + 'a'] = m.clone();
      const mb = ns.materials[this.heightName + 'b'] = m.clone();
      m.color.multiplyScalar((this.tileInfo.height || 0) / 5 + 0.2);
      ma.color.multiplyScalar((this.tileInfo.height || 0) / 5 + 0.2).add(new Color(0.05, 0.05, 0.05));
      mb.color.add(new Color(0.5, 0.5, 0.5));
    }

    private mounted() {
      const ns = this.$refs.group.vglNamespace;

      this.$refs.group.inst.name = 'tile';

      if (ns.geometries[this.resourceName] === undefined) {
        // Cache tile
        ns.geometries[this.resourceName] = this.geometry;

        const m = ns.materials[this.heightName] = Materials.Dirt.clone() as MeshPhongMaterial;
        this.makeMaterials();
      }
    }
  }
</script>
