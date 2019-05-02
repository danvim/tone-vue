import {PackageType} from 'tone-core/dist/lib';
<template>
  <div class="fs">
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
        <world-map :map="map" ref="worldMap"/>
      </vgl-scene>
      <div
        @mousedown.middle.prevent="isCameraRotating = true"
        @mouseup.middle.prevent="isCameraRotating = false"
        @mousemove="onMouseMove"
        @wheel="onWheel"
        @click="onClick"
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
      <side-bar/>
      <div id="mini-map-panel" class="panel">
        <div class="resources">
          <popper :options="popperOptions" :delay-on-mouse-over="500">
            <div class="popper">
              Information Capacity
            </div>
            <div class="resource" slot="reference"><i class="blue tone-ic"></i> <span class="resource-text">{{ic}}</span></div>
          </popper>
          <popper :options="popperOptions" :delay-on-mouse-over="500">
            <div class="popper">
              Workers Population
            </div>
            <div class="resource" slot="reference"><i class="yellow tone-worker"></i> <span class="resource-text">{{workerPop}}/{{totalPop}} ({{workerPercentage}})</span></div>
          </popper>
        </div>
        <vgl-renderer scene="scn" camera="cmr2" antialias class="map-camera">
          <vgl-orthographic-camera ref="miniMapCamera" name="cmr2" orbit-position="30 -40 0" :zoom="0.25"/>
        </vgl-renderer>
      </div>
    </vgl-namespace>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {PackageType, TileMap} from 'tone-core/dist/lib';
  import WorldMap from '@/components/WorldMap.vue';
  import MeshLoader from '@/assets/MeshLoader';
  import {
    AmbientLight,
    Color,
    DirectionalLight,
    HemisphereLight,
    Intersection, Mesh,
    OrthographicCamera,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Spherical,
    Vector2,
    Vector3,
  } from 'three';
  import {
    s3,
    v3,
    VglCamera as VglCameraX,
    VglNamespace as VglNamespaceX,
    VglObject3d as VglObject3dX,
    VglRenderer as VglRendererX,
  } from '@/utils/vglHelpers';
  import {GUI} from 'dat.gui';
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
    rotatingFactor,
    zoomFactor,
    zoomMax,
    zoomMin,
  } from '@/configs/CameraMovements';
  import {namespace} from 'vuex-class/lib/bindings';
  import {gamePopperOptions} from '@/utils/uiHelper';
  import SideBar from '@/components/SideBar.vue';
  // tslint:disable-next-line
  const Popper = require('vue-popperjs');

  const connections = namespace('connections');

  const game = namespace('game');

  @Component({
    components: {
      SideBar,
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
      Popper,
    },
  })
  export default class GameRenderer extends Vue {
    @game.State public map!: TileMap;
    @game.State public ic!: number;
    @game.State public workerPop!: number;
    @game.State public totalPop!: number;
    public cameraDistance: number = 200;
    public cameraTheta: number = 0;
    public cameraPhi: number = Math.PI / 4;
    public cameraOrbitTarget: Vector3 = new Vector3(0, 0, 0);
    public raycaster = new Raycaster();
    public mousePos = new Vector2();

    public $refs!: {
      vglNs: VglNamespaceX;
      renderer: VglRendererX;
      dirLight: VglObject3dX;
      hemisphereLight: VglObject3dX;
      ambientLight: VglObject3dX;
      mainCamera: VglCameraX;
      miniMapCamera: VglCameraX;
      worldMap: WorldMap;
    };

    public datGUI: GUI = new GUI({ name: 'Tone Vue' });

    private width: number = 0;
    private height: number = 0;
    private meshLoader: MeshLoader = MeshLoader.getInstance();
    private v3 = v3;
    private s3 = s3;
    private popperOptions = gamePopperOptions;

    private ns: VglNamespaceX = this.$refs.vglNs;

    public get cameraOrbitPosition(): Spherical {
      return new Spherical(this.cameraDistance, this.cameraPhi, this.cameraTheta);
    }

    private get workerPercentage(): string {
      return `${Math.round(this.workerPop / this.totalPop * 100)}%`;
    }

    private onMouseMove(e: MouseEvent): void {
      const mousePos = new Vector2();
      mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.y = - (e.clientY / window.innerHeight) * 2 + 1;

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

      // Test ray casting
      this.raycaster.setFromCamera(mousePos, this.$refs.mainCamera.inst);
      // const intersects: Intersection[] = this.raycaster.intersectObjects(this.$refs.renderer.sceneInst.children, true);
      const intersects: Intersection[] = this.raycaster.intersectObjects((this.$refs.worldMap as any).tileObjects, true);

      (this.$refs.worldMap as any).broadcastOffHover();
      const intersectMeshes = intersects.filter((intersect) => intersect.object.type === 'Mesh');
      if (intersectMeshes.length > 0) {
        (this.$refs.worldMap as any).broadcastHover(intersectMeshes[0].object);
      }

      this.$refs.renderer.render();
    }

    private onClick(): void {
      (this.$refs.worldMap as any).broadcastSelect();
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

    private setupProtocolListeners() {
      window.protocol.on(PackageType.MOVE_ENTITY, (message, data) => {
        //
      });
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
      this.setupProtocolListeners();
      this.setupGUI();
    }

    private destroyed(): void {
      window.removeEventListener('resize', this.updateWindowDimensions);
      this.datGUI.destroy();
    }
  }
</script>

<style lang="scss" scoped>
</style>
