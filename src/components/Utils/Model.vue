<template>

</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {VglObject3d} from 'vue-gl';
  import {BoxGeometry, Color, Mesh, MeshPhongMaterial, Object3D} from 'vue-gl/node_modules/three';
  import {Namespace, v3, VglObject3d as VglObject3dX} from '@/utils/vglHelpers';
  import MeshLoader from '@/assets/MeshLoader';
  import {applyAccent} from '@/utils/threeHelper';

  @Component({
    mixins: [VglObject3d],
  })
  export default class Model extends Vue {
    @Prop() public model!: string;
    @Prop() public accent!: Color;

    public vglNamespace!: Namespace;
    public vglObject3d!: VglObject3dX;
    public isLoaded: boolean = false;
    public selfObject?: Object3D;

    public get inst(): Object3D {
      const target = this.selfObject;
      return this.isLoaded && target && target.type ? target : this.dummyObject;
    }

    public get resourceName(): string {
      return `${this.model}-${this.accent.getHexString()}`;
    }

    public get dummyObject() {
      const m = new Mesh();
      m.geometry = new BoxGeometry(20, 20, 20);
      m.material = new MeshPhongMaterial();
      m.parent = this.vglObject3d.inst;
      return m;
    }

    private created() {
      // save model into namespace for caching
      const meshLoader = MeshLoader.getInstance();

      if (!this.vglNamespace.object3ds[this.resourceName]) {
        let obj: Object3D;

        meshLoader.onLoad(() => {
          if (meshLoader.objects[this.model]) {
            obj = meshLoader.objects[this.model].clone();
          } else {
            window.console.error(`Cannot find model ${this.model} from mesh loader instance!`);
            return;
          }

          obj.parent = this.vglObject3d.inst;

          applyAccent(obj, this.accent);

          this.vglNamespace.object3ds[this.resourceName] = obj;

          this.selfObject = obj.clone(true);

          this.isLoaded = true;
        });
      } else {
        this.selfObject = this.vglNamespace.object3ds[this.resourceName].clone();
        this.isLoaded = true;
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
