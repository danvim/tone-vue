<template>
  <popper :options="popperOptions" :delay-on-mouse-over="500" :append-to-body="true" class="icon-button-wrapper">
    <div class="popper">
      {{text}}
    </div>
    <button type="button" class="icon-button" slot="reference" @click="onClick"><i :class="iconClass"></i></button>
  </popper>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  // tslint:disable-next-line
  const Popper = require('vue-popperjs');

  @Component({
    components: {
      popper: Popper,
    },
  })
  export default class IconButton extends Vue {
    @Prop() public text!: string;
    @Prop() public iconClass!: string;
    @Prop() public onClick!: () => void;

    private popperOptions = {
      placement: 'right',
      modifiers: {
        preventOverflow: {
          boundariesElement: 'viewport',
        },
      },
    };
  }
</script>

<style scoped lang="scss">

</style>
