<template>
  <div>
    <vgl-namespace ref="vglNs">
      <vgl-scene name="scn">
        <vgl-hemisphere-light
          ref="hemisphereLight"
          color="#327aff"
          ground-color="#ffc77f"
          :intensity="0.6"
        />
        <vgl-directional-light
          ref="dirLight"
          color="#fff5e8"
          position="3 28.5 6"
          :intensity="1"
          :cast-shadow="true"
        />
        <vgl-ambient-light
          ref="ambientLight"
          color="#ffffff"
          :intensity="1"
        />
        <world-map :map="map"/>
      </vgl-scene>
      <div
        @mousedown.middle.prevent="isCameraRotating = true"
        @mouseup.middle.prevent="isCameraRotating = false"
        @mousemove="onDrag"
        @wheel="onWheel"
        class="field-camera"
      >
        <vgl-renderer
          scene="scn"
          camera="cmr1"
          class="field-camera"
          antialias
          ref="renderer"
          :shadow-map-enabled="true"
        >
          <vgl-perspective-camera
            ref="mainCamera"
            name="cmr1"
            :orbit-target="v3(cameraOrbitTarget)"
            up="0 0 1"
            :orbit-position="s3(cameraOrbitPosition)"
          />
        </vgl-renderer>
      </div>
      <vgl-renderer scene="scn" camera="cmr2" antialias class="map-camera">
        <vgl-orthographic-camera ref="miniMapCamera" name="cmr2" orbit-position="30 -40 0" :zoom="0.4"/>
      </vgl-renderer>
    </vgl-namespace>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PackageType, Protocol, TileInfo } from 'tone-core/dist/lib';
import WorldMap from '@/components/WorldMap.vue';
import MeshLoader from '@/assets/MeshLoader';
import {
  Spherical,
  Vector3,
  Scene,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  OrthographicCamera,
  HemisphereLight,
  Layers, AmbientLight,
} from 'three';
import {
  s3,
  v3,
  VglNamespace as VglNamespaceX,
  VglRenderer as VglRendererX,
  VglObject3d as VglObject3dX,
  VglCamera as VglCameraX,
} from '@/utils/vglHelpers';
import { GUI } from 'dat.gui';
import {
  VglAmbientLight,
  VglBoxGeometry,
  VglDirectionalLight,
  VglHemisphereLight,
  VglMesh,
  VglMeshStandardMaterial,
  VglNamespace,
  VglObject3d,
  VglOrthographicCamera,
  VglPerspectiveCamera,
  VglRenderer,
  VglScene,
} from 'vue-gl';
import {
  panningFactor,
  pitchMax,
  pitchMin,
  rotatingFactor, zoomFactor, zoomMax, zoomMin,
} from '@/configs/CameraMovements';
import { namespace } from 'vuex-class/lib/bindings';
import { DataConnection } from 'peerjs';

const connections = namespace('connections');

@Component({
  components: {
    VglHemisphereLight,
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
  public map: { [k in string]: TileInfo } = {};
  public cameraDistance: number = 200;
  public cameraTheta: number = 0;
  public cameraPhi: number = Math.PI / 4;
  public cameraOrbitTarget: Vector3 = new Vector3(0, 0, 0);

  public $refs!: {
    vglNs: VglNamespaceX;
    renderer: VglRendererX;
    dirLight: VglObject3dX;
    hemisphereLight: VglObject3dX;
    ambientLight: VglObject3dX;
    mainCamera: VglCameraX;
    miniMapCamera: VglCameraX;
  };

  public datGUI: GUI = new GUI({ name: 'Tone Vue' });

  private width: number = 0;
  private height: number = 0;
  private meshLoader: MeshLoader = MeshLoader.getInstance();
  private v3 = v3;
  private s3 = s3;

  private ns: VglNamespaceX = this.$refs.vglNs;

  public get cameraOrbitPosition(): Spherical {
    return new Spherical(this.cameraDistance, this.cameraPhi, this.cameraTheta);
  }

  private onDrag(e: MouseEvent): void {
    if (e.buttons === 4 && e.shiftKey) {
      const moveV = new Vector3(-e.movementX, 0, -e.movementY);
      this.cameraOrbitTarget.add(
        moveV
          .clone()
          .applyEuler(this.ns.vglNamespace.cameras.cmr1.rotation)
          .setY(0)
          .normalize()
          .multiplyScalar(moveV.length() * panningFactor * this.cameraDistance),
      );
    } else if (e.buttons === 4) {
      this.cameraTheta -= e.movementX * rotatingFactor;
      this.cameraPhi = Math.min(
        Math.max(pitchMin, this.cameraPhi - e.movementY * rotatingFactor),
        pitchMax,
      );
    }
  }

  private onWheel(e: WheelEvent): void {
    // Scroll up to zoom in
    this.cameraDistance = Math.min(zoomMax, Math.max(zoomMin, this.cameraDistance + e.deltaY * zoomFactor));
  }

  private updateWindowDimensions(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  private setupGUI(): void {
    const guiCameraOrbitTarget = this.datGUI.addFolder('Camera Orbit Target');
    guiCameraOrbitTarget.add(this.cameraOrbitTarget, 'x', -200, 200);
    guiCameraOrbitTarget.add(this.cameraOrbitTarget, 'y', -200, 200);
    guiCameraOrbitTarget.add(this.cameraOrbitTarget, 'z', -200, 200);

    const guiCameraSphericalPosition = this.datGUI.addFolder(
      'Camera Spherical Position',
    );
    guiCameraSphericalPosition.add(this.cameraOrbitPosition, 'radius', 0, 200);
    guiCameraSphericalPosition.add(
      this.cameraOrbitPosition,
      'phi',
      0,
      Math.PI / 2,
    );
    guiCameraSphericalPosition.add(
      this.cameraOrbitPosition,
      'theta',
      -Math.PI,
      Math.PI,
    );
  }

  private setupConnectionListeners(): void {
    window.protocol.conns.forEach((conn: DataConnection) =>
      conn.on('data', (data) => {
        window.console.log(data);
      }),
    );
    window.protocol.on(PackageType.UPDATE_TILES, (object: any, conn: any) => {
      window.console.log(object);
      this.map = {...this.map, ...object.tiles};
    });
  }

  private setupThreeInjection() {
    // @ts-ignore
    // noinspection TypeScriptUnresolvedVariable
    const scene: Scene = window.scene = this.$refs.renderer.sceneInst;
    scene.background = new Color('#2d2c5b');

    const GAME_LAYER = 0;
    const G_LIGHTS_LAYER = 1;
    const M_LIGHT_LAYER = 2;

    const dirLight: DirectionalLight = this.$refs.dirLight.inst as DirectionalLight;
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;
    dirLight.layers.set(G_LIGHTS_LAYER);

    const hemisphereLight: HemisphereLight = this.$refs.hemisphereLight.inst as HemisphereLight;
    hemisphereLight.layers.set(G_LIGHTS_LAYER);

    const ambientLight: AmbientLight = this.$refs.ambientLight.inst as AmbientLight;
    ambientLight.layers.set(M_LIGHT_LAYER);

    const mainCamera: PerspectiveCamera = this.$refs.mainCamera.inst as PerspectiveCamera;
    mainCamera.layers.set(GAME_LAYER);
    mainCamera.layers.enable(G_LIGHTS_LAYER);

    const miniMap: OrthographicCamera = this.$refs.miniMapCamera.inst as OrthographicCamera;
    miniMap.layers.set(GAME_LAYER);
    miniMap.layers.enable(M_LIGHT_LAYER);
  }

  private mounted(): void {
    window.addEventListener('resize', this.updateWindowDimensions);

    this.ns = this.$refs.vglNs;

    this.meshLoader.onLoad(() =>
      Object.keys(this.meshLoader.objects).forEach(
        (name: string) =>
          (this.ns.vglNamespace.object3ds[name] = this.meshLoader.objects[name]),
      ),
    );

    this.setupThreeInjection();

    this.setupGUI();

    this.setupConnectionListeners();
  }

  private destroyed(): void {
    window.removeEventListener('resize', this.updateWindowDimensions);
    this.datGUI.destroy();
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
