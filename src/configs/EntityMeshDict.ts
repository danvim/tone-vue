import {EntityType} from 'tone-core/dist/lib';

export const ENTITY_MESH_DICT: {[k in EntityType]: string} = {
  [EntityType.WORKER]: 'WORKER',
  [EntityType.SOLDIER_0]: 'SENTINEL',
  [EntityType.SOLDIER_1]: 'SENTINEL',
  [EntityType.SOLDIER_2]: 'SENTINEL',
  [EntityType.SEED]: 'SEED',
  [EntityType.ENEMY_0]: 'ENEMY',
  [EntityType.ENEMY_1]: 'ENEMY',
  [EntityType.ENEMY_2]: 'ENEMY',
  [EntityType.BULLET_0]: 'BULLET',
  [EntityType.BULLET_1]: 'BULLET',
  [EntityType.BULLET_2]: 'BULLET',
};
