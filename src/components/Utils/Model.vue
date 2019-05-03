<template>

</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {VglObject3d} from 'vue-gl';
  import {Color, Object3D} from 'three';

  @Component({
    mixins: [VglObject3d]
  })
  export default class Model extends Vue {
    @Prop() public model!: string;
    @Prop() public accent: Color = new Color(1, 0, 0);

    // public get inst(): Object3D {
    //
    // }

    private created() {
      // save model into namespace for caching
    }
  }
</script>

<style scoped lang="scss">

</style>
