import {Euler, GLTF, Mesh, Object3D, Vector3} from 'three';
import Materials from '@/assets/Materials';


/**
 * Default method for populating an Object3D. This method loads all meshes under the GLTF. For PBR materials with names
 * existing under the Materials module, they will be used instead of that from the GLTF.
 *
 * The models are scaled up 20 times, and set to cast and receive shadows.
 * @param {GLTF} gltf The loaded GLTF file
 * @return Mesh[] Mesh collection
 */
const DEFAULT_GET_MESHES = (gltf: GLTF): Mesh[] =>
  (gltf.scene.children.filter((child) => child instanceof Mesh) as Mesh[])
    .map((childMesh: Mesh) => {
      const material = Materials.hasOwnProperty(childMesh.name) ? Materials[childMesh.name] : childMesh.material;
      const geometry = childMesh.geometry;
      const mesh = new Mesh(geometry, material);
      mesh.scale = new Vector3(20, 20, 20);
      mesh.rotation = new Euler(0, 0, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    });

/**
 * Default method of constructing an Object3D from a loaded GLTF file.
 * @param {GLTF} gltf The loaded GLTF file
 * @return Object3D
 */
export const DEFAULT_GET_OBJECT3D = (gltf: GLTF): Object3D => {
  const object3d = new Object3D();
  object3d.castShadow = true;
  object3d.receiveShadow = true;
  object3d.name = 'unnamed-object';
  object3d.add(...DEFAULT_GET_MESHES(gltf));
  return object3d;
};
