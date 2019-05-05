import {ThingInterface} from 'tone-core/lib/Game/Thing';
import {Vector3, Euler} from 'vue-gl/node_modules/three';

export default interface EntityInterfaceT extends ThingInterface {
  position: Vector3;
  rotation: Euler;
}
