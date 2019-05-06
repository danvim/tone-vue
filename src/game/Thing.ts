import {ThingInterface} from 'tone-core/dist/lib';

export default class Thing implements ThingInterface {
  public hp: number;
  public playerId: number;
  public uuid: string;
  public model: string;
  public invincible: boolean = false;

  constructor(hp: number, playerId: number, uuid: string, model: string) {
    this.hp = hp;
    this.playerId = playerId;
    this.uuid = uuid;
    this.model = model;
  }
}
