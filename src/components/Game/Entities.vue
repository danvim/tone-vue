<template>
  <fragment>
    <entity-c v-for="(entity, k) in entities" :entity="entity" :key="k"/>
  </fragment>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import EntityC from '@/components/Game/EntityC.vue';
  import {namespace} from 'vuex-class';
  import * as Vgl from 'vue-gl';
  import Model from '@/components/Utils/Model.vue';
  import Entity from '@/game/Entity';

  const game = namespace('game');

  const {
    VglGroup,
  } = Vgl;

  @Component({
    components: {Model, VglGroup, EntityC},
  })
  export default class Entities extends Vue {
    @game.Getter public entities!: {[k in string]: Entity};
  }
</script>

<style scoped lang="scss">

</style>
