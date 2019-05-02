import Player from '@/utils/Player';
import {MutationTree} from 'vuex';
import {TileMap} from 'tone-core/dist/lib';

export interface RootState {
  version: string;
}

export interface GameState {
  players: Player[];
  map: TileMap;
  ic: number;
  workerPop: number;
  totalPop: number;
}

export interface GameMutation extends MutationTree<GameState> {
  addPlayer(state: GameState, payload: {player: Player}): void;
  removePlayer(state: GameState, payload: {username: string}): void;
  updateMap(s: GameState, payload: { map: TileMap}): void;
}
