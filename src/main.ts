import Vue from 'vue';
// @ts-ignore
import Fragment from 'vue-fragment';

Vue.config.productionTip = false;
Vue.use(Fragment);

import App from './App.vue';

new Vue({
  render: (h) => h(App),
}).$mount('#app');
