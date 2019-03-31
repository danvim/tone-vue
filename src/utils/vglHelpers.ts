import {Vue} from 'vue-property-decorator';
import {Camera, Geometry, Material, Object3D, Scene, Spherical, Vector3} from 'three';

export interface VglNamespace extends Vue {
  vglNamespace: {
    object3ds: {[k in string]: Object3D},
    materials: {[k in string]: Material},
    geometries: {[k in string]: Geometry},
    cameras: {[k in string]: Camera},
  };
}

export interface VglRenderer extends Vue {
  sceneInst: Scene;
}

export function v3(v: Vector3): string {
  return v.x + ' ' + v.y + ' ' + v.z;
}

export function s3(v: Spherical): string {
  return v.radius + ' ' + v.phi + ' ' + v.theta;
}
