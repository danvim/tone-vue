import {Color, Material, Mesh, MeshPhongMaterial, Object3D} from 'three';

export function closest(o: Object3D, name: string): Object3D | null {
  let p: Object3D | null = o;
  while (p !== null && p.name !== name) {
    p = p.parent;
  }
  return p;
}

export function findAllType(o: Object3D, type: string): Object3D[] {
  const results = [];
  o.children.forEach((child) => findAllType(child, type).forEach((p) => results.push(p)));
  if (o.type === type) {
    results.push(o);
  }
  return results;
}

export function applyAccent(o: Object3D, c: Color) {
  const meshes = findAllType(o, 'Mesh') as Mesh[];
  const materials = meshes
    .map((mesh) => mesh.material)
    .filter((material) =>
      !Array.isArray(material) && material.name === 'Player' && material.hasOwnProperty('color'),
    ) as MeshPhongMaterial[];

  materials.forEach((material) => material.color.set(c));
}
