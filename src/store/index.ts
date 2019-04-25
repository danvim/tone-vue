import Vuex, {StoreOptions} from 'vuex';
import {GameState, RootState} from '@/store/types';
import {game} from '@/store/modules/game';

export const store: StoreOptions<RootState> = {
  state: {
    version: '0.0.1',
  },
  modules: {
    game,
  },
};
