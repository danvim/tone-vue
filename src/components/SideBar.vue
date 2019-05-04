<template>
  <div id="side-bar">
    <div class="bar">
      <icon-button icon-class="green tone-base" text="Base" :on-click="onClick"/>
      <icon-button icon-class="light tone-barrack" text="Barrack" :on-click="onClick"/>
      <icon-button icon-class="light tone-barrack" text="Barrack" :on-click="onClick"/>
      <icon-button icon-class="light tone-barrack" text="Barrack" :on-click="onClick"/>
    </div>
    <div class="bar">
      <icon-button icon-class="red tone-berserk" text="All-Out Attack" :on-click="onClick"/>
      <icon-button icon-class="yellow tone-job" text="Jobs" :on-click="onClick"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import IconButton from '@/components/UI/IconButton.vue';
  // tslint:disable-next-line
  const Popper = require('vue-popperjs');


  /**
   * This component carries the shortcuts to buildings and workers commands, including all-out attack and schedules.
   */
  @Component({
    components: {
      IconButton,
      popper: Popper,
    },
  })
  export default class SideBar extends Vue {
    private popperOptions = {
      placement: 'right',
      modifiers: {
        preventOverflow: {
          boundariesElement: 'viewport',
        },
      },
    };

    public onClick() {
      //
    }
  }
</script>

<style scoped>

</style>
