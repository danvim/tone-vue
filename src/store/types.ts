import Player from '@/utils/Player';
import {ActionContext, ActionTree, MutationTree} from 'vuex';
import {MoveEntityMessage, SpawnEntityMessage, TileMap} from 'tone-core/dist/lib';
import EntityInfo from '@/game/EntityInfo';
import LocRot from '@/game/LocRot';

export interface RootState {
  version: string;
}

export interface GameState {
  players: Player[];
  map: TileMap;
  ic: number;
  workerPop: number;
  totalPop: number;
  entityInfos: {[k in string]: EntityInfo};
}

export interface GameMutation extends MutationTree<GameState> {
  addPlayer(state: GameState, payload: {player: Player}): void;
  removePlayer(state: GameState, payload: {username: string}): void;
  updateMap(s: GameState, payload: { map: TileMap}): void;

  updateEntityInfo(s: GameState, payload: { uid: string; locRot: LocRot; playerId: number, model: string }): void;
}

export interface GameAction extends ActionTree<GameState, RootState> {
  spawnEntity(injectee: ActionContext<GameState, RootState>, payload: {message: SpawnEntityMessage}): void;
  moveEntity(injectee: ActionContext<GameState, RootState>, payload: {message: MoveEntityMessage}): void;
}
