<template>
  <div>
    <vgl-namespace ref="vglNs">
      <vgl-scene name="scn">
        <vgl-ambient-light color="#ffeecc"></vgl-ambient-light>
        <vgl-directional-light position="0 1 1"></vgl-directional-light>
        <world-map :map="map"/>
      </vgl-scene>
      <div @mousedown.middle.prevent="isCameraRotating = true" @mouseup.middle.prevent="isCameraRotating = false" @mousemove="onDrag" class="field-camera">
        <vgl-renderer scene="scn" camera="cmr1" class="field-camera" antialias ref="renderer">
          <vgl-perspective-camera name="cmr1" :orbit-target="v3(cameraOrbitTarget)" up="0 0 1" :orbit-position="s3(cameraOrbitPosition)"></vgl-perspective-camera>
        </vgl-renderer>
      </div>
      <vgl-renderer scene="scn" camera="cmr2" antialias class="map-camera">
        <vgl-orthographic-camera name="cmr2" orbit-position="30 -40 0" :zoom="0.4"></vgl-orthographic-camera>
      </vgl-renderer>
    </vgl-namespace>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {TileInfo, TileType} from 'tone-core/dist/Tiles/Tile';

  // @ts-ignore
  // noinspection TypeScriptCheckImport
  import WorldMap from '@/components/WorldMap.vue';
  import MeshLoader from '@/assets/MeshLoader';
  import {Matrix4, Object3D, Spherical, Vector2, Vector3} from 'three';
  import {v3, s3, VglNamespace as VglNamespaceX, VglRenderer as VglRendererX} from '@/utils/vglHelpers';
  import {GUI} from 'dat.gui';
  import {
    VglAmbientLight,
    VglBoxGeometry,
    VglDirectionalLight,
    VglMesh,
    VglMeshStandardMaterial,
    VglNamespace,
    VglObject3d,
    VglOrthographicCamera,
    VglPerspectiveCamera,
    VglRenderer,
    VglScene,
  } from 'vue-gl';
  import {panningFactor, pitchMax, pitchMin, rotatingFactor} from '@/configs/CameraMovements';

  @Component({
    components: {
      VglOrthographicCamera,
      VglObject3d,
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
    public cameraOrbitPosition: Spherical = new Spherical(200, Math.PI / 4, 0);
    public cameraOrbitTarget: Vector3 = new Vector3(0, 0, 0);

    public $refs!: {
      vglNs: VglNamespaceX,
      renderer: VglRendererX,
    };

    public datGUI: GUI = new GUI({name: 'Tone Vue'});

    private width: number = 0;
    private height: number = 0;
    private meshLoader: MeshLoader = MeshLoader.getInstance();
    private v3 = v3;
    private s3 = s3;
    private isCameraRotating: boolean = false;

    private ns: VglNamespaceX = this.$refs.vglNs;

    public onDrag(e: MouseEvent): void {
      if (e.buttons === 4 && e.shiftKey) {
        const moveV = new Vector3(-e.movementX, 0, -e.movementY);
        this.cameraOrbitTarget.add(moveV.clone()
          .applyEuler(this.ns.vglNamespace.cameras.cmr1.rotation)
          .setY(0)
          .normalize()
          .multiplyScalar(moveV.length() * panningFactor)
        );
      } else if (e.buttons === 4) {
        this.cameraOrbitPosition.theta -= e.movementX * rotatingFactor;
        this.cameraOrbitPosition.phi = Math.min(
          Math.max(
            pitchMin,
            this.cameraOrbitPosition.phi - e.movementY * rotatingFactor
          ),
          pitchMax
        );
      }
    }

    private updateWindowDimensions() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    private mounted(): void {
      window.addEventListener('resize', this.updateWindowDimensions);

      this.ns = this.$refs.vglNs;

      this.meshLoader.onLoad(() => {
        const objectStore: {[k in string]: Object3D} = this.ns.vglNamespace.object3ds;
        Object.keys(this.meshLoader.objects).forEach((name: string) => {
           objectStore[name] = this.meshLoader.objects[name];
        });
      });

      // @ts-ignore
      // noinspection TypeScriptUnresolvedVariable
      window.scene = this.$refs.renderer.sceneInst;

      const guiCameraOrbitTarget = this.datGUI.addFolder('Camera Orbit Target');
      guiCameraOrbitTarget.add(this.cameraOrbitTarget, 'x', -100, 100);
      guiCameraOrbitTarget.add(this.cameraOrbitTarget, 'y', -100, 100);
      guiCameraOrbitTarget.add(this.cameraOrbitTarget, 'z', -100, 100);
      guiCameraOrbitTarget.open();

      const guiCameraSphericalPosition = this.datGUI.addFolder('Camera Spherical Position');
      guiCameraSphericalPosition.add(this.cameraOrbitPosition, 'radius', 0, 200);
      guiCameraSphericalPosition.add(this.cameraOrbitPosition, 'phi', 0, Math.PI / 2);
      guiCameraSphericalPosition.add(this.cameraOrbitPosition, 'theta', -Math.PI, Math.PI);
      guiCameraSphericalPosition.open();
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
