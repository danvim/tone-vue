import {RootState, UIMutation, UIState} from '@/store/types';
import {Module} from 'vuex';
import {FightingStyle} from 'tone-core/dist/lib';

const state: UIState = {
  selectedTile: '',
  showingJobs: false,
  promptTarget: false,
  currentStrategy: FightingStyle.AGGRESSIVE,
  attackSource: '',
};

const mutations: UIMutation = {
  selectTile(s, { axial }): void {
    s.selectedTile = axial;
  },
  setShowingJobs(s, {showingJobs}): void {
    s.showingJobs = showingJobs;
  },
  setPromptTarget(s, {promptTarget}): void {
    s.promptTarget = promptTarget;
  },
  setAttackSource(s, { attackSource }): void {
    s.attackSource = attackSource;
  },
  setFightingStyle(s, { fightingStyle }): void {
    s.currentStrategy = fightingStyle;
  },
};

export const ui: Module<UIState, RootState> = {
  namespaced: true,
  state,
  mutations,
};
