<template>
  <model :model="model" :accent="accent" :position="v3(entity.nextPosition)" :rotation="v3(entity.nextRotation)"/>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {VglMesh, VglObject3d} from 'vue-gl';
  import Model from '@/components/Utils/Model.vue';
  import {ACCENTS} from '@/configs/Players';
  import {v3} from '@/utils/vglHelpers';
  import Entity from '@/game/Entity';
  import {ENTITY_MESH_DICT} from '@/configs/EntityMeshDict';

  @Component({
    components: {
      Model,
      VglObject3d,
      VglMesh,
    },
  })
  export default class EntityC extends Vue {
    @Prop() public entity!: Entity;

    private v3 = v3;

    public get accent() {
      return ACCENTS[this.entity.playerId];
    }

    public get model() {
      return ENTITY_MESH_DICT[this.entity.entityType];
    }

  }
</script>

<style scoped lang="scss">

</style>
