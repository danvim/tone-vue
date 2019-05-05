import Thing from '@/game/Thing';
import {Axial, BuildingInterface, BuildingType} from 'tone-core/dist/lib';
import {BUILDING_MESH_DICT} from '@/configs/BuildingMeshDict';

export default class Building extends Thing implements BuildingInterface {
  public buildingType: BuildingType;
  public tilePosition: Axial;

  constructor(
    hp: number,
    playerId: number,
    uuid: string,
    buildingType: BuildingType,
    tilePosition: Axial,
  ) {
    super(hp, playerId, uuid, BUILDING_MESH_DICT[buildingType]);
    this.buildingType = buildingType;
    this.tilePosition = tilePosition;
  }
}
