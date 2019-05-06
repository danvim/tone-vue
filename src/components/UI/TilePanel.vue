import {PackageType} from 'tone-core/dist/lib';
import {BuildingType} from 'tone-core/dist/lib';
<template>
  <div id="tile-panel" class="panel" v-if="selectedTile !== ''">
    <h3>Tile Info</h3>
    <p>Building: {{buildingName}}</p>

    <div v-if="building">
      <p>HP: {{building.hp}}/1000</p>
      <fragment v-if="me && building.playerId === me.playerId">
        <div v-if="isStorage">
          <div class="resource">
            <i class="blue icon tone-struct"></i>
            <span class="resource-text">0</span>
          </div>
          <div class="resource">
            <i class="red icon tone-training"></i>
            <span class="resource-text">0</span>
          </div>
          <div class="resource">
            <i class="yellow icon tone-prime"></i>
            <span class="resource-text">0</span>
          </div>
        </div>
      </fragment>
    </div>

    <div v-else>
      <div class="build-radio">
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.STRUCT_GENERATOR" :class="{active: tryBuildType === buildingType.STRUCT_GENERATOR}">Struct Generator</button>
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.TRAINING_DATA_GENERATOR" :class="{active: tryBuildType === buildingType.TRAINING_DATA_GENERATOR}">Training Data Gen.</button>
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.RECLAIMATOR" :class="{active: tryBuildType === buildingType.RECLAIMATOR}">Reclaimator</button>
        <button type="button" class="btn btn-sm btn-outline" @click="tryBuildType = buildingType.BARRACK" :class="{active: tryBuildType === buildingType.BARRACK}">Barrack</button>
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
  import Building, {STORAGE_BUILDINGS} from '@/game/Building';
  import {Axial, BuildingType, PackageType, TryBuildMessage} from 'tone-core/dist/lib';
  import {snakeToTitle} from '@/utils/String';
  import Player from '@/utils/Player';

  const game = namespace('game');
  const ui = namespace('ui');

  @Component({})
  export default class TilePanel extends Vue {
    @ui.State public selectedTile!: string;
    @game.Getter public buildingsByAxial!: {[k in string]: Building};
    @game.State public me!: Player;
    public tryBuildType: BuildingType = BuildingType.STRUCT_GENERATOR;

    private buildingType = BuildingType;

    public tryBuild(): void {
      window.protocol.emit(PackageType.TRY_BUILD, {
        axialCoords: [
          Axial.fromString(this.selectedTile),
        ],
        buildingType: this.tryBuildType
      });
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

    public get isStorage(): boolean {
      return this.building !== null && STORAGE_BUILDINGS.includes(this.building.buildingType);
    }
  }
</script>

<style scoped lang="scss">

</style>
