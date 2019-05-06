<template>
  <div id="side-bar">
    <div class="bar">
      <icon-button v-if="myBase" icon-class="green tone-base" text="Base" :on-click="onClickBuilding(myBase)"/>
      <icon-button v-for="barrack in myBarracks" :key="barrack.uuid" icon-class="light tone-barrack" text="Barrack" :on-click="onClickBuilding(barrack)"/>
    </div>
    <div class="bar">
      <icon-button icon-class="red tone-berserk" text="All-Out Attack" :on-click="onClickAttack"/>
      <icon-button icon-class="yellow tone-job" text="Jobs" :on-click="onClickJobs"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import IconButton from '@/components/UI/IconButton.vue';
  import {namespace} from 'vuex-class';
  import Building from '@/game/Building';
  import {BuildingType} from 'tone-core/dist/lib';
  import Player from '@/utils/Player';
  // tslint:disable-next-line
  const Popper = require('vue-popperjs');

  const game = namespace('game');
  const ui = namespace('ui');

  /**
   * This component carries the shortcuts to buildings and workers commands, including all-out attack and schedules.
   */
  @Component({
    components: {
      IconButton,
      popper: Popper,
    },
  })
  export default class SideBar extends Vue {
    @game.Getter public buildingsByType!: {[k in BuildingType]: Building[]};
    @game.State public me!: Player | null;
    @ui.Mutation public selectTile!: any;

    private popperOptions = {
      placement: 'right',
      modifiers: {
        preventOverflow: {
          boundariesElement: 'viewport',
        },
      },
    };

    public onClickBuilding(building: Building) {
      return () => this.selectTile({axial: building.tilePosition.asString});
    }

    public onClickAttack(): void {

    }

    public onClickJobs(): void {

    }

    public myBuildings(buildings: Building[]): Building[] {
      return buildings.filter(
        bld => this.me !== null && bld.playerId === this.me.playerId
      );
    }

    public get myBase(): Building {
      return this.myBuildings(this.buildingsByType[BuildingType.BASE] || [])[0];
    }

    public get myBarracks(): Building[] {
      return this.myBuildings(this.buildingsByType[BuildingType.BARRACK] || []);
    }
  }
</script>

<style scoped>

</style>
