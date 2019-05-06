import {PackageType} from 'tone-core/dist/lib';
<template>
  <div id="jobs-panel" class="panel" v-if="showingJobs">
    <h3>Jobs</h3>
    <div class="jobs-details">
      <div class="job-row" v-for="(job, k) in jobs" :key="k" @click="selectedJob = job" :class="{active: selectedJob === job}">
        <span class="description"><i :class="priorityIcons[job.priority]"></i> {{jobDescription(job)}}</span>
        <span class="worker-pop">({{job.workerIds.length}})</span>
      </div>
    </div>
    <div class="jobs-buttons">
      <button v-for="(i, k) in priorityIcons" v-if="k !== jobPriority.SUSPENDED.toString()" :key="k" type="button" class="btn btn-sm btn-blue" :disabled="!selectedJob" @click="setPriority(parseInt(k))"><i :class="i"></i></button>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';
  import {BuildingType, JobNature, JobPriority, PackageType, UpdateJobMessage} from 'tone-core/dist/lib';
  import Building, {RESOURCE_NAMES} from '@/game/Building';
  import {snakeToTitle} from '@/utils/String';

  const game = namespace('game');
  const ui = namespace('ui');

  const PRIORITY_ICONS: {[k in JobPriority]: string} = {
    [JobPriority.SUSPENDED]: 'tone-pause',
    [JobPriority.PAUSED]: 'tone-pause',
    [JobPriority.LOW]: 'tone-slow',
    [JobPriority.MEDIUM]: 'tone-normal',
    [JobPriority.HIGH]: 'tone-fast',
    [JobPriority.EXCLUSIVE]: 'tone-priority',
  };

  @Component({})
  export default class JobsPanel extends Vue {
    @game.State public jobs!: {[k in string]: UpdateJobMessage};
    @game.Getter public buildingsByUuid!: {[k in string]: Building};
    @ui.State public selectedTile!: string;
    @ui.State public showingJobs!: boolean;
    @ui.Mutation public setShowingJobs!: any;

    public selectedJob: UpdateJobMessage | null = null;

    private priorityIcons = PRIORITY_ICONS;
    private jobPriority = JobPriority;

    public jobDescription(job: UpdateJobMessage): string {
      const targetBuilding = this.buildingsByUuid[job.buildingId];
      if (!targetBuilding) {
        window.console.error(`No building with UUID ${job.buildingId} but associated with job.`);
        return '';
      }
      const buildingName = snakeToTitle(BuildingType[targetBuilding.buildingType]);
      if (job.nature === JobNature.CONSTRUCTION) {
        return `Constructing ${buildingName}.`;
      } else if (job.nature === JobNature.STORAGE) {
        return `Collecting ${RESOURCE_NAMES[job.resourceType]} to ${buildingName}.`;
      } else if (job.nature === JobNature.RECRUITMENT) {
        return `Training soldiers at ${buildingName}`;
      }
      return '';
    }

    public setPriority(priority: JobPriority) {
      if (this.selectedJob !== null) {
        window.protocol.emit(PackageType.TRY_SET_JOB, {
          jobId: this.selectedJob.jobId,
          priority,
        });
      }
    }

    @Watch('selectedTile')
    private onSelectTile() {
      this.setShowingJobs({showingJobs: false});
    }
  }
</script>

<style scoped lang="scss">

</style>
