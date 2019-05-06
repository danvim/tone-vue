import {Object3D, Vector3} from 'vue-gl/node_modules/three';
import {BUILDING_GET_OBJECT3D, DEFAULT_GET_OBJECT3D} from '@/utils/GLTF';
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
    done: BUILDING_GET_OBJECT3D,
  },
  {
    name: 'hall',
    done: BUILDING_GET_OBJECT3D,
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
    done: BUILDING_GET_OBJECT3D,
  },
  {
    name: 'spawn',
    done: BUILDING_GET_OBJECT3D,
  },
  {
    name: 'barrack',
    done: BUILDING_GET_OBJECT3D,
  },
  {
    name: 'ic',
    done: BUILDING_GET_OBJECT3D,
  },
  {
    name: 'bullet',
    done: DEFAULT_GET_OBJECT3D,
  },
  {
    name: 'reclaimator',
    done: BUILDING_GET_OBJECT3D,
  },
  {
    name: 'training',
    done: BUILDING_GET_OBJECT3D,
  },
];
