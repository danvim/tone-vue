<template>
  <model :model="model" :accent="accent" :position="v3(entity.nextPosition)" :rotation="v3(entity.nextRotation)" :cast-shadow="true" :receive-shadow="true"/>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {VglMesh, VglObject3d, VglBoxGeometry} from 'vue-gl';
  import Model from '@/components/Utils/Model.vue';
  import {ACCENTS} from '@/configs/Players';
  import {v3, VglObject3d as VglObject3dX} from '@/utils/vglHelpers';
  import Entity from '@/game/Entity';
  import {ENTITY_MESH_DICT} from '@/configs/EntityMeshDict';
  import {Vector3, Object3D} from 'vue-gl/node_modules/three';

  @Component({
    components: {
      Model,
      VglObject3d,
      VglBoxGeometry,
      VglMesh,
    },
  })
  export default class EntityC extends Vue {
    @Prop() public entity!: Entity;

    public $refs!: {
      boundingBox: VglObject3dX,
    };

    private v3 = v3;

    public get accent() {
      return ACCENTS[this.entity.playerId];
    }

    public get model() {
      return ENTITY_MESH_DICT[this.entity.entityType];
    }

  }
</script>
