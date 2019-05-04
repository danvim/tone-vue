import {GameAction, GameMutation, GameState, RootState} from '@/store/types';
import {Module} from 'vuex';
import {Vue} from 'vue-property-decorator';
import EntityInfo from '@/game/EntityInfo';
import {Euler, Vector3} from 'vue-gl/node_modules/three';
import {ENTITY_MESH_DICT} from '@/configs/EntityMeshDict';

export const state: GameState = {
  map: {},
  players: [],
  ic: 0,
  workerPop: 0,
  totalPop: 0,
  entityInfos: {},
};

export const mutations: GameMutation = {
  addPlayer(s: GameState, {player}): void {
    if (s.players.filter((p) => p.playerId === player.playerId).length === 0) {
      s.players.push(player);
    }
  },
  removePlayer(s: GameState, {username}): void {
    for (let i = 0; i < s.players.length; i++) {
      if (s.players[i].username === username) {
        s.players.splice(i, 1);
        break;
      }
    }
  },
  updateMap(s: GameState, {map}) {
    Object.keys(map).forEach((key) => Vue.set(s.map, key, map[key]));
  },
  updateEntityInfo(s: GameState, {uid, locRot, playerId = -2, model = ''}): void {
    if (!s.entityInfos.hasOwnProperty(uid)) {
      // entityInfos is not carrying this entity
      const newEntityInfo: EntityInfo = {
        model,
        playerId,
        locRot: {position: locRot.position, rotation: locRot.rotation},
        nextLocRot:  {position: locRot.position, rotation: locRot.rotation},
      };
      Vue.set(s.entityInfos, uid, newEntityInfo);
    } else {
      // Update each property individually
      const t = s.entityInfos[uid];
      t.nextLocRot.position = locRot.position;
      t.nextLocRot.rotation = locRot.rotation;
    }
  },
};

export const actions: GameAction = {
  moveEntity({commit}, {message}): void {
    commit('updateEntityInfo', {
      uid: message.uid,
      locRot: {
        position: new Vector3(message.location.x, message.location.y, message.location.z),
        rotation: new Euler(message.pitch, message.yaw, 0),
      },
    });
  },
  spawnEntity({commit}, {message}): void {
    commit('updateEntityInfo', {
      uid: message.uid,
      model: ENTITY_MESH_DICT[message.entityType],
      playerId: message.playerId,
      locRot: {
        position: new Vector3(message.position.x, message.position.y, message.position.z),
        rotation: new Euler(0, 0, 0),
      },
    });
  },
};

export const game: Module<GameState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
