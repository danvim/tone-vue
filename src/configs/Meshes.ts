import {GLTF, Object3D, Vector3} from 'three';
import {DEFAULT_GET_OBJECT3D} from '@/utils/GLTF';

/**
 * Location of where to load the GLTFs from.
 */
export const GLTFS_DIRECTORY: string = '/meshes/';

export interface GLTFPrepInfo {
  name: string;
  done: (gltf: GLTF) => Object3D;
}

/**
 * Hardcoded meshes to be loaded from assets.
 */
export const GLTFS: GLTFPrepInfo[] = [
  {
    name: 'pool',
    done: (gltf: GLTF) => {
      const object3d = DEFAULT_GET_OBJECT3D(gltf);
      object3d.position = new Vector3(0, 0, 1);
      object3d.scale = new Vector3(0.9, 0.9, 0.9);
      object3d.name = 'pool-object';
      return object3d;
    },
  },
  {
    name: 'hall',
    done: DEFAULT_GET_OBJECT3D,
  },
  {
    name: 'worker',
    done: DEFAULT_GET_OBJECT3D,
  },
  {
    name: 'sentinel',
    done: DEFAULT_GET_OBJECT3D,
  },
  {
    name: 'collector',
    done: DEFAULT_GET_OBJECT3D,
  },
];
