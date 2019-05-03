<template>
  <vgl-object3d :cast-shadow="true" :receive-shadow="true" name="tile-obj" ref="tileObj">
    <vgl-mesh :geometry="resourceName" :material="heightName" :cast-shadow="true" :receive-shadow="true" name="tile-mesh"/>
  </vgl-object3d>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import EntityInfo from '@/game/EntityInfo';
  import {VglMesh, VglObject3d} from 'vue-gl';
  import MeshLoader from '@/assets/MeshLoader';

  @Component({
    components: {
      VglObject3d,
      VglMesh,
    }
  })
  export default class Entity extends Vue {
    @Prop() entityInfo!: EntityInfo;

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
