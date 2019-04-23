import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import Peer, {DataConnection} from 'peerjs';
import axios from 'axios';
// @ts-ignore
import Fragment from 'vue-fragment';

Vue.config.productionTip = false;
Vue.use(Fragment);
Vue.use(Vuex);

import App from './App.vue';
import { store } from '@/store';
import { Protocol, PackageType } from 'tone-core/dist/lib/Protocol';
import { HOST, PEER_PATH, PORT } from '@/configs/Server';

declare global {
  interface Window {
    protocol: Protocol;
    peer: Peer;
    peerConn: DataConnection;
  }
}

const protocol = window.protocol = new Protocol();
const peer = window.peer = new Peer({
  host: HOST,
  port: PORT,
  path: PEER_PATH,
});

const peerConn = window.peerConn = window.peer.connect('server', { serialization: 'none' });

new Vue({
  render: (h) => h(App),
  store: new Store(store),
}).$mount('#app');
