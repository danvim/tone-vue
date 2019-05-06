import Thing from '@/game/Thing';
import {Axial, BuildingInterface, BuildingProperty, BuildingType} from 'tone-core/dist/lib';
import {BUILDING_MESH_DICT} from '@/configs/BuildingMeshDict';

export default class Building extends Thing implements BuildingInterface {
  public buildingType: BuildingType;
  public tilePosition: Axial;
  public progress: number;
  public struct: number = 0;
  public training: number = 0;
  public prime: number = 0;

  constructor(
    playerId: number,
    uuid: string,
    buildingType: BuildingType,
    tilePosition: Axial,
    progress: number = 0,
  ) {
    super(BuildingProperty[buildingType].hp, playerId, uuid, BUILDING_MESH_DICT[buildingType]);
    this.buildingType = buildingType;
    this.tilePosition = tilePosition;
    this.progress = progress;

    if (buildingType === BuildingType.SPAWN_POINT) {
      this.invincible = true;
    }
  }
}

export const STORAGE_BUILDINGS: BuildingType[] = [
  BuildingType.BASE,
  BuildingType.BARRACK,
  BuildingType.STRUCT_GENERATOR,
  BuildingType.TRAINING_DATA_GENERATOR,
];

export const INSTANT_BUILDINGS: BuildingType[] = [
  BuildingType.SPAWN_POINT,
  BuildingType.BASE,
];

export enum ResourceType {
  STRUCT,
  TRAINING,
  PRIME,
}

export const ResourceTypeNames: {[k in ResourceType]: string} = {
  [ResourceType.STRUCT]: 'Struct',
  [ResourceType.TRAINING]: 'Training Data',
  [ResourceType.PRIME]: 'Prime Data',
};

export const STORABLE_STORAGE: {[k in number]: ResourceType[]} = {
  [BuildingType.BASE]: [ResourceType.STRUCT, ResourceType.TRAINING, ResourceType.PRIME],
  [BuildingType.BARRACK]: [ResourceType.TRAINING],
  [BuildingType.STRUCT_GENERATOR]: [ResourceType.STRUCT],
  [BuildingType.TRAINING_DATA_GENERATOR]: [ResourceType.TRAINING],
};
