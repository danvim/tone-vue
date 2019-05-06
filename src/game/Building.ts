import Thing from '@/game/Thing';
import {Axial, BuildingInterface, BuildingProperty, BuildingType} from 'tone-core/dist/lib';
import {BUILDING_MESH_DICT} from '@/configs/BuildingMeshDict';

export default class Building extends Thing implements BuildingInterface {
  public buildingType: BuildingType;
  public tilePosition: Axial;
  public progress: number;

  constructor(
    playerId: number,
    uuid: string,
    buildingType: BuildingType,
    tilePosition: Axial,
    progress: number = 0,
  ) {
    super(BuildingProperty[buildingType].struct, playerId, uuid, BUILDING_MESH_DICT[buildingType]);
    this.buildingType = buildingType;
    this.tilePosition = tilePosition;
    this.progress = progress;
  }
}
