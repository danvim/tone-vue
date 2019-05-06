<template>
  <model :model="model" :accent="accent" position="0, 0, 0" rotation="0, 0, 0" :cast-shadow="true" :receive-shadow="true"/>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';
  import Building from '@/game/Building';
  import Model from '@/components/Utils/Model.vue';
  import {ACCENTS} from '@/configs/Players';
  import {Color} from 'vue-gl/node_modules/three';

  const game = namespace('game');

  @Component({
    components: {Model}
  })
  export default class BuildingC extends Vue {
    @Prop() public building!: Building;

    public get model(): string {
      return this.building.model;
    }

    public get accent(): Color {
      return ACCENTS[this.building.playerId];
    }
  }
</script>
