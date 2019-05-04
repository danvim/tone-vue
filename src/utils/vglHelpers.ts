import {Vue} from 'vue-property-decorator';
import {
  Camera,
  Euler,
  Geometry,
  Material,
  Object3D,
  Quaternion,
  Scene,
  Spherical,
  Vector3,
} from 'vue-gl/node_modules/three';

export interface Namespace {
  object3ds: { [k in string]: Object3D };
  materials: { [k in string]: Material };
  geometries: { [k in string]: Geometry };
  cameras: { [k in string]: Camera };
}

export interface VglNamespace extends Vue {
  vglNamespace: Namespace;
}

export interface VglRenderer extends Vue {
  sceneInst: Scene;

  render(): void;
}

export interface VglObject3d extends VglNamespace {
  inst: Object3D;
  position: Vector3;
  rotation: Euler;
  rotationQuaternion: Quaternion;
  scale: Vector3;
  castShadow: boolean;
  receiveShadow: boolean;
  name: string;
  visible: {
    type: boolean,
    default: true,
  };
}

export interface VglCamera extends VglObject3d {
  inst: Camera;
  orbitTarget: Vector3;
  orbitPosition: Spherical;
}

export function v3(v: Vector3 | Euler): string {
  return v.x + ' ' + v.y + ' ' + v.z;
}

export function s3(v: Spherical): string {
  return v.radius + ' ' + v.phi + ' ' + v.theta;
}
