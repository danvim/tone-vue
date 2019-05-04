<template>
  <model :model="entityInfo.model" :accent="accent" :position="v3(entityInfo.nextLocRot.position)" :rotation="v3(entityInfo.nextLocRot.rotation)"/>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import EntityInfo from '@/game/EntityInfo';
  import {VglMesh, VglObject3d} from 'vue-gl';
  import MeshLoader from '@/assets/MeshLoader';
  import Model from '@/components/Utils/Model.vue';
  import {ACCENTS} from '@/configs/Players';
  import {v3} from '@/utils/vglHelpers';

  @Component({
    components: {
      Model,
      VglObject3d,
      VglMesh,
    },
  })
  export default class Entity extends Vue {
    @Prop() public entityInfo!: EntityInfo;

    private v3 = v3;

    public get accent() {
      return ACCENTS[this.entityInfo.playerId];
    }

  }
</script>

<style scoped lang="scss">

</style>
