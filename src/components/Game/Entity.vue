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
    }
  })
  export default class Entity extends Vue {
    @Prop() entityInfo!: EntityInfo;

    private v3 = v3;

    public get accent() {
      return ACCENTS[this.entityInfo.playerId];
    }

    private created() {
      const meshLoader = MeshLoader.getInstance();

      if (meshLoader.objects.hasOwnProperty(this.entityInfo.model)) {
        // The model can be loaded. The mesh will be cloned and player color will be updated in its materials.
        const obj = meshLoader.objects[this.entityInfo.model];
        window.console.log(obj);
      } else {
        // The model wasn't loaded. Perhaps the config hasn't been updated or the model is unknown.
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
