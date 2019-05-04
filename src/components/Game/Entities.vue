<template>
  <fragment>
    <entity v-for="(entityInfo, k) in entityInfos" :entity-info="entityInfo" :key="k"/>
<!--    <model model="WORKER" :accent="testColor" position="0, 0, 0" rotation="0, 0, 0"/>-->
  </fragment>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Entity from '@/components/Game/Entity.vue';
  import EntityInfo from '@/game/EntityInfo';
  import {namespace} from 'vuex-class';
  import * as Vgl from 'vue-gl';
  import {Color} from 'vue-gl/node_modules/three';
  import Model from '@/components/Utils/Model.vue';

  const game = namespace('game');

  const {
    VglGroup,
  } = Vgl;

  @Component({
    components: {Model, VglGroup, Entity},
  })
  export default class Entities extends Vue {
    @game.State public entityInfos!: {[k in string]: EntityInfo};
    public testColor = new Color(0, 0, 1);
  }
</script>

<style scoped lang="scss">

</style>
