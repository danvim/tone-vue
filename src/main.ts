import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import Peer from 'peerjs';
// @ts-ignore
import Fragment from 'vue-fragment';

Vue.config.productionTip = false;
Vue.use(Fragment);
Vue.use(Vuex);

import App from './App.vue';
import {store} from '@/store';
import {Protocol, PackageType} from 'tone-core/dist/lib';
import {HOST, PEER_PATH, PORT} from '@/configs/Server';


declare global { interface Window {
  protocol: Protocol;
  peer: Peer;
}}

const protocol = (window as any).protocol = new Protocol();
const peer = (window as any).peer = new Peer({
  host: HOST,
  port: PORT,
  path: PEER_PATH,
});

const peerConn = window.peer.connect('server', {serialization: 'none'});

peerConn.on('data', (data) => {
  window.console.log('peerConn', data);
});

peerConn.on('open', () => {
  protocol.add(peerConn);
  protocol.emit(PackageType.TRY_JOIN_LOBBY, { username: 'Daniel' });
});

new Vue({
  render: (h) => h(App),
  store: new Store(store),
}).$mount('#app');
