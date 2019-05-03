import {GLTF, Object3D} from 'three';
import GLTFLoader from 'three-gltf-loader';
import {GLTFPrepInfo, GLTFS, GLTFS_DIRECTORY} from '@/configs/Meshes';

/**
 * Singleton class responsible for loading required 3D meshes to THREE format and store them in the global scope.
 */
export default class MeshLoader {

  /**
   * To get an instance of MeshLoader.
   */
  public static getInstance() {
    if (MeshLoader.singleton === null) {
      MeshLoader.singleton = new MeshLoader();
      // @ts-ignore
      window.meshLoader = MeshLoader.singleton;
    }
    return MeshLoader.singleton;
  }

  private static singleton: MeshLoader | null = null;

  /**
   * The currently loaded objects.
   */
  public loadingCurrent: number = 0;

  /**
   * The total objects to be loaded.
   */
  public loadingTotal: number = 0;

  /**
   * All loaded GLTFs.
   */
  public gltfs: { [k in string]: GLTF } = {};

  /**
   * All loaded Object3Ds.
   */
  public objects: { [k in string]: Object3D } = {};

  private loader: GLTFLoader;
  private onLoadCallbacks: Array<() => void> = [];
  private onProgressCallbacks: Array<(i: number) => void> = [];

  private constructor() {
    this.loadingTotal = GLTFS.length;
    this.loader = new GLTFLoader();

    GLTFS.forEach(({name, done}: GLTFPrepInfo) => {
      name = name.toUpperCase();
      const path = name + '.glb';
      this.loader.load(
        GLTFS_DIRECTORY + path,
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
