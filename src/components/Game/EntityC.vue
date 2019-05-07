<template>
  <vgl-object3d>
    <model :model="model" :accent="accent" :position="v3(entity.nextPosition)" :rotation="v3(entity.nextRotation)" :cast-shadow="true" :receive-shadow="true"/>
    <vgl-box-geometry :width="10" :height="10" :depth="10" name="entityBox"/>
    <vgl-mesh geometry="entityBox" :position="v3(boxPosition)" ref="boundingBox" :visible="false"/>
  </vgl-object3d>
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

    public get boxPosition() {
      return this.entity.nextPosition.clone().add(new Vector3(0, 15, 0));
    }

    public get boxMesh(): Object3D {
      return this.$refs.boundingBox.inst;
    }

  }
</script>
