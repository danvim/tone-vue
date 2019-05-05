import {BuildingType} from 'tone-core/dist/lib';

export const BUILDING_MESH_DICT: {[k in BuildingType]: string} = {
  [BuildingType.BASE]: 'HALL',
  [BuildingType.SPAWN_POINT]: 'SPAWN',
  [BuildingType.STRUCT_GENERATOR]: 'COLLECTOR',
  [BuildingType.RECLAIMATOR]: 'RECLAIMATOR',
  [BuildingType.BARRACK]: 'BARRACK',
  [BuildingType.TRAINING_DATA_GENERATOR]: 'TRAINING',
  [BuildingType.PRIME_DATA_GENERATOR]: '',
  [BuildingType.SHIELD_GENERATOR]: '',
  [BuildingType.ATTACK_PLANT]: '',
  [BuildingType.GROWING_PLANT]: '',
  [BuildingType.GROWING_MOTHER]: '',
  [BuildingType.REPAIR_PLANT]: '',
};
