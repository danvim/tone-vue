import Player from '@/utils/Player';
import {ActionContext, ActionTree, GetterTree, MutationTree} from 'vuex';
import {
  Axial,
  BuildingType,
  BuildMessage,
  EntityType, FightingStyle,
  MoveEntityMessage,
  SpawnEntityMessage,
  TileMap,
  UpdateHealthMessage, UpdateJobMessage, UpdateResourceStorageMessage,
} from 'tone-core/dist/lib';
import Thing from '@/game/Thing';
import Building from '@/game/Building';
import Entity from '@/game/Entity';
import {Vector3, Euler} from 'vue-gl/node_modules/three';

export interface RootState {
  version: string;
}

export interface GameState {
  me: Player | null;
  players: Player[];
  map: TileMap;
  ic: number;
  workerPop: number;
  totalPop: number;
  things: {[k in string]: Thing};
  jobs: {[k in string]: UpdateJobMessage};
}

export interface GameMutation extends MutationTree<GameState> {
  setMyself(state: GameState, payload: {player: Player}): void;
  addPlayer(state: GameState, payload: {player: Player}): void;
  removePlayer(state: GameState, payload: {username: string}): void;
  updateMap(s: GameState, payload: { map: TileMap}): void;
  spawnEntity(s: GameState, payload: {
    messages: Array<{uuid: string, position: Vector3, playerId: number, entityType: EntityType}>,
  }): void;
  moveEntity(s: GameState, payload: {messages: Array<{uuid: string; position: Vector3, rotation: Euler}>}): void;
  build(s: GameState, payload: {
      messages: Array<{uuid: string, position: Axial, playerId: number, buildingType: BuildingType, progress: number}>,
  }): void;
  updateHealth(s: GameState, payload: {messages: Array<{uuid: string, hp: number}>}): void;
  updateResourceStorage(s: GameState, payload: {
    messages: Array<{uuid: string, struct: number, training: number, prime: number}>,
  }): void;
  updateJob(s: GameState, payload: {messages: UpdateJobMessage[]}): void;
}

type I = ActionContext<GameState, RootState>;

export interface GameAction extends ActionTree<GameState, RootState> {
  spawnEntity(injectee: I, payload: {messages: SpawnEntityMessage[]}): void;
  moveEntity(injectee: I, payload: {messages: MoveEntityMessage[]}): void;
  build(injectee: I, payload: {messages: BuildMessage[]}): void;
  updateHealth(injectee: I, payload: {messages: UpdateHealthMessage[]}): void;
  updateResourceStorage(injectee: I, payload: {messages: UpdateResourceStorageMessage[]}): void;
}

export interface GameGetter extends GetterTree<GameState, RootState> {
  buildingsByUuid: (state: GameState) => {[k in string]: Building};
  buildingsByAxial: (state: GameState) => {[k in string]: Building};
  buildingsByType: (state: GameState) => {[k in number]: Building[]};
  entities: (state: GameState) => {[k in string]: Entity};
  myTotalPop: (state: GameState, getters: {entities: {[k in string]: Entity}}) => number;
  myWorkerPop: (state: GameState, getters: {entities: {[k in string]: Entity}}) => number;
  territoryPlayersByAxial:
    (state: GameState, getters: {buildingsByType: {[k in number]: Building[]}}) => {[k in string]: number[]};
}

export interface UIState {
  selectedTile: string;
  showingJobs: boolean;
  promptTarget: boolean;
  currentStrategy: FightingStyle;
  attackSource: string;
}

export interface UIMutation extends MutationTree<UIState> {
  selectTile(s: UIState, payload: {axial: string}): void;
  setShowingJobs(s: UIState, payload: {showingJobs: boolean}): void;
  setPromptTarget(s: UIState, payload: {promptTarget: boolean}): void;
  setAttackSource(s: UIState, payload: {attackSource: string}): void;
  setFightingStyle(s: UIState, payload: {fightingStyle: FightingStyle}): void;
}
