import {GameAction, GameGetter, GameMutation, RootState, UIMutation, UIState} from '@/store/types';
import {Module} from 'vuex';
import {Vue} from 'vue-property-decorator';

const state: UIState = {
  selectedTile: '',
  showingJobs: false,
};

const mutations: UIMutation = {
  selectTile(s, { axial }): void {
    s.selectedTile = axial;
  },
  setShowingJobs(s, {showingJobs}): void {
    s.showingJobs = showingJobs;
  },
};

export const ui: Module<UIState, RootState> = {
  namespaced: true,
  state,
  mutations,
};
