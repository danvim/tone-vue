<template>
  <div class="prompt-target" :class="{active: promptTarget}">
    <h1 class="text-center">Select unit or building as target</h1>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';

  const ui = namespace('ui');

  @Component({})
  export default class PromptTarget extends Vue {
    @ui.State public promptTarget!: boolean;
  }
</script>

<style scoped lang="scss">

</style>
