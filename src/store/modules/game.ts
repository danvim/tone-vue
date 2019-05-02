import {GameMutation, GameState, RootState} from '@/store/types';
import {Module} from 'vuex';
import Player from '@/utils/Player';
import {Vue} from 'vue-property-decorator';
import {TileMap} from 'tone-core/dist/lib';

export const state: GameState = {
  map: {},
  players: [],
  ic: 0,
  workerPop: 0,
  totalPop: 0,
};

export const mutations: GameMutation = {
  addPlayer(s: GameState, payload: { player: Player }): void {
    window.console.log(payload);
    s.players.push(payload.player);
  },
  removePlayer(s: GameState, payload: { username: string }): void {
    for (let i = 0; i < s.players.length; i++) {
      if (s.players[i].username === payload.username) {
        s.players.splice(i, 1);
        break;
      }
    }
  },
  updateMap(s: GameState, payload: { map: TileMap}) {
    Object.keys(payload.map).forEach((key) => Vue.set(s.map, key, payload.map[key]));
  },
};

export const game: Module<GameState, RootState> = {
  namespaced: true,
  state,
  mutations,
};
