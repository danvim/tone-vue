<template>
  <vgl-object3d :position="v3(position)" :cast-shadow="true" :receive-shadow="true" ref="m">
    <model :model="model" :accent="accent" :cast-shadow="true" :receive-shadow="true"/>
  </vgl-object3d>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';
  import Building from '@/game/Building';
  import Model from '@/components/Utils/Model.vue';
  import {ACCENTS} from '@/configs/Players';
  import {Color, Box3, Vector3, Object3D} from 'vue-gl/node_modules/three';
  import {BuildingProperty} from 'tone-core/dist/lib';
  import {VglObject3d as VglObject3dX, v3} from '@/utils/vglHelpers';
  import {VglObject3d, VglBoxGeometry, VglMesh} from 'vue-gl';

  const game = namespace('game');

  @Component({
    components: {
      VglBoxGeometry,
      VglObject3d,
      VglMesh,
      Model,
    },
  })
  export default class BuildingC extends Vue {
    @Prop() public building!: Building;

    public $refs!: {
      m: VglObject3dX,
      boundingBox: VglObject3dX,
    };

    public v3 = v3;

    public get model(): string {
      return this.building.model;
    }

    public get accent(): Color {
      return ACCENTS[this.building.playerId];
    }

    public get position(): Vector3 {
      return new Vector3(0, this.offset, 0);
    }

    public get progress(): number {
      return this.building.progress / BuildingProperty[this.building.buildingType].struct;
    }

    public get buildingHeight(): number {
      if (!this.$refs.m) {
        return 27;
      }
      const box = new Box3().setFromObject(this.$refs.m.inst);
      const v = new Vector3();
      box.getSize(v);
      return v.y;
    }

    public get offset(): number {
      return (this.progress - 1) * this.buildingHeight;
    }
  }
</script>
