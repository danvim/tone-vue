import Player from '@/utils/Player';
import {ActionContext, ActionTree, GetterTree, MutationTree} from 'vuex';
import {
  Axial,
  BuildingType,
  BuildMessage,
  EntityType,
  MoveEntityMessage,
  SpawnEntityMessage,
  TileMap
} from 'tone-core/dist/lib';
import LocRot from '@/game/LocRot';
import Thing from '@/game/Thing';
import Building from '@/game/Building';
import Entity from '@/game/Entity';
import {Vector3, Euler} from 'vue-gl/node_modules/three';

export interface RootState {
  version: string;
}

export interface GameState {
  players: Player[];
  map: TileMap;
  ic: number;
  workerPop: number;
  totalPop: number;
  things: {[k in string]: Thing};
}

export interface GameMutation extends MutationTree<GameState> {
  addPlayer(state: GameState, payload: {player: Player}): void;
  removePlayer(state: GameState, payload: {username: string}): void;
  updateMap(s: GameState, payload: { map: TileMap}): void;
  spawnEntity(
    s: GameState,
    payload: {uuid: string, position: Vector3, playerId: number, entityType: EntityType},
    ): void;
  moveEntity(s: GameState, payload: {uuid: string; position: Vector3, rotation: Euler}): void;
  build(
    s: GameState,
    payload: {uuid: string, position: Axial, playerId: number, buildingType: BuildingType, progress: number},
    ): void;
}

export interface GameAction extends ActionTree<GameState, RootState> {
  spawnEntity(injectee: ActionContext<GameState, RootState>, payload: {message: SpawnEntityMessage}): void;
  moveEntity(injectee: ActionContext<GameState, RootState>, payload: {message: MoveEntityMessage}): void;
  build(injectee: ActionContext<GameState, RootState>, payload: {message: BuildMessage}): void;
}

export interface GameGetter extends GetterTree<GameState, RootState> {
  buildingsByUuid: (state: GameState) => {[k in string]: Building};
  buildingsByAxial: (state: GameState) => {[k in string]: Building};
  entities: (state: GameState) => {[k in string]: Entity};
}
