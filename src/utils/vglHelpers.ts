import {Vue} from 'vue-property-decorator';
import {Geometry, Material, Object3D, Scene} from 'three';

export interface VglNamespace extends Vue {
  vglNamespace: {
    object3ds: {[k in string]: Object3D},
    materials: {[k in string]: Material},
    geometries: {[k in string]: Geometry},
  };
}

export interface VglRenderer extends Vue {
  sceneInst: Scene;
}
