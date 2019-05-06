<template>
  <vgl-object3d>

  </vgl-object3d>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {VglObject3d} from 'vue-gl';

  @Component({
    components: {VglObject3d},
  })
  export default class ProgressBar extends Vue {
  }
</script>

<style scoped lang="scss">

</style>
