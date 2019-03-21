import {Euler, Geometry, GLTF, Material, Mesh, Object3D, Vector3} from 'three';
import GLTFLoader from 'three-gltf-loader';
import Materials from './Materials';

interface ObjectPrepInfo {
  name: string;
  done: (gltf: GLTF) => Object3D;
}

const MESHES_DIRECTORY: string = '/meshes/';
const DEFAULT_GET_MESHES = (gltf: GLTF): Mesh[] => {
  return (gltf.scene.children
    .filter((child) => child instanceof Mesh) as Mesh[])
    .map((childMesh: Mesh) => {
      const material = Materials.hasOwnProperty(childMesh.name) ? Materials[childMesh.name] : childMesh.material;
      const geometry = childMesh.geometry;
      const mesh = new Mesh(geometry, material);
      mesh.scale = new Vector3(20, 20, 20);
      mesh.rotation = new Euler(Math.PI / 2, 0, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    });
};

const DEFAULT_GET_OBJECT3D = (gltf: GLTF): Object3D => {
  const object3d = new Object3D();
  object3d.castShadow = true;
  object3d.receiveShadow = true;
  object3d.name = 'unnamed-object';
  object3d.add(...DEFAULT_GET_MESHES(gltf));
  return object3d;
};
const MESHES: ObjectPrepInfo[] = [
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
];

export default class MeshLoader {
  public static getInstance() {
    if (MeshLoader.singleton === null) {
      MeshLoader.singleton = new MeshLoader();
      // @ts-ignore
      window.meshLoader = MeshLoader.singleton;
    }
    return MeshLoader.singleton;
  }

  private static singleton: MeshLoader | null = null;

  public loadingCurrent: number = 0;
  public loadingTotal: number = 0;
  public gltfs: { [k in string]: GLTF } = {};
  public objects: { [k in string]: Object3D } = {};

  private loader: GLTFLoader;
  private onLoadCallbacks: Array<() => void> = [];
  private onProgressCallbacks: Array<(i: number) => void> = [];

  private constructor() {
    this.loadingTotal = MESHES.length;
    this.loader = new GLTFLoader();

    MESHES.forEach(({name, done}: ObjectPrepInfo) => {
      name = name.toUpperCase();
      const path = name + '.glb';
      this.loader.load(
        MESHES_DIRECTORY + path,
        (gltf: GLTF) => {
          this.gltfs[name] = gltf;
          this.objects[name] = done(gltf);
          this.loadingCurrent++;
          if (this.loadingCurrent === this.loadingTotal) {
            this.onLoadCallbacks.forEach((cb) => cb());
          }
          this.onProgressCallbacks.forEach((cb) => cb(this.loadingCurrent));
        },
        (event: ProgressEvent) => {
          return;
        },
        (error: ErrorEvent) => {
          return;
        },
      );
    });
  }

  public onLoad(cb: () => void) {
    this.onLoadCallbacks.push(cb);
  }

  public onProgress(cb: (i: number) => void) {
    this.onProgressCallbacks.push(cb);
  }

  public isLoaded() {
    return this.loadingCurrent === this.loadingTotal;
  }
}
