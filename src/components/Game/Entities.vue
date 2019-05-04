<template>
  <vgl-group name="entities">
    <entity v-for="entityInfo in entityInfos" :entity-info="entityInfo"/>
  </vgl-group>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Entity from '@/components/Game/Entity.vue';
  import EntityInfo from '@/game/EntityInfo';
  import {namespace} from 'vuex-class';
  import * as Vgl from 'vue-gl';

  const game = namespace('game');

  const {
    VglGroup,
  } = Vgl;

  @Component({
    components: {VglGroup, Entity}
  })
  export default class Entities extends Vue {
    @game.State public entityInfos!: EntityInfo[];
  }
</script>

<style scoped lang="scss">

</style>
