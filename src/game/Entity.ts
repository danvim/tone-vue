import Thing from '@/game/Thing';
import EntityInterfaceT from '@/game/interfaces/EntityInterfaceT';
import {Euler, Vector3} from 'vue-gl/node_modules/three';
import {EntityType} from 'tone-core/dist/lib';
import {ENTITY_MESH_DICT} from '@/configs/EntityMeshDict';

export default class Entity extends Thing implements EntityInterfaceT {
  public position: Vector3;
  public rotation: Euler;
  public entityType: EntityType;
  public nextPosition: Vector3;
  public nextRotation: Euler;

  constructor(hp: number, playerId: number, uuid: string, position: Vector3, rotation: Euler, entityType: EntityType) {
    super(hp, playerId, uuid, ENTITY_MESH_DICT[entityType]);
    this.position = position;
    this.rotation = rotation;
    this.entityType = entityType;
    this.nextPosition = position.clone();
    this.nextRotation = rotation.clone();
  }
}
