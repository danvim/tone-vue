import {PackageType} from 'tone-core/lib/Protocol/PackageType';
import {PackageType} from 'tone-core/dist/Protocol';
<template>
  <div>
    <vgl-namespace ref="vglNs">
      <vgl-scene name="scn">
        <vgl-hemisphere-light color="#327aff" ground-color="#ffc77f" :intensity="0.6"/>
        <vgl-directional-light
          color="#fff5e8"
          position="3 28.5 6"
          :intensity="1"
          :cast-shadow="true"
        />
        <world-map :map="map"/>
      </vgl-scene>
      <div
        @mousedown.middle.prevent="isCameraRotating = true"
        @mouseup.middle.prevent="isCameraRotating = false"
        @mousemove="onDrag"
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
            name="cmr1"
            :orbit-target="v3(cameraOrbitTarget)"
            up="0 0 1"
            :orbit-position="s3(cameraOrbitPosition)"
          ></vgl-perspective-camera>
        </vgl-renderer>
      </div>
      <vgl-renderer scene="scn" camera="cmr2" antialias class="map-camera">
        <vgl-orthographic-camera name="cmr2" orbit-position="30 -40 0" :zoom="0.4"></vgl-orthographic-camera>
      </vgl-renderer>
    </vgl-namespace>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PackageType, Protocol, TileInfo } from "tone-core/dist/lib";
import WorldMap from "@/components/WorldMap.vue";
import MeshLoader from "@/assets/MeshLoader";
import { Spherical, Vector3 } from "three";
import {
  s3,
  v3,
  VglNamespace as VglNamespaceX,
  VglRenderer as VglRendererX
} from "@/utils/vglHelpers";
import { GUI } from "dat.gui";
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
  VglScene
} from "vue-gl";
import {
  panningFactor,
  pitchMax,
  pitchMin,
  rotatingFactor
} from "@/configs/CameraMovements";
import { namespace } from "vuex-class/lib/bindings";
import { DataConnection } from "peerjs";

const connections = namespace("connections");

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
    VglPerspectiveCamera
  }
})
export default class GameRenderer extends Vue {
  public map: { [k in string]: TileInfo } = {};
  public cameraOrbitPosition: Spherical = new Spherical(200, Math.PI / 4, 0);
  public cameraOrbitTarget: Vector3 = new Vector3(0, 0, 0);

  public $refs!: {
    vglNs: VglNamespaceX;
    renderer: VglRendererX;
  };

  public datGUI: GUI = new GUI({ name: "Tone Vue" });

  private width: number = 0;
  private height: number = 0;
  private meshLoader: MeshLoader = MeshLoader.getInstance();
  private v3 = v3;
  private s3 = s3;

  private ns: VglNamespaceX = this.$refs.vglNs;

  public onDrag(e: MouseEvent): void {
    if (e.buttons === 4 && e.shiftKey) {
      const moveV = new Vector3(-e.movementX, 0, -e.movementY);
      this.cameraOrbitTarget.add(
        moveV
          .clone()
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

  private setupGUI(): void {
    const guiCameraOrbitTarget = this.datGUI.addFolder("Camera Orbit Target");
    guiCameraOrbitTarget.add(this.cameraOrbitTarget, "x", -200, 200);
    guiCameraOrbitTarget.add(this.cameraOrbitTarget, "y", -200, 200);
    guiCameraOrbitTarget.add(this.cameraOrbitTarget, "z", -200, 200);

    const guiCameraSphericalPosition = this.datGUI.addFolder(
      "Camera Spherical Position"
    );
    guiCameraSphericalPosition.add(this.cameraOrbitPosition, "radius", 0, 200);
    guiCameraSphericalPosition.add(
      this.cameraOrbitPosition,
      "phi",
      0,
      Math.PI / 2
    );
    guiCameraSphericalPosition.add(
      this.cameraOrbitPosition,
      "theta",
      -Math.PI,
      Math.PI
    );
  }

  private setupConnectionListeners(): void {
    window.protocol.conns.forEach((conn: DataConnection) =>
      conn.on("data", data => {
        window.console.log(data);
      })
    );
    window.protocol.on(PackageType.UPDATE_TILES,(object: any, conn: any)=>{
      window.console.log(object);
      this.map = {...this.map, ...object.tiles};
    })
  }

  private mounted(): void {
    window.addEventListener("resize", this.updateWindowDimensions);

    this.ns = this.$refs.vglNs;

    this.meshLoader.onLoad(() =>
      Object.keys(this.meshLoader.objects).forEach(
        (name: string) =>
          (this.ns.vglNamespace.object3ds[name] = this.meshLoader.objects[name])
      )
    );

    // @ts-ignore
    // noinspection TypeScriptUnresolvedVariable
    window.scene = this.$refs.renderer.sceneInst;

    this.setupGUI();

    this.setupConnectionListeners();
  }

  private destroyed(): void {
    window.removeEventListener("resize", this.updateWindowDimensions);
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
