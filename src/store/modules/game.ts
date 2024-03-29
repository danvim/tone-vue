import {GameAction, GameGetter, GameMutation, GameState, RootState} from '@/store/types';
import {Module} from 'vuex';
import {Vue} from 'vue-property-decorator';
import {Euler, Vector3} from 'vue-gl/node_modules/three';
import Building from '@/game/Building';
import Entity from '@/game/Entity';
import {POP_ENTITIES} from '@/configs/EntityMeshDict';
import {BuildingProperty, BuildingType, EntityType, JobPriority, TERRITORY_RADIUS} from 'tone-core/dist/lib';
import Player from '@/utils/Player';

export const state: GameState = {
  me: null,
  map: {},
  players: [],
  ic: 0,
  workerPop: 0,
  totalPop: 0,
  things: {},
  jobs: {},
};

export const mutations: GameMutation = {
  setMyself(s: GameState, { player }): void {
    s.me = player;
  },
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
  spawnEntity({things}, {messages}): void {
    messages.forEach(({uuid, position, playerId = -2, entityType}) => {
      if (!things.hasOwnProperty(uuid)) {
        Vue.set(things, uuid, new Entity(1, playerId, uuid, position, new Euler(0, 0, 0), entityType));
      }
    });
  },
  moveEntity({things}, {messages}): void {
    messages.forEach(({uuid, position, rotation}) => {
      if (!things.hasOwnProperty(uuid)) {
        window.console.error(`Things does not contain uuid ${uuid}`);
        return;
      }
      if (!(things[uuid] instanceof Entity)) {
        window.console.error(`Thing with uuid ${uuid} is not an entity`);
        return;
      }
      const t = things[uuid] as Entity;
      t.nextPosition = position;
      t.nextRotation = rotation;
    });
  },
  build({things}, {messages}): void {
    messages.forEach(({uuid, position, buildingType, playerId, progress}) => {
      if (!things.hasOwnProperty(uuid)) {
        Vue.set(things, uuid, new Building(playerId, uuid, buildingType, position, progress));
      } else {
        // progressing
        if (!(things[uuid] instanceof Building)) {
          window.console.error(`Thing with uuid ${uuid} is not a building`);
          return;
        }
        const t = things[uuid] as Building;
        t.progress = progress;
      }
    });
  },
  updateHealth({things}, {messages}): void {
    messages.forEach(({ uuid, hp }) => {
      if (!things.hasOwnProperty(uuid)) {
        window.console.error(`Things does not contain uuid ${uuid}`);
        return;
      }
      const t = things[uuid];
      t.hp = hp;
      if (!t.invincible && t.hp <= 0) {
        Vue.delete(things, uuid);
      }
    });
  },
  updateResourceStorage({things}, {messages}): void {
    messages.forEach(({ uuid, struct, training, prime }) => {
      if (!things.hasOwnProperty(uuid)) {
        window.console.error(`Things does not contain uuid ${uuid}`);
        return;
      }
      if (!(things[uuid] instanceof Building)) {
        window.console.error(`Thing with uuid ${uuid} is not a building`);
        return;
      }
      const t = things[uuid] as Building;
      t.struct = struct;
      t.training = training;
      t.prime = prime;
    });
  },
  updateJob({jobs}, { messages }): void {
    messages.forEach((message) => {
      if (message.priority !== JobPriority.SUSPENDED) {
        Vue.set(jobs, message.jobId, message);
      } else {
        Vue.delete(jobs, message.jobId);
      }
    });
  },
};

export const actions: GameAction = {
  moveEntity({commit}, {messages}): void {
    commit('moveEntity', {messages: messages.map((message) => {
        return {
          uuid: message.uid,
          position: new Vector3(message.location.x, message.location.y, message.location.z),
          rotation: new Euler(message.pitch, message.yaw, 0),
        };
      })});
  },
  spawnEntity({commit}, {messages}): void {
    commit('spawnEntity', {messages: messages.map((message) => {
        return {
          uuid: message.uid,
          position: new Vector3(message.position.x, message.position.y, message.position.z),
          playerId: message.playerId,
          entityType: message.entityType,
        };
      })});
  },
  build({commit}, {messages}): void {
    commit('build', {messages: messages.map((message) => {
        return {
          uuid: message.uid,
          position: message.axialCoords[0].toAxial(),
          buildingType: message.buildingType,
          playerId: message.playerId,
          progress: message.progress,
        };
      })});
  },
  updateHealth({commit}, { messages }): void {
    commit('updateHealth', {messages: messages.map((message) => {
        return {
          uuid: message.uid,
          hp: message.hp,
        };
      })});
  },
  updateResourceStorage({commit}, { messages }): void {
    commit('updateResourceStorage', {messages: messages.map((message) => {
        return {
          uuid: message.uid,
          struct: message.struct,
          training: message.trainingData,
          prime: message.primeData,
        };
      })});
  },
};

export const getters: GameGetter = {
  myTotalPop: (s, {entities}) => {
    if (s.me !== null) {
      return Object.keys(entities).filter((key) =>
        entities[key].playerId === s.me!.playerId &&
        POP_ENTITIES.includes(entities[key].entityType),
      ).length;
    }
    return 1;
  },
  myWorkerPop: (s, {entities}) => {
    if (s.me !== null) {
      return Object.keys(entities).filter((key) =>
        entities[key].playerId === s.me!.playerId &&
        entities[key].entityType === EntityType.WORKER,
      ).length;
    }
    return 1;
  },
  buildingsByUuid: ({things}) => {
    const results: {[k in string]: Building} = {};
    Object.keys(things).forEach((key) => {
      if (things[key] instanceof Building) {
        results[key] = things[key] as Building;
      }
    });
    return results;
  },
  buildingsByAxial: ({things}) => {
    const results: {[k in string]: Building} = {};
    Object.keys(things).forEach((key) => {
      if (things[key] instanceof Building) {
        const bld = things[key] as Building;
        results[bld.tilePosition.asString] = bld;
      }
    });
    return results;
  },
  buildingsByType: ({things}) => {
    const results: {[k in number]: Building[]} = {};
    Object.keys(BuildingType)
      .filter((key: any) => !isNaN(key))
      .forEach((k: any) => {
      results[k] = [];
    });
    Object.keys(things).forEach((key) => {
      if (things[key] instanceof Building) {
        const bld = things[key] as Building;
        results[bld.buildingType].push(bld);
      }
    });
    return results;
  },
  entities: ({things}) => {
    const results: {[k in string]: Entity} = {};
    Object.keys(things).forEach((key) => {
      if (things[key] instanceof Entity) {
        results[key] = things[key] as Entity;
      }
    });
    return results;
  },
  territoryPlayersByAxial: ({map}, {buildingsByType}) => {
    const territorialBuildings = buildingsByType[BuildingType.BASE].concat(buildingsByType[BuildingType.RECLAIMATOR]);
    const results: {[k in string]: number[]} = {};
    const mapKeys = Object.keys(map);
    territorialBuildings.forEach((bld) => {
      if (bld.progress < BuildingProperty[bld.buildingType].struct) {
        return;
      }
      const axialRange = bld.tilePosition.range(TERRITORY_RADIUS[bld.buildingType]);
      axialRange.map((axial) => axial.asString)
        .filter((a) => mapKeys.includes(a))
        .forEach((key) => {
          results[key] = results[key] || [];
          if (!results[key].includes(bld.playerId)) {
            results[key].push(bld.playerId);
          }
      });
    });
    return results;
  },
};

export const game: Module<GameState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
