import {Object3D} from 'three';

export function closest(o: Object3D, name: string): Object3D | null {
  let p: Object3D | null = o;
  while (p !== null && p.name !== name) {
    p = p.parent;
  }
  return p;
}
