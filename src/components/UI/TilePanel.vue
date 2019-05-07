import {PackageType} from 'tone-core/dist/lib';
import {BuildingType} from 'tone-core/dist/lib';
<template>
  <div id="tile-panel" class="panel" v-if="selectedTile !== ''">
    <h3>Tile Info</h3>
    <p>Building: {{buildingName}}</p>

    <div v-if="building">
      <p v-if="buildingProgress === 1">HP: {{building.hp}}/{{buildingFullHp}}</p>
      <div v-if="me && building.playerId === me.playerId">
        <p v-if="buildingProgress !== 1">Progress: {{building.progress}}/{{buildingStruct}}</p>
        <div v-if="buildingProgress === 1 && isStorage">
          <popper class="resource resource-lg" v-if="storageTypes.includes(resourceType.STRUCT)" :options="popperOptions" :delay-on-mouse-over="500" :append-to-body="true">
            <div class="popper">
              Struct - Used for construction
            </div>
            <div slot="reference">
              <i class="blue icon tone-struct"></i>
              <span class="resource-text">{{building.struct}}</span>
            </div>
          </popper>
          <popper class="resource resource-lg" v-if="storageTypes.includes(resourceType.TRAINING_DATA)" :options="popperOptions" :delay-on-mouse-over="500" :append-to-body="true">
            <div class="popper">
              Training Data - Used for converting workers to soldiers
            </div>
            <div slot="reference">
              <i class="red icon tone-training"></i>
              <span class="resource-text">{{building.training}}</span>
            </div>
          </popper>
          <popper class="resource resource-lg" v-if="storageTypes.includes(resourceType.PRIME_DATA)" :options="popperOptions" :delay-on-mouse-over="500" :append-to-body="true">
            <div class="popper">
              Prime Data - ???
            </div>
            <div slot="reference">
              <i class="yellow icon tone-prime"></i>
              <span class="resource-text">{{building.prime}}</span>
            </div>
          </popper>
        </div>
        <div v-if="buildingProgress === 1 && building.buildingType === buildingType.BARRACK" class="barrack-choice">
          <button type="button" class="btn btn-yellow" @click="fight(fightingStyle.PASSIVE)"><i class="tone-shield"></i> Defend</button>
          <button type="button" class="btn btn-red" @click="fight(fightingStyle.AGGRESSIVE)"><i class="tone-sword"></i> Attack</button>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="build-radio">
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.STRUCT_GENERATOR" :class="{active: tryBuildType === buildingType.STRUCT_GENERATOR}"><i class="blue icon tone-struct"></i> {{buildingProperty[buildingType.STRUCT_GENERATOR].struct}} Struct Gen.</button>
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.TRAINING_DATA_GENERATOR" :class="{active: tryBuildType === buildingType.TRAINING_DATA_GENERATOR}"><i class="blue icon tone-struct"></i> {{buildingProperty[buildingType.TRAINING_DATA_GENERATOR].struct}} Training Gen.</button>
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.RECLAIMATOR" :class="{active: tryBuildType === buildingType.RECLAIMATOR}"><i class="blue icon tone-struct"></i> {{buildingProperty[buildingType.RECLAIMATOR].struct}} Reclaimator</button>
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.BARRACK" :class="{active: tryBuildType === buildingType.BARRACK}"><i class="blue icon tone-struct"></i> {{buildingProperty[buildingType.BARRACK].struct}} Barrack</button>
      </div>
      <div class="center">
        <button type="button" class="btn btn-sm btn-blue" @click="tryBuild"><i class="tone-building"></i> Build</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';
  import Building, {INSTANT_BUILDINGS, STORABLE_STORAGE, STORAGE_BUILDINGS} from '@/game/Building';
  import {
    Axial,
    BuildingProperty,
    BuildingType,
    FightingStyle,
    PackageType,
    ResourceType,
    TryBuildMessage,
  } from 'tone-core/dist/lib';
  import {snakeToTitle} from '@/utils/String';
  import Player from '@/utils/Player';
  // tslint:disable-next-line
  const Popper = require('vue-popperjs');

  const game = namespace('game');
  const ui = namespace('ui');

  @Component({
    components: {
      popper: Popper,
    },
  })
  export default class TilePanel extends Vue {
    @ui.State public selectedTile!: string;
    @ui.Mutation public setPromptTarget: any;
    @ui.Mutation public setAttackSource: any;
    @ui.Mutation public setFightingStyle: any;
    @game.Getter public buildingsByAxial!: {[k in string]: Building};
    @game.State public me!: Player;
    public tryBuildType: BuildingType = BuildingType.STRUCT_GENERATOR;

    private buildingType = BuildingType;
    private resourceType = ResourceType;
    private buildingProperty = BuildingProperty;
    private fightingStyle = FightingStyle;
    private popperOptions = {
      placement: 'top',
    };

    public tryBuild(): void {
      window.protocol.emit(PackageType.TRY_BUILD, {
        axialCoords: [
          Axial.fromString(this.selectedTile),
        ],
        buildingType: this.tryBuildType,
      });
    }

    public fight(fightingStyle: FightingStyle): void {
      this.setPromptTarget({promptTarget: true});
      this.setAttackSource({attackSource: this.building!.uuid});
      this.setFightingStyle({fightingStyle});
    }

    public get building(): Building | null {
      if (this.buildingsByAxial.hasOwnProperty(this.selectedTile)) {
        return this.buildingsByAxial[this.selectedTile];
      } else {
        return null;
      }
    }

    public get buildingName(): string {
      return this.building ? snakeToTitle(BuildingType[this.building.buildingType]) : 'None';
    }

    public get buildingFullHp(): number {
      return this.building ? BuildingProperty[this.building.buildingType].hp : 1;
    }

    public get isStorage(): boolean {
      return this.building !== null && STORAGE_BUILDINGS.includes(this.building.buildingType);
    }

    public get buildingProgress(): number {
      if (this.building !== null && INSTANT_BUILDINGS.includes(this.building.buildingType)) {
        return 1;
      }
      if (this.building !== null) {
        return this.building.progress / this.buildingStruct;
      }
      return 0;
    }

    public get buildingStruct(): number {
      if (this.building !== null) {
        return BuildingProperty[this.building.buildingType].struct;
      }
      return 1;
    }

    public get storageTypes(): ResourceType[] {
      if (this.building === null || !this.isStorage) {
        return [];
      }
      return STORABLE_STORAGE[this.building.buildingType];
    }
  }
</script>

<style scoped lang="scss">

</style>
