import {EntityType} from 'tone-core/dist/lib';

export const ENTITY_MESH_DICT: {[k in EntityType]: string} = {
  [EntityType.WORKER]: 'worker',
  [EntityType.SOLDIER_0]: 'sentinel',
  [EntityType.SOLDIER_1]: 'sentinel',
  [EntityType.SOLDIER_2]: 'sentinel',
  [EntityType.SEED]: 'seed',
  [EntityType.ENEMY_0]: 'enemy',
  [EntityType.ENEMY_1]: 'enemy',
  [EntityType.ENEMY_2]: 'enemy',
  [EntityType.BULLET_0]: 'bullet',
  [EntityType.BULLET_1]: 'bullet',
  [EntityType.BULLET_2]: 'bullet',
};
