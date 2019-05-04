import {Object3D, Vector3} from 'vue-gl/node_modules/three';
import {DEFAULT_GET_OBJECT3D} from '@/utils/GLTF';
import {GLTF} from 'vue-gl/node_modules/three/examples/jsm/loaders/GLTFLoader';

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
    done: DEFAULT_GET_OBJECT3D,
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
