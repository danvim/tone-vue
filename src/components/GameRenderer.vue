<template>
  <div>
    <vgl-namespace ref="vglNs">
      <vgl-scene name="scn">
        <vgl-ambient-light color="#ffeecc"></vgl-ambient-light>
        <vgl-directional-light position="0 1 1"></vgl-directional-light>
        <world-map :map="map"/>
      </vgl-scene>
      <vgl-renderer scene="scn" camera="cmr1" antialias class="field-camera" ref="renderer">
        <vgl-perspective-camera name="cmr1" :orbit-position="cameraOrbitPosition.x + ' ' + cameraOrbitPosition.y + ' ' + cameraOrbitPosition.z"></vgl-perspective-camera>
      </vgl-renderer>
      <vgl-renderer scene="scn" camera="cmr2" antialias class="map-camera">
        <vgl-perspective-camera name="cmr2" orbit-position="60 2 0"></vgl-perspective-camera>
      </vgl-renderer>
    </vgl-namespace>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {TileInfo, TileType} from 'tone-core/dist/Tiles/Tile';

  // @ts-ignore
  // noinspection TypeScriptCheckImport
  import * as Vgl from 'vue-gl';
  import WorldMap from '@/components/WorldMap.vue';
  import MeshLoader from '@/assets/MeshLoader';
  import {Geometry, Material, Object3D, Vector3} from 'three';
  import Materials from '@/assets/Materials';
  import {VglNamespace, VglRenderer} from '@/utils/vglHelpers';
  import {GUI} from 'dat.gui';

  const {
    VglNamespace,
    VglScene,
    VglBoxGeometry,
    VglMesh,
    VglMeshStandardMaterial,
    VglAmbientLight,
    VglDirectionalLight,
    VglRenderer,
    VglPerspectiveCamera,
  } = Vgl;

  @Component({
    components: {
      WorldMap,
      VglNamespace,
      VglScene,
      VglBoxGeometry,
      VglMesh,
      VglMeshStandardMaterial,
      VglAmbientLight,
      VglDirectionalLight,
      VglRenderer,
      VglPerspectiveCamera,
    },
  })
  export default class GameRenderer extends Vue {
    public map: { [k in string]: TileInfo } = {
      '1,2': {
        type: TileType.EMPTY,
        height: 1,
      },
      '0,0': {
        type: TileType.HALL,
        height: 2,
      },
      '0,1': {
        type: TileType.EMPTY,
        height: 3,
      },
      '0,2': {
        type: TileType.EMPTY,
        height: 3,
      },
      '-1,2': {
        type: TileType.EMPTY,
        height: 3,
      },
      '1,0': {
        type: TileType.VOID,
      },
      '1,1': {
        type: TileType.POOL,
        height: 1,
      },
    };
    public cameraOrbitPosition: Vector3 = new Vector3(120, 2, 0);

    public $refs!: {
      vglNs: VglNamespace,
      renderer: VglRenderer,
    };

    public datGUI: GUI = new GUI({
      name: 'Tone Vue',
    });

    private width: number = 0;
    private height: number = 0;
    private meshLoader: MeshLoader = MeshLoader.getInstance();

    private updateWindowDimensions() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    private mounted(): void {
      window.addEventListener('resize', this.updateWindowDimensions);

      const ns = this.$refs.vglNs.vglNamespace;

      this.meshLoader.onLoad(() => {
        const objectStore: {[k in string]: Object3D} = ns.object3ds;
        Object.keys(this.meshLoader.objects).forEach((name: string) => {
           objectStore[name] = this.meshLoader.objects[name];
        });
      });

      // @ts-ignore
      // noinspection TypeScriptUnresolvedVariable
      window.scene = this.$refs.renderer.sceneInst;

      const guiCameraPosition = this.datGUI.addFolder('Camera Position');
      guiCameraPosition.add(this.cameraOrbitPosition, 'x', 0, 360);
      guiCameraPosition.add(this.cameraOrbitPosition, 'y', 0, 2 * Math.PI);
      guiCameraPosition.add(this.cameraOrbitPosition, 'z', 0, 2 * Math.PI);
    }

    private destroyed(): void {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
  }
</script>

<style lang="scss" scoped>
  .field-camera {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
  }

  .map-camera {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 200px;
    height: 140px;
    border: 1px solid #f90;
  }
</style>
